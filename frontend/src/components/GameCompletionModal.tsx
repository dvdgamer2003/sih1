import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Modal, Dimensions, TouchableOpacity, Platform } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
    FadeIn,
    FadeInDown,
    FadeInUp,
    ZoomIn,
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withDelay,
    withSequence,
    withRepeat
} from 'react-native-reanimated';
import ConfettiAnimation from './ConfettiAnimation';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { useAppTheme } from '../context/ThemeContext';

const { width, height } = Dimensions.get('window');

interface GameCompletionModalProps {
    visible: boolean;
    onClose: () => void;
    gameTitle: string;
    score: number;
    maxScore?: number;
    timeTaken?: number; // in seconds
    xpEarned?: number;
    accuracy?: number;
    isNewHighScore?: boolean;
    onPlayAgain?: () => void;
    onGoHome?: () => void;
}

const GameCompletionModal: React.FC<GameCompletionModalProps> = ({
    visible,
    onClose,
    gameTitle,
    score,
    maxScore,
    timeTaken,
    xpEarned = 10,
    accuracy,
    isNewHighScore = false,
    onPlayAgain,
    onGoHome
}) => {
    const navigation = useNavigation();
    const { addXP } = useAuth();
    const { isDark } = useAppTheme();
    const [showConfetti, setShowConfetti] = useState(false);

    // Star animation
    const starScale = useSharedValue(0);

    useEffect(() => {
        if (visible) {
            setShowConfetti(true);
            starScale.value = withDelay(300, withSpring(1, { damping: 8 }));

            // Add XP when modal shows
            if (xpEarned > 0) {
                addXP(xpEarned);
            }
        } else {
            starScale.value = 0;
        }
    }, [visible]);

    const starAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: starScale.value }]
    }));

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
    };

    const getPerformanceMessage = () => {
        const percentage = maxScore ? (score / maxScore) * 100 : score;
        if (percentage >= 90) return { emoji: '🌟', message: 'Outstanding!', color: '#FFD700' };
        if (percentage >= 70) return { emoji: '🎉', message: 'Great Job!', color: '#4CAF50' };
        if (percentage >= 50) return { emoji: '👍', message: 'Good Effort!', color: '#2196F3' };
        return { emoji: '💪', message: 'Keep Trying!', color: '#FF9800' };
    };

    const performance = getPerformanceMessage();

    const handlePlayAgain = () => {
        onClose();
        if (onPlayAgain) {
            onPlayAgain();
        }
    };

    const handleGoHome = () => {
        onClose();
        if (onGoHome) {
            onGoHome();
        } else {
            navigation.goBack();
        }
    };

    const isMobile = width < 768;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                {showConfetti && (
                    <ConfettiAnimation
                        isVisible={true}
                        onComplete={() => setShowConfetti(false)}
                    />
                )}

                <Animated.View
                    entering={ZoomIn.duration(400).springify()}
                    style={[styles.modalContainer, { maxWidth: isMobile ? width * 0.9 : 400 }]}
                >
                    <Surface style={[styles.card, isDark && styles.cardDark]} elevation={5}>
                        {/* Top Gradient Header */}
                        <LinearGradient
                            colors={['#667eea', '#764ba2']}
                            style={styles.header}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            <Animated.View style={[styles.starContainer, starAnimatedStyle]}>
                                <Text style={styles.performanceEmoji}>{performance.emoji}</Text>
                            </Animated.View>

                            <Animated.Text
                                entering={FadeInDown.delay(200).duration(400)}
                                style={styles.performanceMessage}
                            >
                                {performance.message}
                            </Animated.Text>

                            <Animated.Text
                                entering={FadeInDown.delay(300).duration(400)}
                                style={styles.gameTitle}
                            >
                                {gameTitle}
                            </Animated.Text>

                            {isNewHighScore && (
                                <Animated.View
                                    entering={FadeIn.delay(500).duration(400)}
                                    style={styles.highScoreBadge}
                                >
                                    <MaterialCommunityIcons name="trophy" size={14} color="#FFD700" />
                                    <Text style={styles.highScoreText}>New High Score!</Text>
                                </Animated.View>
                            )}
                        </LinearGradient>

                        {/* Stats Section */}
                        <View style={styles.statsSection}>
                            <Animated.View
                                entering={FadeInUp.delay(400).duration(400)}
                                style={styles.statsGrid}
                            >
                                {/* Score */}
                                <View style={styles.statItem}>
                                    <View style={[styles.statIcon, { backgroundColor: '#E8F5E9' }]}>
                                        <MaterialCommunityIcons name="star" size={24} color="#4CAF50" />
                                    </View>
                                    <Text style={[styles.statValue, isDark && styles.textLight]}>
                                        {score}{maxScore ? `/${maxScore}` : ''}
                                    </Text>
                                    <Text style={styles.statLabel}>Score</Text>
                                </View>

                                {/* Time */}
                                {timeTaken !== undefined && (
                                    <View style={styles.statItem}>
                                        <View style={[styles.statIcon, { backgroundColor: '#E3F2FD' }]}>
                                            <MaterialCommunityIcons name="clock-outline" size={24} color="#2196F3" />
                                        </View>
                                        <Text style={[styles.statValue, isDark && styles.textLight]}>
                                            {formatTime(timeTaken)}
                                        </Text>
                                        <Text style={styles.statLabel}>Time</Text>
                                    </View>
                                )}

                                {/* Accuracy */}
                                {accuracy !== undefined && (
                                    <View style={styles.statItem}>
                                        <View style={[styles.statIcon, { backgroundColor: '#FFF3E0' }]}>
                                            <MaterialCommunityIcons name="target" size={24} color="#FF9800" />
                                        </View>
                                        <Text style={[styles.statValue, isDark && styles.textLight]}>
                                            {accuracy}%
                                        </Text>
                                        <Text style={styles.statLabel}>Accuracy</Text>
                                    </View>
                                )}
                            </Animated.View>

                            {/* XP Earned */}
                            <Animated.View
                                entering={FadeInUp.delay(500).duration(400)}
                                style={styles.xpContainer}
                            >
                                <LinearGradient
                                    colors={['#FFD700', '#FFA000']}
                                    style={styles.xpBadge}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                >
                                    <MaterialCommunityIcons name="lightning-bolt" size={20} color="#fff" />
                                    <Text style={styles.xpText}>+{xpEarned} XP Earned!</Text>
                                </LinearGradient>
                            </Animated.View>
                        </View>

                        {/* Action Buttons */}
                        <Animated.View
                            entering={FadeInUp.delay(600).duration(400)}
                            style={styles.buttonsContainer}
                        >
                            <TouchableOpacity
                                style={styles.secondaryButton}
                                onPress={handleGoHome}
                                activeOpacity={0.8}
                            >
                                <MaterialCommunityIcons name="home" size={20} color="#667eea" />
                                <Text style={styles.secondaryButtonText}>Home</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.primaryButton}
                                onPress={handlePlayAgain}
                                activeOpacity={0.8}
                            >
                                <LinearGradient
                                    colors={['#667eea', '#764ba2']}
                                    style={styles.primaryButtonGradient}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                >
                                    <MaterialCommunityIcons name="refresh" size={20} color="#fff" />
                                    <Text style={styles.primaryButtonText}>Play Again</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </Animated.View>
                    </Surface>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '90%',
    },
    card: {
        borderRadius: 24,
        backgroundColor: '#fff',
        overflow: 'hidden',
    },
    cardDark: {
        backgroundColor: '#1E293B',
    },
    header: {
        paddingVertical: 32,
        paddingHorizontal: 24,
        alignItems: 'center',
    },
    starContainer: {
        marginBottom: 12,
    },
    performanceEmoji: {
        fontSize: 64,
    },
    performanceMessage: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    gameTitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.9)',
        fontWeight: '600',
    },
    highScoreBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,215,0,0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginTop: 12,
        gap: 6,
    },
    highScoreText: {
        color: '#FFD700',
        fontWeight: 'bold',
        fontSize: 12,
    },
    statsSection: {
        padding: 24,
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    textLight: {
        color: '#F1F5F9',
    },
    statLabel: {
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 2,
    },
    xpContainer: {
        alignItems: 'center',
    },
    xpBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        gap: 8,
    },
    xpText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    buttonsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 24,
        paddingBottom: 24,
        gap: 12,
    },
    secondaryButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#667eea',
        gap: 8,
    },
    secondaryButtonText: {
        color: '#667eea',
        fontWeight: 'bold',
        fontSize: 16,
    },
    primaryButton: {
        flex: 1,
        borderRadius: 16,
        overflow: 'hidden',
    },
    primaryButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        gap: 8,
    },
    primaryButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default GameCompletionModal;
