import api from './api';
import { addToQueue } from '../offline/syncQueue';
import NetInfo from '@react-native-community/netinfo';

export interface GameResult {
    gameId: string;
    score: number;
    maxScore?: number;
    timeTaken: number; // in seconds
    accuracy?: number;
    difficulty?: string;
    completedLevel?: number;
    timestamp?: number;
    // Added for Delta Assessment
    subject?: string;
    classLevel?: string;
    delta?: number;
    proficiency?: string;
    userId?: string;
    attempts?: number;
    mistakes?: number;
}

import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Save game result - handles online/offline scenarios and updates local analytics
 */
export const saveGameResult = async (result: GameResult): Promise<void> => {
    const netInfo = await NetInfo.fetch();
    const resultWithTimestamp = { ...result, timestamp: Date.now() };

    // 1. Local Persistence for Delta Analytics (Offline-First)
    if (result.userId && result.subject && result.classLevel) {
        try {
            const key = `gameResults_${result.userId}_${result.classLevel}_${result.subject}`;
            const existingData = await AsyncStorage.getItem(key);
            const history = existingData ? JSON.parse(existingData) : [];
            history.push(resultWithTimestamp);
            await AsyncStorage.setItem(key, JSON.stringify(history));
            console.log('[GamesService] Saved local analytics for', key);
        } catch (localError) {
            console.error('[GamesService] Failed to save local analytics:', localError);
        }
    }

    // 2. Remote / Sync Queue
    if (netInfo.isConnected) {
        try {
            const response = await api.post('/games/result', resultWithTimestamp);
            console.log('[GamesService] Saved game result online:', response.data);
        } catch (error) {
            console.error('[GamesService] Failed to save online, queuing...', error);
            await addToQueue('SUBMIT_GAME_RESULT', resultWithTimestamp);
        }
    } else {
        console.log('[GamesService] Offline, queuing game result:', resultWithTimestamp);
        await addToQueue('SUBMIT_GAME_RESULT', resultWithTimestamp);
    }
}


// Fetch User Game Stats
export const getUserGameStats = async (): Promise<Record<string, { lastPlayed: string, lastTimeTaken: number, highScore: number, lastScore: number }>> => {
    const netInfo = await NetInfo.fetch();

    if (netInfo.isConnected) {
        try {
            // Note: api instance usually has base URL /api, so we just need /games/user-stats
            // Assuming 'api' imported from './api' already handles token if set in interceptors
            // If not, we should check implementation of './api'.
            // For safety, let's look at how other calls do it. saveGameResult uses api.post('/games/result')
            const response = await api.get('/games/user-stats');
            return response.data;
        } catch (error) {
            console.error('[GamesService] Failed to fetch stats:', error);
            return {};
        }
    } else {
        return {};
    }
};
