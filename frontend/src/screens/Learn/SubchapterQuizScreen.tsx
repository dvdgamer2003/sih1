import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, ProgressBar, useTheme, ActivityIndicator, Surface, IconButton } from 'react-native-paper';
import { learnService } from '../../services/learnService';
import QuizOptionButton from '../../components/QuizOptionButton';
import GradientBackground from '../../components/ui/GradientBackground';
import { spacing, gradients } from '../../theme';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { useAuth } from '../../context/AuthContext';
import { useAppTheme } from '../../context/ThemeContext';
import XPToast from '../../components/learn/XPToast';

const SubchapterQuizScreen = ({ route, navigation }: any) => {
    const { subchapterId } = route.params;
    const theme = useTheme();
    const { isDark } = useAppTheme();
    const { addXP } = useAuth();
    const [questions, setQuestions] = useState<any[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
    const [userAnswers, setUserAnswers] = useState<number[]>([]);
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isAnswered, setIsAnswered] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [earnedXP, setEarnedXP] = useState(0);

    const styles = createStyles(isDark);

    useEffect(() => {
        loadQuiz();
    }, []);

    const loadQuiz = async () => {
        setLoading(true);
        try {
            const quizData = await learnService.getQuiz(subchapterId);
            setQuestions(quizData);
        } catch (error) {
            console.error('Failed to load quiz:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOptionSelect = (index: number) => {
        if (isAnswered) return;

        setSelectedOptionIndex(index);
        setIsAnswered(true);

        const newAnswers = [...userAnswers];
        newAnswers[currentQuestionIndex] = index;
        setUserAnswers(newAnswers);

        const currentQuestion = questions[currentQuestionIndex];
        if (index === currentQuestion.correctIndex) {
            setScore(score + 1);
        }
    };

    const handleNext = () => {
        if (!questions) return;

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedOptionIndex(null);
            setIsAnswered(false);
        } else {
            finishQuiz();
        }
    };

    const finishQuiz = () => {
        const finalScore = score;
        const xpEarned = finalScore * 4;
        addXP(xpEarned);
        setEarnedXP(xpEarned);
        setShowToast(true);

        // Collect user answers (assuming we track them)
        // For now, we'll just pass the questions and score
        // In a real app, we should track user answers in state

        setTimeout(() => {
            navigation.replace('QuizResult', {
                score: finalScore,
                totalQuestions: questions.length,
                correctAnswers: finalScore,
                quizId: subchapterId,
                questions: questions,
                userAnswers: userAnswers
            });
        }, 1000);
    };

    if (loading) {
        return (
            <GradientBackground colors={gradients.softPurple}>
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                    <Text variant="titleMedium" style={{ marginTop: spacing.lg, color: theme.colors.primary }}>
                        Generating quiz questions...
                    </Text>
                    <Text variant="bodySmall" style={{ marginTop: spacing.sm, color: '#666', textAlign: 'center' }}>
                        Using AI to create contextual questions
                    </Text>
                </View>
            </GradientBackground>
        );
    }

    if (!questions || questions.length === 0) {
        return (
            <GradientBackground colors={gradients.softPurple}>
                <View style={styles.centerContainer}>
                    <Text variant="titleMedium">No questions available.</Text>
                    <Button mode="contained" onPress={() => navigation.goBack()} style={{ marginTop: spacing.lg }}>
                        Go Back
                    </Button>
                </View>
            </GradientBackground>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];
    const progress = (currentQuestionIndex + 1) / questions.length;

    return (
        <GradientBackground colors={gradients.softPurple}>
            <View style={styles.container}>
                <XPToast
                    visible={showToast}
                    xp={earnedXP}
                    onHide={() => setShowToast(false)}
                />

                <View style={styles.header}>
                    <IconButton
                        icon="arrow-left"
                        iconColor={theme.colors.primary}
                        size={24}
                        onPress={() => navigation.goBack()}
                        style={styles.backButton}
                    />
                    <View style={styles.progressHeader}>
                        <Text variant="titleMedium" style={{ color: theme.colors.primary }}>
                            Question {currentQuestionIndex + 1}
                        </Text>
                        <Text variant="titleMedium" style={{ color: theme.colors.primary, opacity: 0.7 }}>
                            / {questions.length}
                        </Text>
                    </View>
                    <View style={{ width: 48 }} />
                </View>
                <View style={styles.progressBarContainer}>
                    <ProgressBar progress={progress} color={theme.colors.primary} style={styles.progressBar} />
                </View>

                <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                    <Animated.View
                        key={currentQuestionIndex}
                        entering={FadeInRight.duration(400)}
                    >
                        <Surface style={styles.questionCard} elevation={2}>
                            <Text variant="headlineSmall" style={styles.questionText}>
                                {currentQuestion.question}
                            </Text>
                        </Surface>

                        <View style={styles.optionsContainer}>
                            {currentQuestion.options.map((option: string, index: number) => {
                                let status: 'correct' | 'wrong' | 'none' = 'none';
                                if (isAnswered) {
                                    if (index === currentQuestion.correctIndex) {
                                        status = 'correct';
                                    } else if (index === selectedOptionIndex) {
                                        status = 'wrong';
                                    }
                                }

                                return (
                                    <QuizOptionButton
                                        key={index}
                                        text={option}
                                        isSelected={selectedOptionIndex === index}
                                        onPress={() => handleOptionSelect(index)}
                                        index={index}
                                        status={status}
                                        disabled={isAnswered}
                                    />
                                );
                            })}
                        </View>

                        {isAnswered && currentQuestion.explanation && (
                            <Animated.View entering={FadeInDown.springify()}>
                                <Surface style={styles.explanationCard} elevation={1}>
                                    <Text variant="titleSmall" style={{ fontWeight: 'bold', marginBottom: spacing.sm }}>
                                        Explanation
                                    </Text>
                                    <Text variant="bodyMedium" style={{ color: '#666' }}>
                                        {currentQuestion.explanation}
                                    </Text>
                                </Surface>
                            </Animated.View>
                        )}
                    </Animated.View>
                </ScrollView>

                <View style={styles.footer}>
                    {isAnswered && (
                        <Animated.View entering={FadeInDown.springify()}>
                            <Button
                                mode="contained"
                                onPress={handleNext}
                                style={styles.nextButton}
                                contentStyle={{ height: 56 }}
                                labelStyle={{ fontSize: 18, fontWeight: 'bold' }}
                                buttonColor={theme.colors.primary}
                            >
                                {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Continue'}
                            </Button>
                        </Animated.View>
                    )}
                </View>
            </View>
        </GradientBackground>
    );
};

const createStyles = (isDark: boolean) => StyleSheet.create({
    container: {
        flex: 1,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.xl,
        paddingBottom: spacing.md,
    },
    backButton: {
        margin: 0,
    },
    progressHeader: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 4,
    },
    progressBarContainer: {
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.lg,
    },
    progressBar: {
        height: 8,
        borderRadius: 4,
    },
    content: {
        padding: spacing.lg,
        paddingBottom: 100,
    },
    questionCard: {
        padding: spacing.xl,
        borderRadius: 24,
        backgroundColor: isDark ? '#1E293B' : '#fff',
        marginBottom: spacing.xl,
    },
    questionText: {
        fontWeight: 'bold',
        color: isDark ? '#F1F5F9' : '#333',
        textAlign: 'center',
    },
    optionsContainer: {
        gap: spacing.sm,
        marginBottom: spacing.lg,
    },
    explanationCard: {
        padding: spacing.lg,
        borderRadius: 16,
        backgroundColor: isDark ? '#1E293B' : '#E8F5E9',
        marginTop: spacing.md,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: spacing.lg,
        backgroundColor: isDark ? 'rgba(15,23,42,0.95)' : 'rgba(255,255,255,0.95)',
    },
    nextButton: {
        borderRadius: 30,
    },
});

export default SubchapterQuizScreen;
