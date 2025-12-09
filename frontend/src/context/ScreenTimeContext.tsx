/**
 * Screen Time Context
 * Provides automatic tracking of app usage time across the application
 */

import React, { createContext, useContext, useEffect, useRef, useCallback } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import screenTimeService, { ActivityBreakdown } from '../services/screenTimeService';
import { useAuth } from './AuthContext';

interface ScreenTimeContextType {
    setActivity: (activity: keyof ActivityBreakdown) => void;
    logActivity: (activity: keyof ActivityBreakdown, minutes: number) => Promise<void>;
}

const ScreenTimeContext = createContext<ScreenTimeContextType | undefined>(undefined);

export const ScreenTimeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const appState = useRef(AppState.currentState);
    const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Start session when app comes to foreground
    const handleAppStateChange = useCallback(async (nextAppState: AppStateStatus) => {
        if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
            // App has come to the foreground
            console.log('[ScreenTime] App is now active, starting session');
            await screenTimeService.startSession();
        } else if (appState.current === 'active' && nextAppState.match(/inactive|background/)) {
            // App has gone to the background
            console.log('[ScreenTime] App is now in background, ending session');
            await screenTimeService.endSession();

            // Sync with backend when going to background
            if (user?._id) {
                await screenTimeService.syncWithBackend(user._id);
            }
        }
        appState.current = nextAppState;
    }, [user]);

    // Initialize tracking on mount
    useEffect(() => {
        // Start session immediately since app is active
        screenTimeService.startSession();

        // Listen for app state changes
        const subscription = AppState.addEventListener('change', handleAppStateChange);

        // Periodic sync every 5 minutes
        syncIntervalRef.current = setInterval(async () => {
            if (user?._id) {
                await screenTimeService.syncWithBackend(user._id);
            }
        }, 5 * 60 * 1000);

        return () => {
            subscription.remove();
            screenTimeService.endSession();
            if (syncIntervalRef.current) {
                clearInterval(syncIntervalRef.current);
            }
        };
    }, [handleAppStateChange, user]);

    // Set the current activity type (can be called from screens)
    const setActivity = useCallback((activity: keyof ActivityBreakdown) => {
        screenTimeService.setActivity(activity);
    }, []);

    // Log a specific activity with duration
    const logActivity = useCallback(async (activity: keyof ActivityBreakdown, minutes: number) => {
        await screenTimeService.logTime(minutes, activity);
    }, []);

    return (
        <ScreenTimeContext.Provider value={{ setActivity, logActivity }}>
            {children}
        </ScreenTimeContext.Provider>
    );
};

export const useScreenTime = () => {
    const context = useContext(ScreenTimeContext);
    if (!context) {
        throw new Error('useScreenTime must be used within a ScreenTimeProvider');
    }
    return context;
};

export default ScreenTimeContext;
