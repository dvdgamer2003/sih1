import React, { useEffect } from 'react';
import { View, StyleSheet, Modal, ScrollView, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Text, Button, Surface, IconButton, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import DeltaVisualization from '../components/DeltaVisualization';
import { DeltaResult, LearningOutcome, GameDifficulty } from '../utils/deltaAssessment';
import { formatTime } from '../utils/formatTime';

interface GameResultModalProps {
    visible: boolean;
    onClose: () => void;
    onPlayAgain?: () => void;
    onGoHome?: () => void;
    onViewAnalytics?: () => void; // Navigates to CourseProgressScreen

    // Game Data
    gameId: string;
    difficulty: GameDifficulty;

    // Results
    score: number;
    maxScore: number;
    timeTaken: number;

    // Computed Results (Ready to display)
    deltaResult: DeltaResult;
    learningOutcome: LearningOutcome;
    xpEarned?: number;
    streakUpdated?: boolean;
}



const GameResultModal: React.FC<GameResultModalProps> = ({
    visible,
    onClose,
    onPlayAgain,
    onGoHome,
    onViewAnalytics,
    difficulty,
    score,
    maxScore,
    timeTaken,
    deltaResult,
    learningOutcome,
    xpEarned,
}) => {

    // Calculate percentage for circular progress or simple display
    const scorePercentage = Math.round((score / maxScore) * 100);
    const isSuccess = scorePercentage >= 60; // Simple pass/fail for visual theme

    // Theme colors based on Proficiency
    const getProficiencyColor = (level: string) => {
        switch (level) {
            case 'Advanced': return '#4CAF50'; // Green
            case 'Proficient': return '#2196F3'; // Blue
            case 'Developing': return '#FFC107'; // Amber
            default: return '#FF5252'; // Red
        }
    };

    // Safety check: if results aren't ready yet, don't crash
    if (!visible || !deltaResult || !learningOutcome) return null;

    const themeColor = getProficiencyColor(deltaResult.proficiency);

    // Responsive dimensions
    const { width: windowWidth, height: windowHeight } = useWindowDimensions();
    const modalMaxWidth = Math.min(windowWidth - 40, 500);
    const modalMaxHeight = windowHeight * 0.85;

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <BlurView intensity={20} style={StyleSheet.absoluteFill} tint="dark" />

                <Animated.View entering={ZoomIn.duration(400)} style={[styles.modalContent, { maxWidth: modalMaxWidth, maxHeight: modalMaxHeight }]}>
                    <Surface style={[styles.surface, { borderColor: themeColor }]} elevation={5}>
                        {/* Close Button */}
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={onClose}
                            accessibilityLabel="Close modal"
                        >
                            <MaterialCommunityIcons name="close" size={24} color="#666" />
                        </TouchableOpacity>

                        <LinearGradient
                            colors={[themeColor + '20', '#ffffff']}
                            style={styles.gradientContainer}
                        >
                            <ScrollView
                                contentContainerStyle={styles.scrollContent}
                                showsVerticalScrollIndicator={true}
                                bounces={true}
                            >

                                {/* Header badge */}
                                <Animated.View entering={FadeInDown.delay(200)} style={styles.headerIconContainer}>
                                    <View style={[styles.iconCircle, { backgroundColor: themeColor }]}>
                                        <MaterialCommunityIcons
                                            name={learningOutcome.achieved ? "trophy" : "school"}
                                            size={40}
                                            color="#fff"
                                        />
                                    </View>
                                    <Text variant="headlineSmall" style={[styles.proficiencyTitle, { color: themeColor }]}>
                                        {deltaResult.proficiency} Learner
                                    </Text>
                                    <View style={styles.chipsContainer}>
                                        {learningOutcome.achieved && (
                                            <View style={styles.chip}>
                                                <MaterialCommunityIcons name="check-circle" size={14} color="#4CAF50" />
                                                <Text style={styles.chipText}>Outcome Achieved</Text>
                                            </View>
                                        )}
                                        <View style={styles.chip}>
                                            <MaterialCommunityIcons name="clock-outline" size={14} color="#555" />
                                            <Text style={styles.chipText}>{deltaResult.timeCategory}</Text>
                                        </View>
                                    </View>
                                    <Text style={{ textAlign: 'center', color: '#666', marginTop: 4, fontSize: 13 }}>
                                        {formatTime(timeTaken)} ({deltaResult.timeCategory}) → {deltaResult.delta} Delta → {deltaResult.proficiency}
                                    </Text>
                                </Animated.View>

                                {/* Primary Stats Row */}
                                <Animated.View entering={FadeInDown.delay(300)} style={styles.statsRow}>
                                    <View style={styles.statItem}>
                                        <Text variant="titleLarge" style={styles.statValue}>{scorePercentage}%</Text>
                                        <Text variant="labelSmall" style={styles.statLabel}>Accuracy</Text>
                                    </View>
                                    <View style={[styles.verticalDivider, { backgroundColor: themeColor + '40' }]} />
                                    <View style={styles.statItem}>
                                        <Text variant="titleLarge" style={styles.statValue}>{formatTime(timeTaken)}</Text>
                                        <Text variant="labelSmall" style={styles.statLabel}>Time</Text>
                                    </View>
                                    <View style={[styles.verticalDivider, { backgroundColor: themeColor + '40' }]} />
                                    <View style={styles.statItem}>
                                        <Text variant="titleLarge" style={[styles.statValue, { color: themeColor, fontSize: 28 }]}>
                                            {deltaResult.delta}
                                        </Text>
                                        <Text variant="labelSmall" style={[styles.statLabel, { color: themeColor, fontWeight: 'bold' }]}>
                                            Delta Score
                                        </Text>
                                    </View>
                                </Animated.View>

                                {/* Visualization */}
                                <Animated.View entering={FadeInDown.delay(400)} style={styles.chartContainer}>
                                    <DeltaVisualization
                                        timeTaken={timeTaken}
                                        difficulty={difficulty}
                                        earnedDelta={deltaResult.delta}
                                    />
                                </Animated.View>

                                {/* XP and Recommendations */}
                                <Animated.View entering={FadeInDown.delay(500)} style={styles.feedbackSection}>
                                    {xpEarned && (
                                        <Text style={styles.xpText}>+{xpEarned} XP Earned</Text>
                                    )}

                                    <View style={styles.recommendationBox}>
                                        <Text variant="titleSmall" style={styles.recommendationTitle}>
                                            {learningOutcome.achieved ? "Keep it up!" : "Recommendations"}
                                        </Text>
                                        {learningOutcome.recommendations.map((rec, index) => (
                                            <View key={index} style={styles.recItem}>
                                                <MaterialCommunityIcons name="lightbulb-on-outline" size={16} color="#FF9800" />
                                                <Text style={styles.recText}>{rec}</Text>
                                            </View>
                                        ))}
                                    </View>
                                </Animated.View>

                                {/* Action Buttons */}
                                <Animated.View entering={FadeInDown.delay(600)} style={styles.actionButtons}>
                                    <Button
                                        mode="contained"
                                        onPress={onPlayAgain}
                                        style={[styles.mainButton, { backgroundColor: themeColor }]}
                                        icon="replay"
                                    >
                                        Play Again
                                    </Button>

                                    {learningOutcome.achieved && difficulty !== 'hard' && (
                                        <Button
                                            mode="outlined"
                                            onPress={onPlayAgain} // In real app, this would arguably pass a param to increase difficulty
                                            style={[styles.secondaryButton, { borderColor: themeColor }]}
                                            textColor={themeColor}
                                            icon="arrow-up-bold"
                                        >
                                            Next Difficulty
                                        </Button>
                                    )}

                                    <View style={styles.secondaryActions}>
                                        <Button mode="text" onPress={onViewAnalytics} icon="chart-line">
                                            View Progress
                                        </Button>
                                        <Button mode="text" onPress={onGoHome} icon="home">
                                            Home
                                        </Button>
                                    </View>
                                </Animated.View>

                            </ScrollView>
                        </LinearGradient>
                    </Surface>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    modalContent: {
        width: '100%',
        maxWidth: 450,
        maxHeight: '90%',
    },
    surface: {
        borderRadius: 24,
        overflow: 'hidden',
        backgroundColor: '#fff',
        borderWidth: 2,
    },
    gradientContainer: {
        width: '100%',
        height: '100%'
    },
    scrollContent: {
        padding: 24,
        paddingTop: 40, // Extra space for close button
        alignItems: 'center',
        paddingBottom: 40
    },
    closeButton: {
        position: 'absolute',
        top: 12,
        right: 12,
        zIndex: 10,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(0,0,0,0.08)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerIconContainer: {
        alignItems: 'center',
        marginBottom: 20
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4
    },
    proficiencyTitle: {
        fontWeight: 'bold',
        marginBottom: 8
    },
    chipsContainer: {
        flexDirection: 'row',
        gap: 8,
        flexWrap: 'wrap',
        justifyContent: 'center'
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.05)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 6
    },
    chipText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#444'
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
        marginBottom: 24,
        backgroundColor: 'rgba(255,255,255,0.8)',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)'
    },
    statItem: {
        alignItems: 'center'
    },
    statValue: {
        fontWeight: 'bold',
        fontSize: 22,
        color: '#333'
    },
    statLabel: {
        color: '#666',
        textTransform: 'uppercase',
        letterSpacing: 0.5
    },
    verticalDivider: {
        width: 1,
        height: 40,
    },
    chartContainer: {
        width: '100%',
        marginBottom: 20,
        alignItems: 'center'
    },
    feedbackSection: {
        width: '100%',
        marginBottom: 24
    },
    xpText: {
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#FF9800',
        fontSize: 16,
        marginBottom: 12
    },
    recommendationBox: {
        backgroundColor: '#F5F5F5',
        padding: 16,
        borderRadius: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#FF9800'
    },
    recommendationTitle: {
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333'
    },
    recItem: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 6,
        alignItems: 'flex-start'
    },
    recText: {
        flex: 1,
        fontSize: 14,
        color: '#555',
        lineHeight: 20
    },
    actionButtons: {
        width: '100%',
        gap: 12
    },
    mainButton: {
        borderRadius: 30,
        paddingVertical: 4
    },
    secondaryButton: {
        borderRadius: 30,
        borderWidth: 1.5
    },
    secondaryActions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 8
    }
});

export default GameResultModal;
