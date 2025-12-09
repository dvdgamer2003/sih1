import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import { Text, Button, Surface, useTheme, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { useAppTheme } from '../../context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { spacing } from '../../theme';
import Animated, { FadeInDown, FadeIn, BounceIn, ZoomIn } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useGameTimer } from '../../hooks/useGameTimer';
import { saveGameResult } from '../../services/gamesService';
import { calculateDelta } from '../../utils/deltaAssessment';
import GameCompletionModal from '../../components/GameCompletionModal';

const { width } = Dimensions.get('window');

interface CellPart {
    id: string;
    name: string;
    function: string;
    x: number;
    y: number;
}

const CELL_PARTS: CellPart[] = [
    { id: '1', name: 'Nucleus', function: 'Controls cell activities', x: 50, y: 50 },
    { id: '2', name: 'Mitochondria', function: 'Produces energy', x: 30, y: 60 },
    { id: '3', name: 'Cell Membrane', function: 'Protects the cell', x: 10, y: 10 },
    { id: '4', name: 'Cytoplasm', function: 'Fills the cell', x: 50, y: 70 },
    { id: '5', name: 'Ribosome', function: 'Makes proteins', x: 70, y: 40 },
];

const ALL_QUESTIONS = [
    { question: 'Which part controls cell activities?', correctId: '1', options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Cytoplasm'] },
    { question: 'What produces energy for the cell?', correctId: '2', options: ['Mitochondria', 'Nucleus', 'Membrane', 'Cytoplasm'] },
    { question: 'What protects the cell?', correctId: '3', options: ['Cell Membrane', 'Nucleus', 'Mitochondria', 'Ribosome'] },
    { question: 'What fills the cell?', correctId: '4', options: ['Cytoplasm', 'Nucleus', 'Mitochondria', 'Membrane'] },
    { question: 'Where does protein synthesis occur?', correctId: '5', options: ['Ribosome', 'Nucleus', 'Mitochondria', 'Membrane'] },
    { question: 'What organelle contains DNA?', correctId: '1', options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Cytoplasm'] },
    { question: 'What is the powerhouse of the cell?', correctId: '2', options: ['Mitochondria', 'Nucleus', 'Ribosome', 'Cytoplasm'] },
    { question: 'What controls what enters and exits the cell?', correctId: '3', options: ['Cell Membrane', 'Nucleus', 'Mitochondria', 'Cytoplasm'] },
    { question: 'What is the jelly-like substance in cells?', correctId: '4', options: ['Cytoplasm', 'Nucleus', 'Mitochondria', 'Membrane'] },
    { question: 'What reads mRNA to make proteins?', correctId: '5', options: ['Ribosome', 'Nucleus', 'Mitochondria', 'Cytoplasm'] },
    { question: 'Where is chromatin found?', correctId: '1', options: ['Nucleus', 'Cytoplasm', 'Mitochondria', 'Membrane'] },
    { question: 'What organelle has cristae?', correctId: '2', options: ['Mitochondria', 'Nucleus', 'Ribosome', 'Cytoplasm'] },
    { question: 'What is selectively permeable?', correctId: '3', options: ['Cell Membrane', 'Nucleus', 'Mitochondria', 'Cytoplasm'] },
    { question: 'What is 70% water?', correctId: '4', options: ['Cytoplasm', 'Nucleus', 'Mitochondria', 'Membrane'] },
    { question: 'What is made of rRNA and proteins?', correctId: '5', options: ['Ribosome', 'Nucleus', 'Mitochondria', 'Cytoplasm'] },
];

import { soundManager } from '../../utils/soundEffects';

// ... (imports)

const CellStructureQuiz = () => {
    const navigation = useNavigation();
    const { addXP } = useAuth();
    const theme = useTheme();
    const { isDark } = useAppTheme();
    const [score, setScore] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [gameOver, setGameOver] = useState(false);
    const [showCompletionModal, setShowCompletionModal] = useState(false);
    const [finalScore, setFinalScore] = useState(0);
    const [questions, setQuestions] = useState<typeof ALL_QUESTIONS>([]);
    const { elapsedTime, startTimer, stopTimer, displayTime, resetTimer: resetGameTimer } = useGameTimer();

    const styles = createStyles(isDark);

    // Initialize sounds
    useEffect(() => {
        soundManager.initialize();
        return () => {
            soundManager.cleanup();
        };
    }, []);

    // Initialize with random questions
    useEffect(() => {
        const shuffled = [...ALL_QUESTIONS].sort(() => Math.random() - 0.5);
        setQuestions(shuffled.slice(0, 10)); // Pick 10 random questions
        startTimer();
        return () => stopTimer();
    }, []);

    const handleAnswer = async (partId: string) => {
        setSelectedAnswer(partId);
        const correct = questions[currentQuestion].correctId === partId;

        if (correct) {
            await soundManager.playCorrect();
            setScore(score + 20);
        } else {
            await soundManager.playWrong();
        }

        setTimeout(async () => {
            if (currentQuestion < questions.length - 1) {
                setCurrentQuestion(currentQuestion + 1);
                setSelectedAnswer(null);
            } else {
                const computedFinalScore = correct ? score + 20 : score;
                setFinalScore(computedFinalScore);
                await soundManager.playSuccess();
                stopTimer();
                setGameOver(true);
                setShowCompletionModal(true);

                const deltaResult = calculateDelta(elapsedTime, 'medium');

                saveGameResult({
                    gameId: 'cell_structure_quiz',
                    score: computedFinalScore,
                    maxScore: 200,
                    timeTaken: elapsedTime,
                    difficulty: 'medium',
                    completedLevel: 1,
                    delta: deltaResult.delta,
                    proficiency: deltaResult.proficiency,
                    subject: 'Biology',
                    classLevel: 'Class 6'
                });
            }
        }, 1000);
    };

    const resetGame = () => {
        soundManager.playClick();
        setScore(0);
        setCurrentQuestion(0);
        setSelectedAnswer(null);
        setGameOver(false);
        setShowCompletionModal(false);
        const shuffled = [...ALL_QUESTIONS].sort(() => Math.random() - 0.5);
        setQuestions(shuffled.slice(0, 10));
        resetGameTimer();
        startTimer();
    };

    // Calculate XP based on score
    const xpEarned = Math.floor(finalScore / 5);
    const accuracy = Math.round((finalScore / 200) * 100);

    if (questions.length === 0) {
        return null; // Loading state
    }

    const currentQ = questions[currentQuestion];

    return (
        <>
            <GameCompletionModal
                visible={showCompletionModal}
                onClose={() => setShowCompletionModal(false)}
                gameTitle="Cell Structure Quiz"
                score={finalScore}
                maxScore={200}
                timeTaken={elapsedTime}
                xpEarned={xpEarned}
                accuracy={accuracy}
                onPlayAgain={resetGame}
                onGoHome={() => navigation.goBack()}
            />
            <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.container}
            >
                <View style={styles.innerContainer}>
                    <View style={styles.header}>
                        <IconButton
                            icon="arrow-left"
                            iconColor="#fff"
                            size={24}
                            onPress={() => navigation.goBack()}
                        />
                        <Text variant="titleLarge" style={styles.headerTitle}>Cell Structure Quiz</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <MaterialCommunityIcons name="clock-outline" size={20} color="#fff" style={{ marginRight: 4 }} />
                            <Text style={{ color: '#fff', fontWeight: 'bold' }}>{displayTime}</Text>
                        </View>
                    </View>

                    <LinearGradient
                        colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.85)']}
                        style={styles.scoreCard}
                    >
                        <View style={styles.scoreItem}>
                            <MaterialCommunityIcons name="star" size={20} color="#FFD700" />
                            <Text variant="titleMedium" style={styles.scoreLabel}>Score: {score}</Text>
                        </View>
                        <View style={styles.scoreItem}>
                            <Text variant="bodyMedium" style={styles.questionLabel}>Question {currentQuestion + 1}/{questions.length}</Text>
                        </View>

                    </LinearGradient>

                    <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.gameArea}>
                        <Surface style={styles.questionCard} elevation={4}>
                            <Text variant="titleLarge" style={styles.questionText}>
                                {currentQ.question}
                            </Text>
                        </Surface>

                        <View style={styles.cellDiagram}>
                            <Image
                                source={require('../../../assets/images/organs/cell_structure.png')}
                                style={styles.cellImage}
                                resizeMode="contain"
                            />
                            <Text variant="bodySmall" style={styles.instructionText}>
                                Select the correct answer below
                            </Text>
                        </View>

                        <View style={styles.optionsContainer}>
                            {currentQ.options.map((option, index) => {
                                const partId = CELL_PARTS.find(p => p.name === option)?.id || '';
                                const isSelected = selectedAnswer === partId;
                                const isCorrect = partId === currentQ.correctId;

                                return (
                                    <Animated.View
                                        key={index}
                                        entering={FadeIn.delay(index * 100)}
                                        style={styles.optionWrapper}
                                    >
                                        {isSelected ? (
                                            <LinearGradient
                                                colors={isCorrect ? ['#4CAF50', '#2E7D32'] : ['#f44336', '#c62828']}
                                                style={styles.selectedOption}
                                            >
                                                <MaterialCommunityIcons
                                                    name={isCorrect ? "check-circle" : "close-circle"}
                                                    size={20}
                                                    color="#fff"
                                                />
                                                <Text style={styles.selectedOptionText}>{option}</Text>
                                            </LinearGradient>
                                        ) : (
                                            <Button
                                                mode="outlined"
                                                onPress={() => handleAnswer(partId)}
                                                style={styles.optionButton}
                                                contentStyle={styles.optionContent}
                                                disabled={selectedAnswer !== null}
                                                textColor="#fff"
                                                labelStyle={styles.optionLabel}
                                            >
                                                {option}
                                            </Button>
                                        )}
                                    </Animated.View>
                                );
                            })}
                        </View>
                    </Animated.View>
                </View>
            </LinearGradient>
        </>
    );
};

