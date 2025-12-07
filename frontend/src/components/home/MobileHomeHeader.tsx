import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { spacing, colors, borderRadius } from '../../theme';
import { AVATAR_OPTIONS } from '../UserGreetingCard';

interface MobileHomeHeaderProps {
    user: any;
    streak: number;
    xp: number;
    level: number;
    onProfilePress: () => void;
    onSearchPress: () => void;
}

const MobileHomeHeader = ({
    user,
    streak,
    xp,
    level,
    onProfilePress,
    onSearchPress
}: MobileHomeHeaderProps) => {
    const insets = useSafeAreaInsets();
    const xpInLevel = xp % 100;
    const xpForNextLevel = 100;
    const progress = xpInLevel / xpForNextLevel;

    return (
        <View style={styles.container}>
            {/* Top Row: Avatar/Name & Actions */}
            <View style={styles.topRow}>
                <View style={styles.userInfo}>
                    <TouchableOpacity onPress={onProfilePress} activeOpacity={0.8}>
                        <View style={styles.avatarContainer}>
                            <Image
                                source={(AVATAR_OPTIONS.find(a => a.id === parseInt(user?.avatar || '1')) || AVATAR_OPTIONS[0]).source}
                                style={styles.avatar}
                                resizeMode="cover"
                            />
                        </View>
                    </TouchableOpacity>
                    <View style={styles.greetingContainer}>
                        <Text style={styles.welcomeText}>Welcome back,</Text>
                        <Text style={styles.nameText} numberOfLines={1}>
                            {user?.name || 'Student'}
                        </Text>
                    </View>
                </View>

                <View style={styles.actions}>
                    <View style={styles.streakBadge}>
                        <MaterialCommunityIcons name="fire" size={18} color="#FFD700" />
                        <Text style={styles.streakText}>{streak}</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.searchButton}
                        onPress={onSearchPress}
                        activeOpacity={0.7}
                    >
                        <MaterialCommunityIcons name="magnify" size={22} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* XP Progress Section */}
            <View style={styles.xpSection}>
                <View style={styles.xpHeader}>
                    <View style={styles.levelBadge}>
                        <Text style={styles.levelText}>LVL {level}</Text>
                    </View>
                    <Text style={styles.xpStats}>{xpInLevel} / {xpForNextLevel} XP</Text>
                </View>

                <View style={styles.progressBarContainer}>
                    <LinearGradient
                        colors={['#00C48C', '#64FFDA']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={[styles.progressBarFill, { width: `${progress * 100}%` }]}
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.sm, // Compact spacing
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spacing.md,
        height: 50,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        flex: 1,
    },
    avatarContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.8)',
        overflow: 'hidden',
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    avatar: {
        width: '100%',
        height: '100%',
    },
    greetingContainer: {
        justifyContent: 'center',
        flex: 1,
    },
    welcomeText: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 11,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    nameText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 0.3,
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    streakBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.2)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 4,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    streakText: {
        color: '#FFD700',
        fontWeight: 'bold',
        fontSize: 14,
    },
    searchButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    xpSection: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 16,
        padding: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
    },
    xpHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    levelBadge: {
        backgroundColor: '#FFD700',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
    },
    levelText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 10,
    },
    xpStats: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    progressBarContainer: {
        height: 8,
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 4,
    },
});

export default MobileHomeHeader;
