import React, { useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Text } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
    FadeInDown,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';
import { spacing, borderRadius } from '../theme';
import { useResponsive } from '../hooks/useResponsive';
import { BlurView } from 'expo-blur';

interface XPProgressCardProps {
    level: number;
    currentXP: number;
    xpForNextLevel: number;
    totalXP: number;
    variant?: 'default' | 'light';
}

const XPProgressCard: React.FC<XPProgressCardProps> = ({ level, currentXP, xpForNextLevel, totalXP, variant = 'default' }) => {
    const { responsiveValue } = useResponsive();
    const isLight = variant === 'light';

    const progress = currentXP / xpForNextLevel;
    const progressWidth = useSharedValue(0);

    useEffect(() => {
        progressWidth.value = withSpring(progress, {
            damping: 15,
            stiffness: 100,
        });
    }, [progress]);

    const pulseAnim = useSharedValue(1);

    useEffect(() => {
        pulseAnim.value = withRepeat(
            withSequence(
                withTiming(1.05, { duration: 1000 }),
                withTiming(1, { duration: 1000 })
            ),
            -1,
            true
        );
    }, []);

    const animatedBadgeStyle = useAnimatedStyle(() => ({
        transform: [{ scale: pulseAnim.value }],
    }));

    return (
        <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.container}>
            {isLight ? (
                Platform.OS === 'ios' ? (
                    <BlurView intensity={20} tint="light" style={styles.glassCard}>
                        <View style={styles.contentRow}>
                            <Animated.View style={[styles.levelBadgeContainer, animatedBadgeStyle]}>
                                <LinearGradient
                                    colors={['rgba(255,215,0,0.3)', 'rgba(255,215,0,0.1)']}
                                    style={styles.levelBadge}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                >
                                    <Text style={styles.levelLabel}>LEVEL</Text>
                                    <Text style={styles.levelNumber}>{level}</Text>
                                </LinearGradient>
                            </Animated.View>

                            <View style={styles.progressInfo}>
                                <View style={styles.xpRow}>
                                    <Text style={styles.xpLabel}>Total XP</Text>
                                    <Text style={styles.xpValue}>{totalXP}</Text>
                                </View>

                                <View style={styles.progressBarContainer}>
                                    <View style={styles.progressBarBg} />
                                    <Animated.View style={[styles.progressBarFill, { width: `${progress * 100}%` }]}>
                                        <LinearGradient
                                            colors={['#00C48C', '#5CE0B8']}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                            style={StyleSheet.absoluteFill}
                                        />
                                    </Animated.View>
                                </View>

                                <Text style={styles.nextLevelText}>
                                    {xpForNextLevel - currentXP} XP to Level {level + 1}
                                </Text>
                            </View>
                        </View>
                    </BlurView>
                ) : (
                    <View style={[styles.glassCard, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
                        <View style={styles.contentRow}>
                            <Animated.View style={[styles.levelBadgeContainer, animatedBadgeStyle]}>
                                <LinearGradient
                                    colors={['rgba(255,215,0,0.3)', 'rgba(255,215,0,0.1)']}
                                    style={styles.levelBadge}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                >
                                    <Text style={styles.levelLabel}>LEVEL</Text>
                                    <Text style={styles.levelNumber}>{level}</Text>
                                </LinearGradient>
                            </Animated.View>

                            <View style={styles.progressInfo}>
                                <View style={styles.xpRow}>
                                    <Text style={styles.xpLabel}>Total XP</Text>
                                    <Text style={styles.xpValue}>{totalXP}</Text>
                                </View>

                                <View style={styles.progressBarContainer}>
                                    <View style={styles.progressBarBg} />
                                    <Animated.View style={[styles.progressBarFill, { width: `${progress * 100}%` }]}>
                                        <LinearGradient
                                            colors={['#00C48C', '#5CE0B8']}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                            style={StyleSheet.absoluteFill}
                                        />
                                    </Animated.View>
                                </View>

                                <Text style={styles.nextLevelText}>
                                    {xpForNextLevel - currentXP} XP to Level {level + 1}
                                </Text>
                            </View>
                        </View>
                    </View>
                )
            ) : (
                <View style={styles.defaultCard}>
                    <Text>Level {level}</Text>
                </View>
            )}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        // marginBottom removed to allow parent to control spacing
    },
    glassCard: {
        borderRadius: borderRadius.xl,
        overflow: 'hidden',
        padding: spacing.md,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    defaultCard: {
        padding: spacing.lg,
        backgroundColor: '#fff',
        borderRadius: borderRadius.xl,
    },
    contentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.lg,
    },
    levelBadgeContainer: {
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
        borderRadius: 35,
    },
    levelBadge: {
        width: 70,
        height: 70,
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.5)',
    },
    levelLabel: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 1,
    },
    levelNumber: {
        color: '#fff',
        fontSize: 28,
        fontWeight: '900',
        textShadowColor: 'rgba(0,0,0,0.2)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    progressInfo: {
        flex: 1,
        gap: spacing.xs,
    },
    xpRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: 4,
    },
    xpLabel: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
        fontWeight: '600',
    },
    xpValue: {
        color: '#FFD700',
        fontSize: 18,
        fontWeight: '800',
        textShadowColor: 'rgba(0,0,0,0.2)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    progressBarContainer: {
        height: 8,
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 4,
    },
    progressBarBg: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 4,
        overflow: 'hidden',
    },
    nextLevelText: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 11,
        fontWeight: '600',
    },
});

export default XPProgressCard;