const createStyles = (isDark: boolean) => StyleSheet.create({
    container: {
        flex: 1,
    },
    innerContainer: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: spacing.xl,
        paddingHorizontal: spacing.md,
        marginBottom: spacing.md,
    },
    headerTitle: {
        color: '#fff',
        fontWeight: 'bold',
    },
    scoreCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: spacing.md,
        marginHorizontal: spacing.md,
        marginBottom: spacing.md,
        borderRadius: 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    scoreItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
    },
    scoreLabel: {
        fontWeight: 'bold',
        color: '#333',
    },
    questionLabel: {
        color: '#666',
    },
    gameArea: {
        flex: 1,
        padding: spacing.md,
    },
    questionCard: {
        padding: spacing.lg,
        marginBottom: spacing.lg,
        borderRadius: 20,
        backgroundColor: isDark ? '#1E293B' : 'rgba(255, 255, 255, 0.95)',
        elevation: 3,
    },
    questionText: {
        textAlign: 'center',
        fontWeight: 'bold',
        color: isDark ? '#F1F5F9' : '#333',
    },
    cellDiagram: {
        height: 300,
        backgroundColor: isDark ? 'rgba(30,41,59,0.9)' : 'rgba(255, 255, 255, 0.9)',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.lg,
        padding: spacing.md,
        elevation: 2,
    },
    cellImage: {
        width: '100%',
        height: 250,
        marginBottom: spacing.sm,
    },
    instructionText: {
        color: isDark ? '#CBD5E1' : '#666',
        fontStyle: 'italic',
    },
    optionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: spacing.sm,
    },
    optionWrapper: {
        width: '48%',
    },
    optionButton: {
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#fff',
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    optionContent: {
        paddingVertical: spacing.sm,
    },
    optionLabel: {
        fontSize: 14,
        fontWeight: '600',
    },
    selectedOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.md,
        borderRadius: 12,
        gap: spacing.xs,
    },
    selectedOptionText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    resultContainer: {
        flex: 1,
        justifyContent: 'center',
        padding: spacing.xl,
    },
    resultCard: {
        padding: spacing.xl,
        borderRadius: 24,
        alignItems: 'center',
        backgroundColor: isDark ? '#1E293B' : 'rgba(255, 255, 255, 0.98)',
    },
    resultTitle: {
        fontWeight: 'bold',
        marginTop: spacing.md,
        marginBottom: spacing.lg,
        color: isDark ? '#F1F5F9' : '#333',
    },
    scoreGradient: {
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.md,
        borderRadius: 16,
        marginBottom: spacing.md,
    },
    scoreText: {
        fontWeight: 'bold',
        color: '#fff',
    },
    resultMessage: {
        marginBottom: spacing.xl,
        color: isDark ? '#CBD5E1' : '#666',
        fontSize: 18,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: spacing.md,
        width: '100%',
        justifyContent: 'center',
    },
    gradientButton: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    buttonLabel: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    outlineButton: {
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#667eea',
    },
});

export default CellStructureQuiz;
