import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { syncItem } from '../services/syncService';

const QUEUE_KEY = 'sync_queue';

export interface QueueItem {
    id: string;
    type: 'SUBMIT_QUIZ_RESULT' | 'SUBMIT_GAME_RESULT' | 'GENERIC_SYNC' | 'SYNC_XP' | 'SYNC_CHAPTER_PROGRESS';
    data: any;
    timestamp: number;
    retryCount: number;
}

// Queue processing state
let isProcessing = false;

// Listeners for queue changes
type QueueListener = (items: QueueItem[]) => void;
const listeners: QueueListener[] = [];

/**
 * Subscribe to queue changes
 */
export const subscribeToQueue = (listener: QueueListener): (() => void) => {
    listeners.push(listener);
    // Immediately call with current queue
    getQueueItems().then(listener);

    return () => {
        const index = listeners.indexOf(listener);
        if (index > -1) {
            listeners.splice(index, 1);
        }
    };
};

/**
 * Notify all listeners
 */
const notifyListeners = async () => {
    const queue = await getQueueItems();
    listeners.forEach(listener => listener(queue));
};

/**
 * Add an item to the sync queue
 */
export const addToQueue = async (type: QueueItem['type'], data: any): Promise<void> => {
    try {
        const queue = await getQueueItems();
        const newItem: QueueItem = {
            id: `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type,
            data,
            timestamp: Date.now(),
            retryCount: 0,
        };
        queue.push(newItem);
        await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
        console.log(`[SyncQueue] Added item to queue: ${type}`);
        notifyListeners();
    } catch (error) {
        console.error('[SyncQueue] Error adding to queue:', error);
    }
};

/**
 * Get all items in the queue
 */
export const getQueueItems = async (): Promise<QueueItem[]> => {
    try {
        const queueData = await AsyncStorage.getItem(QUEUE_KEY);
        return queueData ? JSON.parse(queueData) : [];
    } catch (error) {
        console.error('[SyncQueue] Error getting queue items:', error);
        return [];
    }
};

/**
 * Remove an item from the queue
 */
const removeFromQueue = async (itemId: string): Promise<void> => {
    try {
        const queue = await getQueueItems();
        const updatedQueue = queue.filter((item) => item.id !== itemId);
        await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(updatedQueue));
        console.log(`[SyncQueue] Removed item from queue: ${itemId}`);
        notifyListeners();
    } catch (error) {
        console.error('[SyncQueue] Error removing from queue:', error);
    }
};

/**
 * Update retry count for an item
 */
const updateRetryCount = async (itemId: string): Promise<void> => {
    try {
        const queue = await getQueueItems();
        const updatedQueue = queue.map((item) =>
            item.id === itemId ? { ...item, retryCount: item.retryCount + 1 } : item
        );
        await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(updatedQueue));
    } catch (error) {
        console.error('[SyncQueue] Error updating retry count:', error);
    }
};

/**
 * Process the sync queue
 */
export const processQueue = async (): Promise<void> => {
    if (isProcessing) {
        console.log('[SyncQueue] Already processing queue');
        return;
    }

    const netInfo = await NetInfo.fetch();
    const isOnline = netInfo.isConnected === true && netInfo.isInternetReachable !== false;

    if (!isOnline) {
        console.log('[SyncQueue] Device is offline, skipping queue processing', {
            isConnected: netInfo.isConnected,
            isInternetReachable: netInfo.isInternetReachable
        });
        return;
    }

    isProcessing = true;
    console.log('[SyncQueue] Starting queue processing...');

    try {
        const queue = await getQueueItems();
        console.log(`[SyncQueue] Processing ${queue.length} items`);

        for (const item of queue) {
            // Skip items that have failed too many times
            if (item.retryCount >= 3) {
                console.log(`[SyncQueue] Skipping item ${item.id} (max retries reached)`);
                continue;
            }

            try {
                await syncItem(item);
                await removeFromQueue(item.id);
                console.log(`[SyncQueue] Successfully synced item: ${item.id}`);
            } catch (error) {
                console.error(`[SyncQueue] Error syncing item ${item.id}:`, error);
                await updateRetryCount(item.id);
            }
        }

        console.log('[SyncQueue] Queue processing complete');
    } catch (error) {
        console.error('[SyncQueue] Error processing queue:', error);
    } finally {
        isProcessing = false;
    }
};

/**
 * Clear the entire queue (for testing/debugging)
 */
export const clearQueue = async (): Promise<void> => {
    try {
        await AsyncStorage.removeItem(QUEUE_KEY);
        console.log('[SyncQueue] Queue cleared');
    } catch (error) {
        console.error('[SyncQueue] Error clearing queue:', error);
    }
};

/**
 * Initialize auto-sync listener
 */
export const initializeSyncListener = (): (() => void) => {
    const unsubscribe = NetInfo.addEventListener((state) => {
        const isOnline = state.isConnected === true && state.isInternetReachable !== false;
        if (isOnline) {
            console.log('[SyncQueue] Device came online, processing queue');
            processQueue();
        }
    });

    // Process queue immediately if online
    NetInfo.fetch().then((state) => {
        const isOnline = state.isConnected === true && state.isInternetReachable !== false;
        if (isOnline) {
            console.log('[SyncQueue] Initial check - device is online, processing queue');
            processQueue();
        }
    });

    return unsubscribe;
};
