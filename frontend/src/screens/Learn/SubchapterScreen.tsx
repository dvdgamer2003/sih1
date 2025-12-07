import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Platform, Modal as RNModal } from 'react-native';
import { Text, Surface, useTheme, ProgressBar, Button, Banner, Portal, Modal, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { learnService } from '../../services/learnService';
import GradientBackground from '../../components/ui/GradientBackground';
import CustomButton from '../../components/ui/CustomButton';
import { spacing, gradients, borderRadius } from '../../theme';
import Animated, { FadeInDown, FadeInRight, FadeInUp } from 'react-native-reanimated';
import { useAuth } from '../../context/AuthContext';
import XPToast from '../../components/learn/XPToast';
import { getSimulationsByTopic } from '../../data/phetMappings'; // StreakWise Interactive Simulations
import { getGamesForTopic, generateTopicKey } from '../../data/gameMappings';
import api from '../../services/api';
import SkeletonLoader from '../../components/ui/SkeletonLoader';

const SubchapterScreen = ({ route, navigation }: any) => {
    const { subchapterId } = route.params;
    const theme = useTheme();
    const { addXP } = useAuth();
    const [subchapter, setSubchapter] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [completedActions, setCompletedActions] = useState<string[]>([]);
    const [showToast, setShowToast] = useState(false);
    const [earnedXP, setEarnedXP] = useState(0);
    const [generatingQuiz, setGeneratingQuiz] = useState(false);
    const [generatingContent, setGeneratingContent] = useState(false);
    const [showAIModal, setShowAIModal] = useState(false);

    useEffect(() => {
        loadSubchapter();
    }, []);

    const loadSubchapter = async () => {
        try {
            const data = await learnService.getSubchapter(subchapterId);
            setSubchapter(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = (actionType: string, xpReward: number, navigateTo?: string) => {
        if (!completedActions.includes(actionType)) {
            addXP(xpReward);
            setCompletedActions([...completedActions, actionType]);
            setEarnedXP(xpReward);
            setShowToast(true);
        }

        if (navigateTo) {
            if (navigateTo === 'Quiz') {
                navigation.navigate('SubchapterQuiz', { subchapterId });
            } else if (navigateTo === 'Visualization') {
                const topicKey = subchapter?.name?.toLowerCase().replace(/\s+/g, '_') || '';
                const sims = getSimulationsByTopic(topicKey);
                navigation.navigate('SimulationList', { subchapterSims: sims });
            } else if (navigateTo === 'Games') {
                navigation.navigate('Games');
            } else if (navigateTo === 'Read') {
                navigation.navigate('LessonReader', {
                    title: subchapter?.name || 'Lesson',
                    content: subchapter?.lessonContent || '# No content available',
                    xpReward: 10
                });
            } else if (navigateTo === 'ThreeDModel') {
                navigation.navigate('ModelList');
            } else if (navigateTo === 'AI') {
                setShowAIModal(true);
            } else if (navigateTo && navigateTo.startsWith('Game:')) {
                const gameScreen = navigateTo.replace('Game:', '');
                navigation.navigate(gameScreen);
            }
        }
    };

    const handleGenerateQuiz = async () => {
        try {
            setGeneratingQuiz(true);
            const response = await api.post(`/learn/subchapters/${subchapterId}/quiz/regenerate`);

            if (response.data.success) {
                setShowAIModal(false);
                Alert.alert(
                    'Success',
                    'Quiz generated successfully! You can now take the quiz.',
                    [{ text: 'Take Quiz', onPress: () => handleAction('quiz', 20, 'Quiz') }]
                );
            }
        } catch (error: any) {
            Alert.alert(
                'Error',
                error.response?.data?.message || 'Failed to generate quiz. Please check your internet connection.'
            );
        } finally {
            setGeneratingQuiz(false);
        }
    };

    const handleGenerateContent = async () => {
        try {
            setGeneratingContent(true);
            const response = await api.post(`/learn/subchapters/${subchapterId}/generate-content`);

            if (response.data.success) {
                // Reload subchapter to get new content
                await loadSubchapter();
                setShowAIModal(false);
                Alert.alert(
                    'Success',
                    'Reading material generated successfully!',
                    [{ text: 'Read Now', onPress: () => handleAction('read', 10, 'Read') }]
                );
            }
        } catch (error: any) {
            Alert.alert(
                'Error',
                error.response?.data?.message || 'Failed to generate content. Please check your internet connection.'
            );
        } finally {
            setGeneratingContent(false);
        }
    };

    const ActionCard = ({ title, icon, xp, type, color, gradientColors, delay, navigateTo }: any) => {
        const isCompleted = completedActions.includes(type);

        return (
            <Animated.View entering={FadeInRight.delay(delay).duration(500)} style={styles.actionCardWrapper}>
                <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => handleAction(type, xp, navigateTo)}
                    style={styles.cardTouchable}
                >
                    <LinearGradient
                        colors={gradientColors || [color, color]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.actionCard}
                    >
                        <BlurView intensity={Platform.OS === 'web' ? 20 : 30} tint="light" style={styles.cardBlur}>
                            <View style={styles.cardInner}>
                                <View style={styles.cardTop}>
                                    <LinearGradient
                                        colors={['rgba(255,255,255,0.4)', 'rgba(255,255,255,0.2)']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        style={styles.iconBox}
                                    >
                                        <MaterialCommunityIcons name={icon} size={44} color="#fff" />
                                    </LinearGradient>
                                    {isCompleted && (
                                        <View style={styles.completedBadge}>
                                            <MaterialCommunityIcons name="check-circle" size={24} color="#4CAF50" />
                                        </View>
                                    )}
                                </View>
                                <View style={styles.cardBottom}>
                                    <Text variant="titleMedium" style={styles.actionTitle}>{title}</Text>
                                    <View style={styles.xpBadge}>
                                        <MaterialCommunityIcons name="star" size={16} color="#FFD700" />
                                        <Text variant="bodySmall" style={styles.xpLabel}>+{xp} XP</Text>
                                    </View>
                                </View>
                            </View>
                        </BlurView>
                    </LinearGradient>
                </TouchableOpacity>
            </Animated.View>
        );
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <View style={styles.headerBackground}>
                    <View style={styles.headerContent}>
                        <View style={styles.headerRow}>
                            <SkeletonLoader width={40} height={40} borderRadius={12} />
                            <SkeletonLoader width={200} height={32} />
                            <View style={{ width: 40 }} />
                        </View>
                    </View>
                </View>
                <View style={styles.contentContainer}>
                    <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.lg }}>
                        <SkeletonLoader height={100} style={{ marginBottom: spacing.lg, borderRadius: borderRadius.xl }} />
                        <SkeletonLoader width={150} height={24} style={{ marginBottom: spacing.md }} />
                        <SkeletonLoader height={80} style={{ marginBottom: spacing.md, borderRadius: borderRadius.xl }} />
                        <SkeletonLoader height={80} style={{ marginBottom: spacing.md, borderRadius: borderRadius.xl }} />
                        <SkeletonLoader height={80} style={{ marginBottom: spacing.md, borderRadius: borderRadius.xl }} />
                    </View>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <XPToast
                visible={showToast}
                xp={earnedXP}
                onHide={() => setShowToast(false)}
            />

            <Portal>
                <Modal visible={showAIModal} onDismiss={() => setShowAIModal(false)} contentContainerStyle={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <View style={styles.modalTitleRow}>
                                <MaterialCommunityIcons name="robot-excited" size={28} color="#6A5AE0" />
                                <Text variant="headlineSmall" style={styles.modalTitle}>AI Assistant</Text>
                            </View>
                            <IconButton icon="close" onPress={() => setShowAIModal(false)} />
                        </View>

                        <Text style={styles.modalDescription}>
                            Use AI to generate personalized content for this topic.
                        </Text>

                        <View style={styles.modalButtons}>
                            <CustomButton
                                variant="primary"
                                icon="brain"
                                onPress={handleGenerateQuiz}
                                loading={generatingQuiz}
                                disabled={generatingQuiz || generatingContent}
                                fullWidth
                                style={{ marginBottom: 12 }}
                            >
                                Generate New Quiz
                            </CustomButton>

                            <CustomButton
                                variant="secondary"
                                icon="book-open-variant"
                                onPress={handleGenerateContent}
                                loading={generatingContent}
                                disabled={generatingQuiz || generatingContent}
                                fullWidth
                            >
                                Generate Reading Material
                            </CustomButton>
                        </View>
                    </View>
                </Modal>
            </Portal>

            <View style={styles.headerBackground}>
                <View style={styles.headerContent}>
                    <View style={styles.headerRow}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                            <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
                        </TouchableOpacity>
                        <Text variant="titleLarge" style={styles.headerTitle} numberOfLines={1}>
                            {subchapter?.name}
                        </Text>
                        <View style={{ width: 40 }} />
                    </View>
                </View>
            </View>

            <View style={styles.contentContainer}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    <Animated.View entering={FadeInUp.duration(600)} style={styles.progressSection}>
                        <LinearGradient
                            colors={['#6A5AE0', '#8B7AFF']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.progressGradient}
                        >
                            <View style={styles.progressContent}>
                                <View style={styles.progressLeft}>
                                    <View style={styles.circularProgress}>
                                        <View style={styles.progressRingOuter}>
                                            <View style={styles.progressRingInner}>
                                                <Text variant="headlineMedium" style={styles.progressNumber}>
                                                    {Math.round((completedActions.length / 5) * 100)}%
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.progressRight}>
                                    <Text variant="titleMedium" style={styles.progressTitle}>Topic Progress</Text>
                                    <Text variant="bodySmall" style={styles.progressSubtitle}>
                                        {completedActions.length} of 5 activities completed
                                    </Text>
                                    <ProgressBar
                                        progress={completedActions.length / 5}
                                        color="#fff"
                                        style={styles.modernProgressBar}
                                    />
                                </View>
                            </View>
                        </LinearGradient>
                    </Animated.View>

                    <Text variant="titleMedium" style={styles.sectionTitle}>Activities</Text>

                    <View style={styles.cardsContainer}>
                        <ActionCard
                            title="Read Lesson"
                            icon="book-open-variant"
                            xp={10}
                            type="read"
                            color="#4CAF50"
                            gradientColors={['#4CAF50', '#66BB6A']}
                            delay={100}
                            navigateTo="Read"
                        />
                        <ActionCard
                            title="Solve Quiz"
                            icon="brain"
                            xp={20}
                            type="quiz"
                            color="#FF9800"
                            gradientColors={['#FF9800', '#FFB74D']}
                            delay={200}
                            navigateTo="Quiz"
                        />
                        <ActionCard
                            title="AI Assistant"
                            icon="robot"
                            xp={15}
                            type="ai"
                            color="#2196F3"
                            gradientColors={['#2196F3', '#42A5F5']}
                            delay={300}
                            navigateTo="AI"
                        />
                        <ActionCard
                            title="Play Games"
                            icon="gamepad-variant"
                            xp={10}
                            type="game"
                            color="#9C27B0"
                            gradientColors={['#9C27B0', '#BA68C8']}
                            delay={400}
                            navigateTo="Games"
                        />
                        <ActionCard
                            title="3D Models"
                            icon="cube-outline"
                            xp={15}
                            type="3d_model"
                            color="#00BCD4"
                            gradientColors={['#00BCD4', '#26C6DA']}
                            delay={500}
                            navigateTo="ThreeDModel"
                        />
                    </View>

                    {/* Structured Lesson Content */}
                    <Surface style={styles.lessonContainer} elevation={1}>
                        <View style={styles.lessonHeader}>
                            <MaterialCommunityIcons name="book-open-page-variant" size={24} color={theme.colors.primary} />
                            <Text variant="titleMedium" style={styles.lessonTitle}>
                                {subchapter?.name || 'Lesson Content'}
                            </Text>
                        </View>

                        <View style={styles.lessonContent}>
                            {subchapter?.lessonContent && subchapter.lessonContent !== '# No content available' ? (
                                <Text variant="bodyMedium" style={styles.lessonText}>
                                    {subchapter.lessonContent}
                                </Text>
                            ) : (
                                <View>
                                    <Text variant="bodyMedium" style={styles.lessonText}>
                                        Welcome to the lesson on {subchapter?.name}. In this section, we will explore the fundamental concepts and applications of this topic.
                                    </Text>

                                    <View style={styles.placeholderSection}>
                                        <Text variant="titleSmall" style={styles.placeholderTitle}>Key Concepts</Text>
                                        <View style={styles.bulletPoint}>
                                            <MaterialCommunityIcons name="circle-small" size={24} color={theme.colors.secondary} />
                                            <Text variant="bodyMedium" style={styles.bulletText}>Understanding the core definitions and terminology.</Text>
                                        </View>
                                        <View style={styles.bulletPoint}>
                                            <MaterialCommunityIcons name="circle-small" size={24} color={theme.colors.secondary} />
                                            <Text variant="bodyMedium" style={styles.bulletText}>Exploring real-world examples and applications.</Text>
                                        </View>
                                        <View style={styles.bulletPoint}>
                                            <MaterialCommunityIcons name="circle-small" size={24} color={theme.colors.secondary} />
                                            <Text variant="bodyMedium" style={styles.bulletText}>Solving practice problems to reinforce learning.</Text>
                                        </View>
                                    </View>

                                    <View style={styles.interactivePrompt}>
                                        <MaterialCommunityIcons name="lightbulb-on-outline" size={24} color={theme.colors.tertiary} />
                                        <Text variant="bodySmall" style={styles.promptText}>
                                            Tap "AI Assistant" above to get a full, AI-customized lesson for this topic!
                                        </Text>
                                    </View>
                                </View>
                            )}
                        </View>

                        <Button
                            mode="contained"
                            onPress={() => navigation.navigate('LessonReader', {
                                title: subchapter?.name || 'Lesson',
                                content: subchapter?.lessonContent || `
# ${subchapter?.name}

## Introduction
Welcome to the comprehensive lesson on ${subchapter?.name}. This topic is fundamental to understanding the broader subject.

## Key Concepts
1. **Definition**: The core idea behind ${subchapter?.name} is...
2. **Application**: We use this in real life when...
3. **Analysis**: Breaking it down further...

## Summary
In this lesson, we covered the basics of ${subchapter?.name}. Remember to practice the exercises!
                                `,
                                xpReward: 10
                            })}
                            style={styles.readButton}
                            icon="book-open-variant"
                        >
                            Open Full Lesson
                        </Button>
                    </Surface>

                </ScrollView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F7',
    },
    headerBackground: {
        backgroundColor: '#6A5AE0',
        paddingTop: spacing.xl + 12,
        paddingBottom: spacing.xxl + 12,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        shadowColor: '#6A5AE0',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 15,
        elevation: 10,
    },
    headerContent: {
        paddingHorizontal: spacing.lg + 4,
        paddingTop: spacing.md + 2,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    contentContainer: {
        flex: 1,
        marginTop: -spacing.lg,
    },
    backButton: {
        padding: 10,
        backgroundColor: 'rgba(255,255,255,0.25)',
        borderRadius: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
        fontWeight: '800',
        fontSize: 22,
        color: '#fff',
        marginHorizontal: spacing.md + 2,
        letterSpacing: 0.3,
    },
    sectionTitle: {
        fontWeight: '800',
        marginBottom: spacing.md + 4,
        marginTop: spacing.sm + 2,
        color: '#1A1A1A',
        paddingHorizontal: spacing.lg + 4,
        fontSize: 21,
        letterSpacing: 0.2,
    },
    scrollContent: {
        paddingBottom: spacing.xxl + 30,
        paddingTop: spacing.lg + 4,
    },
    progressSection: {
        marginHorizontal: spacing.lg + 4,
        borderRadius: 24,
        marginBottom: spacing.lg + 6,
        shadowColor: '#6A5AE0',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
        overflow: 'hidden',
    },
    progressGradient: {
        borderRadius: 24,
        padding: spacing.lg + 4,
    },
    progressContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.lg + 2,
    },
    progressLeft: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    circularProgress: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    progressRingOuter: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderWidth: 7,
        borderColor: 'rgba(255,255,255,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#fff',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 5,
    },
    progressRingInner: {
        width: 76,
        height: 76,
        borderRadius: 38,
        backgroundColor: 'rgba(255,255,255,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    progressNumber: {
        color: '#fff',
        fontWeight: '900',
        fontSize: 26,
        letterSpacing: 0.5,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 6,
    },
    progressRight: {
        flex: 1,
        gap: spacing.xs + 2,
    },
    progressTitle: {
        color: '#fff',
        fontWeight: '800',
        fontSize: 19,
        letterSpacing: 0.3,
    },
    progressSubtitle: {
        color: 'rgba(255,255,255,0.95)',
        fontSize: 14,
        fontWeight: '500',
    },
    modernProgressBar: {
        height: 10,
        borderRadius: 5,
        backgroundColor: 'rgba(255,255,255,0.25)',
        marginTop: spacing.xs + 2,
    },
    cardsContainer: {
        paddingHorizontal: spacing.lg + 4,
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.md + 4,
        marginBottom: spacing.lg + 4,
        justifyContent: 'space-between',
    },
    actionCardWrapper: {
        width: '48%',
        minWidth: 160,
        marginBottom: spacing.sm + 2,
    },
    cardTouchable: {
        borderRadius: 22,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 14 },
        shadowOpacity: 0.28,
        shadowRadius: 24,
        elevation: 12,
    },
    actionCard: {
        borderRadius: 22,
        overflow: 'hidden',
        minHeight: 190,
    },
    cardBlur: {
        flex: 1,
        borderRadius: borderRadius.xl,
        overflow: 'hidden',
    },
    cardInner: {
        flex: 1,
        padding: spacing.lg + 4,
        justifyContent: 'space-between',
    },
    cardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: spacing.md + 2,
    },
    iconBox: {
        width: 76,
        height: 76,
        borderRadius: 26,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 10,
        elevation: 8,
    },
    completedBadge: {
        backgroundColor: '#fff',
        borderRadius: 22,
        padding: 5,
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 3,
    },
    cardBottom: {
        gap: spacing.sm + 2,
    },
    actionTitle: {
        fontWeight: '900',
        fontSize: 19,
        color: '#fff',
        letterSpacing: 0.4,
        lineHeight: 26,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 6,
    },
    xpBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 215, 0, 0.35)',
        paddingHorizontal: spacing.md + 2,
        paddingVertical: 7,
        borderRadius: 14,
        alignSelf: 'flex-start',
        gap: 7,
        borderWidth: 1.5,
        borderColor: 'rgba(255, 255, 255, 0.5)',
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.4,
        shadowRadius: 6,
        elevation: 3,
    },
    xpLabel: {
        color: '#fff',
        fontWeight: '800',
        fontSize: 15,
        letterSpacing: 0.2,
        textShadowColor: 'rgba(0, 0, 0, 0.4)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    lessonContainer: {
        marginHorizontal: spacing.lg,
        borderRadius: borderRadius.xl,
        backgroundColor: '#fff',
        overflow: 'hidden',
        marginBottom: spacing.xl,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    lessonHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        backgroundColor: '#FAFAFA',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        gap: spacing.sm,
    },
    lessonTitle: {
        fontWeight: '700',
        color: '#333',
    },
    lessonContent: {
        padding: spacing.md,
    },
    lessonText: {
        lineHeight: 24,
        color: '#444',
        marginBottom: spacing.md,
    },
    placeholderSection: {
        marginTop: spacing.sm,
        marginBottom: spacing.md,
        padding: spacing.md,
        backgroundColor: '#F8FAFC',
        borderRadius: borderRadius.md,
    },
    placeholderTitle: {
        fontWeight: '700',
        marginBottom: spacing.sm,
        color: '#333',
    },
    bulletPoint: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    bulletText: {
        color: '#555',
        flex: 1,
    },
    interactivePrompt: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        backgroundColor: '#FFFBEB', // Amber 50
        borderRadius: borderRadius.md,
        gap: spacing.sm,
        borderWidth: 1,
        borderColor: '#FEF3C7',
    },
    promptText: {
        color: '#B45309', // Amber 700
        flex: 1,
        fontStyle: 'italic',
    },
    readButton: {
        margin: spacing.md,
        marginTop: 0,
    },
    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        margin: 20,
        borderRadius: 20,
    },
    modalContent: {
        width: '100%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    modalTitle: {
        fontWeight: 'bold',
        color: '#333',
    },
    modalDescription: {
        fontSize: 16,
        color: '#666',
        marginBottom: 24,
        lineHeight: 22,
    },
    modalButtons: {
        gap: 12,
    },
});

export default SubchapterScreen;
