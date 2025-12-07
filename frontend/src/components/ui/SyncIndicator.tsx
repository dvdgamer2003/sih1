import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Surface, ActivityIndicator, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useSync } from '../../context/SyncContext';
import { spacing, borderRadius } from '../../theme';

const SyncIndicator = () => {
    const { isSyncing, isOffline, pendingItems, syncNow } = useSync();
    const theme = useTheme();

    if (!isOffline && pendingItems === 0 && !isSyncing) return null;

    return (
        <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.container}>
            <TouchableOpacity onPress={syncNow} disabled={isSyncing || isOffline}>
                <Surface style={[styles.card, { backgroundColor: isOffline ? theme.colors.errorContainer : theme.colors.surfaceVariant }]} elevation={2}>
                    {isSyncing ? (
                        <ActivityIndicator size={16} color={theme.colors.primary} style={styles.icon} />
                    ) : (
                        <MaterialCommunityIcons
                            name={isOffline ? "wifi-off" : "cloud-upload"}
                            size={16}
                            color={isOffline ? theme.colors.error : theme.colors.primary}
                            style={styles.icon}
                        />
                    )}

                    <Text variant="labelSmall" style={{ color: isOffline ? theme.colors.error : theme.colors.onSurfaceVariant }}>
                        {isSyncing ? 'Syncing...' : isOffline ? (pendingItems > 0 ? `Offline (${pendingItems})` : 'Offline') : `${pendingItems} pending`}
                    </Text>
                </Surface>
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: spacing.lg,
        right: spacing.lg,
        zIndex: 100,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.sm,
        paddingVertical: 4,
        borderRadius: borderRadius.full,
    },
    icon: {
        marginRight: 4,
    },
});

export default SyncIndicator;
