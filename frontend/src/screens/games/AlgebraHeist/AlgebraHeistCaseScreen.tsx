import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, TextInput, Alert, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { Text, Surface, Button, IconButton, Modal, Portal, Provider } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAppTheme } from '../../../context/ThemeContext';
import { CASES, Case, Clue } from '../../../data/algebraHeistData';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { spacing } from '../../../theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';
import { useGameTimer } from '../../../hooks/useGameTimer';
import { saveGameResult } from '../../../services/gamesService';
import { calculateDelta, assessLearningOutcome, updateLeaderboardPoints } from '../../../utils/deltaAssessment';
import GameResultModal from '../../GameResultModal';
import { useAuth } from '../../../context/AuthContext';

const AlgebraHeistCaseScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { isDark } = useAppTheme();
    const { user, addXP } = useAuth();
    const insets = useSafeAreaInsets();

    const { caseId } = route.params as { caseId: string };
    const styles = createStyles(isDark);

    const [currentCase, setCurrentCase] = useState<Case | null>(null);
    const [clues, setClues] = useState<Clue[]>([]);
    const [selectedClue, setSelectedClue] = useState<Clue | null>(null);
    const [userAnswer, setUserAnswer] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [feedback, setFeedback] = useState<'none' | 'correct' | 'wrong'>('none');
    const { elapsedTime, startTimer, stopTimer, displayTime, resetTimer: resetGameTimer } = useGameTimer();

    // Delta System State
    const [resultModalVisible, setResultModalVisible] = useState(false);
    const [deltaResult, setDeltaResult] = useState<any>(null);
    const [learningOutcome, setLearningOutcome] = useState<any>(null);
    const [finalScore, setFinalScore] = useState(0);

    // Scratchpad auto-save simulation
    const [scratchpadText, setScratchpadText] = useState('');
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        loadCase();
    }, [caseId]);

    const loadCase = () => {
        const foundCase = CASES.find(c => c.id === caseId);
        if (foundCase) {
            setCurrentCase(foundCase);
            // Deep copy clues to track local solved state without mutating global DATA immediately
            setClues(foundCase.clues.map(c => ({ ...c, solved: false })));
            startTimer();
        }
    };

    const handleCluePress = (clue: Clue) => {
        // Check dependencies
        if (clue.dependsOn) {
            const dependency = clues.find(c => c.id === clue.dependsOn);
            if (dependency && !dependency.solved) {
                Alert.alert("Locked Clue", "You need to solve a connecting clue first!");
                return;
            }
        }

        setSelectedClue(clue);
        setUserAnswer('');
        setFeedback('none');
        setModalVisible(true);
    };

    const handleSubmitAnswer = () => {
        if (!selectedClue) return;

        const numAns = parseFloat(userAnswer);
        if (Math.abs(numAns - selectedClue.answer) < 0.01) {
            setFeedback('correct');
            setTimeout(() => {
                setModalVisible(false);
                markClueSolved(selectedClue.id);
            }, 1000);
        } else {
            setFeedback('wrong');
        }
    };

    const markClueSolved = (id: string) => {
        const updatedClues = clues.map(c => c.id === id ? { ...c, solved: true } : c);
        setClues(updatedClues);

        // Check completion
        if (updatedClues.every(c => c.solved)) {
            handleCaseCompletion();
        }
    };

    const handleCaseCompletion = async () => {
        stopTimer();

        // --- DELTA CALCULATION ---
        // Difficulty can be derived from case ID or user settings. Default 'medium'.
        const difficulty = 'medium';
        const dResult = calculateDelta(elapsedTime, difficulty);

        // Calculate Score
        const baseScore = 300; // Base per case
        const totalScore = baseScore + dResult.delta;

        // Attempts tracking is tricky here as it's per clue. 
        // We'll assume perfect outcome if they reached here, 
        // but maybe we should track mistakes globally in component state later.
        // For now, passing 0 mistakes/hints for simplicity or tracking state if I had it.
        const outcome = assessLearningOutcome(dResult.delta, 100, 1, 0, difficulty);

        setDeltaResult(dResult);
        setLearningOutcome(outcome);
        setFinalScore(totalScore);

        addXP(totalScore, 'Algebra Heist');

        // Identify Subject/Class
        const subject = 'Math';
        const classLevel = user?.selectedClass || '6';

        // Update Leaderboard
        await updateLeaderboardPoints(dResult.delta, difficulty, user?._id || 'guest');

        // Save using service
        await saveGameResult({
            gameId: 'algebra_heist',
            score: totalScore,
            maxScore: 400,
            timeTaken: elapsedTime,
            difficulty: difficulty,
            completedLevel: 1,
            subject: subject,
            classLevel: classLevel,
            delta: dResult.delta,
            proficiency: dResult.proficiency,
            userId: user?._id
        });

        // Save Progress (Local stars)
        try {
            const savedData = await AsyncStorage.getItem('algebraHeist_progress');
            let progress = savedData ? JSON.parse(savedData) : { totalStars: 0, completedCases: [] };

            // Avoid duplicate rewards
            if (!progress.completedCases.includes(caseId)) {
                progress.completedCases.push(caseId);
                progress.totalStars += 1; // Simple 1 star per case
                await AsyncStorage.setItem('algebraHeist_progress', JSON.stringify(progress));
            }
        } catch (error) {
            console.error("Save failed", error);
        }

        setResultModalVisible(true);
    };



    const handleScratchpadChange = (text: string) => {
        setScratchpadText(text);
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = setTimeout(() => {
            // In a real app, save to AsyncStorage here 'scratchpad_caseId'
            console.log("Auto-saving scratchpad...");
        }, 5000);
    };

    if (!currentCase) return <View style={styles.center}><Text>Loading Case...</Text></View>;

    return (
        <Provider>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
                <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
                    <IconButton icon="arrow-left" iconColor="#fff" onPress={() => navigation.goBack()} />
                    <View style={{ flex: 1 }}>
                        <Text variant="titleMedium" style={styles.headerTitle}>{currentCase.title}</Text>
                        <Text variant="bodySmall" style={styles.headerSubtitle} numberOfLines={1}>{currentCase.description}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <MaterialCommunityIcons name="clock-outline" size={16} color="#B0BEC5" style={{ marginRight: 4 }} />
                        <Text style={{ color: '#B0BEC5', fontWeight: 'bold', marginRight: 8 }}>{displayTime}</Text>
                    </View>
                    <IconButton icon="notebook" iconColor="#fff" onPress={() => Alert.alert("Detective Journal", "Notes feature coming soon!")} />
                </View>

                <ScrollView contentContainerStyle={styles.boardContent}>
                    <Text variant="titleSmall" style={styles.sectionLabel}>EVIDENCE BOARD</Text>

                    <View style={styles.clueGrid}>
                        {clues.map((clue, index) => {
                            const isLocked = clue.dependsOn && !clues.find(c => c.id === clue.dependsOn)?.solved;
                            return (
                                <TouchableOpacity
                                    key={clue.id}
                                    onPress={() => !isLocked && !clue.solved && handleCluePress(clue)}
                                    disabled={clue.solved || !!isLocked}
                                    style={[styles.clueCardWrapper]}
                                >
                                    <Animated.View entering={FadeIn.delay(index * 100)}>
                                        <Surface style={[
                                            styles.clueCard,
                                            clue.solved && styles.clueSolved,
                                            !!isLocked && styles.clueLocked
                                        ]} elevation={2}>
                                            <View style={styles.clueHeader}>
                                                <MaterialCommunityIcons
                                                    name={clue.solved ? "check-circle" : isLocked ? "lock" : "magnify"}
                                                    size={20}
                                                    color={clue.solved ? "#4CAF50" : isLocked ? "#999" : "#FF9800"}
                                                />
                                                <Text style={[styles.clueVar, clue.solved && { color: '#4CAF50' }]}>
                                                    Find {clue.variable}
                                                </Text>
                                            </View>
                                            <Text style={styles.clueText} numberOfLines={3}>{clue.text}</Text>

                                            {clue.solved && (
                                                <View style={styles.stamp}>
                                                    <Text style={styles.stampText}>SOLVED</Text>
                                                </View>
                                            )}
                                        </Surface>
                                    </Animated.View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    <Text variant="titleSmall" style={styles.sectionLabel}>SCRATCHPAD</Text>
                    <Surface style={styles.scratchpad} elevation={1}>
                        <TextInput
                            style={styles.scratchInput}
                            multiline
                            placeholder="Write your calculations here..."
                            placeholderTextColor="#666"
                            value={scratchpadText}
                            onChangeText={handleScratchpadChange}
                        />
                    </Surface>
                </ScrollView>

                {/* Solution Modal */}
                <Portal>
                    <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.modalContainer}>
                        {selectedClue && (
                            <Surface style={styles.modalContent}>
                                <Text variant="headlineSmall" style={styles.modalTitle}>Solve for {selectedClue.variable}</Text>
                                <Surface style={styles.equationBox} elevation={0}>
                                    <Text variant="headlineMedium" style={styles.equationText}>{selectedClue.equation}</Text>
                                </Surface>

                                {selectedClue.dependsOn && (
                                    <Text style={styles.dependencyHint}>
                                        (Hint: Use the value from the previous clue!)
                                    </Text>
                                )}

                                <TextInput
                                    style={[
                                        styles.answerInput,
                                        feedback === 'correct' && { borderColor: '#4CAF50', color: '#4CAF50' },
                                        feedback === 'wrong' && { borderColor: '#F44336', color: '#F44336' }
                                    ]}
                                    placeholder="Enter value"
                                    keyboardType="numeric"
                                    value={userAnswer}
                                    onChangeText={setUserAnswer}
                                    autoFocus
                                />

                                {feedback === 'wrong' && <Text style={styles.errorText}>Incorrect. Try again!</Text>}
                                {feedback === 'correct' && <Text style={styles.successText}>Correct! Evidence secure.</Text>}

                                <Button mode="contained" onPress={handleSubmitAnswer} style={styles.submitBtn} labelStyle={{ fontSize: 18, paddingVertical: 4 }}>
                                    Verify
                                </Button>
                            </Surface>
                        )}
                    </Modal>
                </Portal>
                {/* Delta Game Result Modal */}
                <GameResultModal
                    visible={resultModalVisible}
                    gameId="algebra_heist"
                    score={finalScore}
                    maxScore={400}
                    timeTaken={elapsedTime}
                    difficulty="medium"
                    deltaResult={deltaResult}
                    learningOutcome={learningOutcome}
                    onClose={() => setResultModalVisible(false)}
                    onGoHome={() => navigation.goBack()}
                    onPlayAgain={() => {
                        setResultModalVisible(false);
                        navigation.goBack(); // Re-enter from map to reset simplified state
                    }}
                />
            </KeyboardAvoidingView>
        </Provider>
    );
};

const createStyles = (isDark: boolean) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5' // Paper-like background for detective feel
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#37474F',
        paddingHorizontal: 8,
        paddingBottom: 16
    },
    headerTitle: {
        color: '#fff',
        fontWeight: 'bold'
    },
    headerSubtitle: {
        color: '#B0BEC5'
    },
    boardContent: {
        padding: 16,
        paddingBottom: 40
    },
    sectionLabel: {
        color: '#546E7A',
        fontWeight: 'bold',
        marginBottom: 10,
        letterSpacing: 1
    },
    clueGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 24
    },
    clueCardWrapper: {
        width: '48%',
    },
    clueCard: {
        padding: 12,
        borderRadius: 8,
        backgroundColor: '#fff',
        height: 140,
        justifyContent: 'space-between',
        borderLeftWidth: 4,
        borderLeftColor: '#FF9800'
    },
    clueSolved: {
        backgroundColor: '#E8F5E9',
        borderLeftColor: '#4CAF50',
        opacity: 0.8
    },
    clueLocked: {
        backgroundColor: '#ECEFF1',
        borderLeftColor: '#CFD8DC',
    },
    clueHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8
    },
    clueVar: {
        fontWeight: 'bold',
        color: '#444'
    },
    clueText: {
        fontSize: 12,
        color: '#555',
        lineHeight: 18
    },
    stamp: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        borderWidth: 2,
        borderColor: '#4CAF50',
        borderRadius: 4,
        paddingHorizontal: 4,
        transform: [{ rotate: '-15deg' }]
    },
    stampText: {
        color: '#4CAF50',
        fontWeight: 'bold',
        fontSize: 10
    },
    scratchpad: {
        backgroundColor: '#FFF9C4', // Yellow notepad
        height: 150,
        borderRadius: 4,
        padding: 8
    },
    scratchInput: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        textAlignVertical: 'top',
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace'
    },
    // Modal
    modalContainer: {
        padding: 20,
        alignItems: 'center'
    },
    modalContent: {
        padding: 30,
        borderRadius: 12,
        width: '100%',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    modalTitle: {
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#333'
    },
    equationBox: {
        backgroundColor: '#F5F5F5',
        padding: 20,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
        marginBottom: 16
    },
    equationText: {
        fontWeight: 'bold',
        color: '#1a237e'
    },
    dependencyHint: {
        color: '#F57C00',
        fontStyle: 'italic',
        marginBottom: 12,
        fontSize: 12
    },
    answerInput: {
        width: '100%',
        borderWidth: 2,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        padding: 12,
        fontSize: 24,
        textAlign: 'center',
        backgroundColor: '#fff',
        marginBottom: 16
    },
    submitBtn: {
        width: '100%',
        backgroundColor: '#37474F'
    },
    errorText: {
        color: '#F44336',
        marginBottom: 10,
        fontWeight: 'bold'
    },
    successText: {
        color: '#4CAF50',
        marginBottom: 10,
        fontWeight: 'bold'
    }
});

export default AlgebraHeistCaseScreen;
