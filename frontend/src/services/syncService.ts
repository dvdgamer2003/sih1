import api from './api';
import { QueueItem } from '../offline/syncQueue';

/**
 * Sync a queue item to the backend
 */
export const syncItem = async (item: QueueItem): Promise<void> => {
    switch (item.type) {
        case 'SUBMIT_QUIZ_RESULT':
            await syncQuizResult(item.data);
            break;
        case 'SUBMIT_GAME_RESULT':
            await syncGameResult(item.data);
            break;
        case 'GENERIC_SYNC':
            await syncGeneric(item.data);
            break;
        case 'SYNC_XP':
            await syncXP(item.data);
            break;
        case 'SYNC_CHAPTER_PROGRESS':
            await syncChapterProgress(item.data);
            break;
        default:
            throw new Error(`Unknown sync type: ${item.type}`);
    }
};

/**
 * Sync quiz result to backend
 */
const syncQuizResult = async (data: any): Promise<void> => {
    // TODO: Replace with actual endpoint when backend is ready
    // await api.post('/quiz_results', data);

    // Mock implementation
    console.log('[SyncService] Syncing quiz result:', data);
    await new Promise((resolve) => setTimeout(resolve, 500));
};

/**
 * Sync game result to backend
 */
const syncGameResult = async (data: any): Promise<void> => {
    // TODO: Replace with actual endpoint when backend is ready
    // await api.post('/game_results', data);

    // Mock implementation
    console.log('[SyncService] Syncing game result:', data);
    await new Promise((resolve) => setTimeout(resolve, 500));
};

/**
 * Generic sync for other data types
 */
const syncGeneric = async (data: any): Promise<void> => {
    // TODO: Replace with actual endpoint when backend is ready
    // await api.post('/sync', data);

    // Mock implementation
    console.log('[SyncService] Syncing generic data:', data);
    await new Promise((resolve) => setTimeout(resolve, 500));
};

/**
 * Sync XP to backend
 */
const syncXP = async (data: { amount: number, source: string }): Promise<void> => {
    // await api.post('/xp/add', data);
    console.log('[SyncService] Syncing XP:', data);
    await new Promise((resolve) => setTimeout(resolve, 500));
};

/**
 * Sync chapter progress to backend
 */
const syncChapterProgress = async (data: {
    chapterId: string;
    subjectId: string;
    classId: string;
    completed: boolean;
    completedAt?: string;
}): Promise<void> => {
    try {
        console.log('[SyncService] Syncing chapter progress:', data);
        await api.post('/progress/chapter', data);
        console.log('[SyncService] Chapter progress synced successfully');
    } catch (error) {
        console.error('[SyncService] Failed to sync chapter progress:', error);
        throw error;
    }
};
