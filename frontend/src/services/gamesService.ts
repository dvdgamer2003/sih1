import { addToQueue } from '../offline/syncQueue';
import NetInfo from '@react-native-community/netinfo';

export interface GameResult {
    gameType: 'ODD_ONE_OUT' | 'MEMORY_MATCH';
    score: number;
    timeSpent: number; // in seconds
    timestamp: number;
    userId?: string;
}

/**
 * Save game result - handles online/offline scenarios
 */
export const saveGameResult = async (result: GameResult): Promise<void> => {
    const netInfo = await NetInfo.fetch();

    if (netInfo.isConnected) {
        try {
            // TODO: Replace with actual API call when backend is ready
            // await api.post('/game_results', result);
            console.log('[GamesService] Saving game result online:', result);
            await new Promise((resolve) => setTimeout(resolve, 500));
        } catch (error) {
            console.error('[GamesService] Failed to save online, queuing...', error);
            await addToQueue('SUBMIT_GAME_RESULT', result);
        }
    } else {
        console.log('[GamesService] Offline, queuing game result:', result);
        await addToQueue('SUBMIT_GAME_RESULT', result);
    }
};
