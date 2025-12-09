import React from 'react';
import { View, StyleSheet, Image, Pressable } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { spacing, borderRadius, gradients } from '../theme';
import { useAppTheme } from '../context/ThemeContext';
import { useResponsive } from '../hooks/useResponsive';

// Avatar options with local images
import { AVATAR_OPTIONS } from '../data/avatars';

interface UserGreetingCardProps {
    userName: string;
    streak: number;
    avatarUrl?: string;
    avatarId?: number;
    variant?: 'default' | 'light';
}

const UserGreetingCard: React.FC<UserGreetingCardProps> = ({ userName, streak, avatarUrl, avatarId, variant = 'default' }) => {
    const theme = useTheme();
    const { isDark } = useAppTheme();
    const { responsiveValue, isMobile } = useResponsive();

    const avatarSize = responsiveValue(60, 70, 80);
    const titleSize = responsiveValue(24, 28, 32);
    const isLight = variant === 'light';

    const navigation = useNavigation();

    // Get the selected avatar or default to first one
    const selectedAvatar = AVATAR_OPTIONS.find(a => a.id === avatarId) || AVATAR_OPTIONS[0];

    return (
        <Animated.View entering={FadeInDown.duration(400)} style={styles.container}>
            <Pressable onPress={() => navigation.navigate('Profile' as never)}>
                <View style={styles.content}>
                    {/* Avatar with gradient border */}
                    <View style={styles.avatarSection}>
                        <LinearGradient
                            colors={selectedAvatar.gradient}
                            style={[styles.avatarGradientBorder, { width: avatarSize + 8, height: avatarSize + 8, borderRadius: (avatarSize + 8) / 2 }]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            <View style={[styles.avatarContainer, { width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 }]}>
                                {avatarId ? (
                                    <Image
                                        source={selectedAvatar.source}
                                        style={styles.avatar}
                                        resizeMode="cover"
                                    />
                                ) : avatarUrl ? (
                                    <Image source={{ uri: avatarUrl }} style={styles.avatar} />
                                ) : (
                                    <View style={[styles.avatarPlaceholder, { backgroundColor: theme.colors.primary }]}>
                                        <Text variant="headlineMedium" style={styles.avatarText}>
                                            {userName.charAt(0).toUpperCase()}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </LinearGradient>
                    </View>

                    {/* Greeting text */}
                    <View style={styles.greetingSection}>
                        <Text variant="labelMedium" style={[styles.greetingLabel, { color: isLight ? 'rgba(255,255,255,0.8)' : theme.colors.onSurfaceVariant }]}>
                            Welcome back!
                        </Text>
                        <Text
                            variant="headlineMedium"
                            style={[styles.userName, { fontSize: titleSize, color: isLight ? '#FFFFFF' : theme.colors.onSurface }]}
                        >
                            {userName} 👋
                        </Text>
                    </View>

                    {/* Streak counter */}
                    <View style={styles.streakSection}>
                        {isLight ? (
                            <View style={[styles.streakBadge, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                                <MaterialCommunityIcons name="fire" size={20} color="#FFD059" />
                                <Text variant="labelLarge" style={[styles.streakText, { color: '#FFFFFF' }]}>
                                    {streak}
                                </Text>
                            </View>
                        ) : (
                            <LinearGradient
                                colors={['#FFF7ED', '#FFEDD5']}
                                style={styles.streakBadge}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <MaterialCommunityIcons name="fire" size={20} color="#F59E0B" />
                                <Text variant="labelLarge" style={styles.streakText}>
                                    {streak}
                                </Text>
                            </LinearGradient>
                        )}
                        {!isMobile && (
                            <Text variant="labelSmall" style={[styles.streakLabel, { color: isLight ? 'rgba(255,255,255,0.6)' : theme.colors.onSurfaceVariant }]}>
                                day streak
                            </Text>
                        )}
                    </View>
                </View>
            </Pressable>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        // marginBottom removed to allow parent to control spacing
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    avatarSection: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarGradientBorder: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 4,
    },
    avatarContainer: {
        backgroundColor: '#fff',
        overflow: 'hidden',
    },
    avatar: {
        width: '100%',
        height: '100%',
    },
    avatarPlaceholder: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        color: '#fff',
        fontWeight: '700',
    },
    greetingSection: {
        flex: 1,
        gap: spacing.xs,
    },
    greetingLabel: {
        fontWeight: '500',
    },
    userName: {
        fontWeight: '700',
    },
    streakSection: {
        alignItems: 'center',
        gap: spacing.xs,
    },
    streakBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.xl,
    },
    streakText: {
        fontWeight: '700',
        color: '#F59E0B',
    },
    streakLabel: {
        fontSize: 10,
    },
});

export default UserGreetingCard;
