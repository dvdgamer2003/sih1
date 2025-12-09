import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet, Dimensions, ScrollView, Alert, TouchableOpacity, LayoutRectangle, Platform } from 'react-native';
import { Text, Surface, Button, IconButton, MD3Theme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    runOnJS,
    FadeIn,
    FadeOut,
    SlideInDown,
    withTiming,
    useAnimatedReaction
} from 'react-native-reanimated';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useAppTheme } from '../../context/ThemeContext';
import { soundManager } from '../../utils/soundEffects';
import { useGameTimer } from '../../hooks/useGameTimer';
import { saveGameResult } from '../../services/gamesService';
import { calculateDelta, assessLearningOutcome, updateLeaderboardPoints } from '../../utils/deltaAssessment';
import GameResultModal from '../GameResultModal';

const { width } = Dimensions.get('window');

// --- Types ---
interface EventItem {
    id: string;
    description: string;
    year: number;
    yearDisplay: string; // "3500 BC"
    hint?: string;
}

interface SlotMeasure {
    index: number;
    x: number;
    y: number;
    width: number;
    height: number;
}

// --- Game Data ---
const LEVEL_DATA: EventItem[] = [
    { id: 'wheel', description: 'Invention of the Wheel', year: -3500, yearDisplay: '3500 BC', hint: 'Ancient transport' },
    { id: 'pyramids', description: 'Building of Great Pyramids', year: -2500, yearDisplay: '2500 BC', hint: 'Ancient wonders' },
    { id: 'paper', description: 'Invention of Paper', year: 105, yearDisplay: '105 AD', hint: 'Writing material' },
    { id: 'press', description: 'Printing Press', year: 1440, yearDisplay: '1440 AD', hint: 'Mass knowledge' },
    { id: 'steam', description: 'Steam Engine', year: 1712, yearDisplay: '1712 AD', hint: 'Industrial revolution' },
    { id: 'flight', description: 'First Airplane Flight', year: 1903, yearDisplay: '1903 AD', hint: 'Taking to the skies' },
    { id: 'moon', description: 'Moon Landing', year: 1969, yearDisplay: '1969 AD', hint: 'One small step' },
    { id: 'web', description: 'World Wide Web', year: 1989, yearDisplay: '1989 AD', hint: 'Information age' },
];

// --- Components ---

/**
 * Draggable Event Card
 * Handles its own drag logic and calls onDrop when released.
 */
const DraggableCard = ({
    item,
    onDrop,
    onDragStart,
    isLocked,
    index,
    isDark,
    showYear
}: {
    item: EventItem;
    onDrop: (itemId: string, absoluteX: number, absoluteY: number) => void;
    onDragStart: () => void;
    isLocked: boolean;
    index: number;
    isDark: boolean;
    showYear: boolean;
}) => {
    const translationX = useSharedValue(0);
    const translationY = useSharedValue(0);
    const scale = useSharedValue(1);
    const zIndex = useSharedValue(1);
    const opacity = useSharedValue(1);

    // Context for gesture
    const context = useSharedValue({ x: 0, y: 0 });

    const pan = Gesture.Pan()
        .enabled(!isLocked)
        .onStart(() => {
            context.value = { x: translationX.value, y: translationY.value };
            scale.value = withSpring(1.1);
            zIndex.value = 100;
            opacity.value = 0.9;
            runOnJS(onDragStart)();
            runOnJS(soundManager.playClick)();
        })
        .onUpdate((event) => {
            translationX.value = event.translationX + context.value.x;
            translationY.value = event.translationY + context.value.y;
        })
        .onEnd((event) => {
            scale.value = withSpring(1);
            zIndex.value = 1;
            opacity.value = 1;

            runOnJS(onDrop)(item.id, event.absoluteX, event.absoluteY);

            // Spring back anim in case we stay here
            translationX.value = withSpring(0);
            translationY.value = withSpring(0);
        });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translationX.value },
            { translateY: translationY.value },
            { scale: scale.value }
        ],
        zIndex: zIndex.value,
        opacity: opacity.value
    }));

    return (
        <GestureDetector gesture={pan}>
            <Animated.View style={[styles.cardContainer, animatedStyle]}>
                <Surface style={[
                    styles.card,
                    isLocked ? styles.cardLocked : null,
                    { backgroundColor: isDark ? '#1E293B' : '#fff' }
                ]} elevation={isLocked ? 0 : 2}>
                    <View style={styles.dragHandle}>
                        <MaterialCommunityIcons name="drag-vertical" size={20} color={isDark ? "#64748B" : "#cbd5e1"} />
                    </View>
                    <View style={styles.cardContent}>
                        <Text variant="titleSmall" style={{ fontWeight: 'bold', color: isDark ? '#F1F5F9' : '#1e293b' }}>
                            {item.description}
                        </Text>
                        {showYear && (
                            <Text variant="labelSmall" style={{ color: '#0ea5e9', marginTop: 2 }}>{item.yearDisplay}</Text>
                        )}
                        {!showYear && item.hint && (
                            <Text variant="labelSmall" style={{ color: '#64748B', marginTop: 2, fontStyle: 'italic' }}>{item.hint}</Text>
                        )}
                    </View>
                </Surface>
            </Animated.View>
        </GestureDetector>
    );
};

const TimelineSlot = ({
    index,
    item,
    onMeasure,
    isDark,
    showYear,
    isWrong
}: {
    index: number;
    item: EventItem | null;
    onMeasure: (index: number, layout: LayoutRectangle, pageX: number, pageY: number) => void;
    isDark: boolean;
    showYear: boolean;
    isWrong?: boolean;
}) => {
    const viewRef = useRef<View>(null);

    // Re-measure when layout changes or item changes
    const handleLayout = () => {
        if (viewRef.current) {
            viewRef.current.measure((x, y, width, height, pageX, pageY) => {
                onMeasure(index, { x, y, width, height }, pageX, pageY);
            });
        }
    };

    return (
        <View
            ref={viewRef}
            onLayout={handleLayout}
            style={styles.slotContainer}
        >
            <View style={[
                styles.slotBadge,
                { backgroundColor: item ? (isWrong ? '#EF4444' : '#10B981') : (isDark ? '#334155' : '#E2E8F0') }
            ]}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>{index + 1}</Text>
            </View>

            <View style={styles.slotContent}>
                {item ? (
                    // When item is in slot, we show a static looking card
                    <Surface style={[
                        styles.dockedCard,
                        {
                            backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
                            borderColor: isWrong ? '#EF4444' : '#10B981',
                            borderWidth: 1
                        }
                    ]} elevation={1}>
                        <View style={{ flex: 1 }}>
                            <Text variant="titleSmall" style={{ color: isDark ? '#F1F5F9' : '#1e293b' }}>{item.description}</Text>
                            {showYear && <Text variant="bodySmall" style={{ color: '#10B981' }}>{item.yearDisplay}</Text>}
                        </View>
                    </Surface>
                ) : (
                    <View style={styles.emptySlotPlaceholder}>
                        <Text style={{ color: isDark ? '#64748B' : '#94A3B8', fontStyle: 'italic' }}>Drop Event Here</Text>
                    </View>
                )}
            </View>
        </View>
    );
};


const TimeTravelDebugScreen = () => {
    const navigation = useNavigation();
    const { user, addXP } = useAuth();
    const { isDark } = useAppTheme();
    const { elapsedTime, startTimer, stopTimer, displayTime, resetTimer: resetGameTimer } = useGameTimer();

    // --- State ---
    const [pool, setPool] = useState<EventItem[]>([]);
    const [timeline, setTimeline] = useState<(EventItem | null)[]>(new Array(5).fill(null));
    const [scrollEnabled, setScrollEnabled] = useState(true);
    const [score, setScore] = useState(0);
    const [attempts, setAttempts] = useState(0);
    const [gameComplete, setGameComplete] = useState(false);

    // Result Modal
    const [resultModalVisible, setResultModalVisible] = useState(false);
    const [deltaResult, setDeltaResult] = useState<any>(null);
    const [learningOutcome, setLearningOutcome] = useState<any>(null);
    const [validationResult, setValidationResult] = useState<boolean[] | null>(null); // Array of true/false for each slot

    // Layout Refs for Collision Detection
    const slotMeasurements = useRef<Map<number, { pageX: number, pageY: number, width: number, height: number }>>(new Map());

    useEffect(() => {
        soundManager.initialize();
        initGame();
        return () => stopTimer();
    }, []);

    const initGame = () => {
        // Pick 5 random items
        const selected = [...LEVEL_DATA].sort(() => Math.random() - 0.5).slice(0, 5);
        // Shuffle them for the pool
        const shuffled = [...selected].sort(() => Math.random() - 0.5);
        setPool(shuffled);
        setTimeline(new Array(5).fill(null));
        setScore(0);
        setAttempts(0);
        setGameComplete(false);
        setValidationResult(null);
        resetGameTimer();
        startTimer();
    };

    const handleSlotMeasure = (index: number, layout: LayoutRectangle, pageX: number, pageY: number) => {
        slotMeasurements.current.set(index, { pageX, pageY, width: layout.width, height: layout.height });
    };

    const handleDragStart = () => {
        setScrollEnabled(false);
        setValidationResult(null); // Clear validation feedback on interaction
    };

    const handleDrop = async (itemId: string, absX: number, absY: number) => {
        setScrollEnabled(true);

        // Find if we dropped on a slot
        let targetSlotIndex = -1;

        slotMeasurements.current.forEach((rect, index) => {
            if (
                absX >= rect.pageX &&
                absX <= rect.pageX + rect.width &&
                absY >= rect.pageY &&
                absY <= rect.pageY + rect.height
            ) {
                targetSlotIndex = index;
            }
        });

        if (targetSlotIndex !== -1) {
            // Dropped on a slot!
            // Find the item
            const item = pool.find(i => i.id === itemId) || timeline.find(i => i?.id === itemId);
            if (!item) return; // Should not happen

            // Logic:
            // 1. Remove from source (Pool or another Slot)
            // 2. If target slot has item -> Move that item back to Pool (Swap/Replace logic)
            // 3. Place new item in target slot

            // Helper to get new state
            let newPool = [...pool];
            let newTimeline = [...timeline];

            // Remove from wherever it was
            const poolIndex = newPool.findIndex(i => i.id === itemId);
            if (poolIndex !== -1) {
                newPool.splice(poolIndex, 1);
            } else {
                // Was in timeline?
                const timelineIndex = newTimeline.findIndex(i => i?.id === itemId);
                if (timelineIndex !== -1) {
                    newTimeline[timelineIndex] = null;
                }
            }

            // Check target slot
            const existingItem = newTimeline[targetSlotIndex];
            if (existingItem) {
                // Return existing to pool
                newPool.push(existingItem);
            }
            // Place item
            newTimeline[targetSlotIndex] = item;

            // Trigger "snap" sound
            soundManager.playCorrect();

            setPool(newPool);
            setTimeline(newTimeline);

        } else {
            // Dropped in void/pool area -> Return to pool if it was in timeline
            const itemInTimelineIdx = timeline.findIndex(i => i?.id === itemId);
            if (itemInTimelineIdx !== -1) {
                const item = timeline[itemInTimelineIdx]!;
                const newTimeline = [...timeline];
                newTimeline[itemInTimelineIdx] = null;
                setTimeline(newTimeline);
                setPool(prev => [...prev, item]); // Add back to pool
                soundManager.playClick(); // Different sound
            }
        }
    };

    // Allow clicking timeline items to remove them easily
    const handleTimelineItemPress = (index: number) => {
        if (gameComplete) return;
        const item = timeline[index];
        if (item) {
            const newTimeline = [...timeline];
            newTimeline[index] = null;
            setTimeline(newTimeline);
            setPool(prev => [...prev, item]);
            setValidationResult(null);
            soundManager.playClick();
        }
    };

    const validateOrder = async () => {
        if (timeline.some(i => i === null)) {
            Alert.alert("Timeline Incomplete", "Please fill all 5 slots before checking.");
            return;
        }

        stopTimer();
        setAttempts(prev => prev + 1);

        const results = timeline.map(t => true); // Placeholder
        let mistakes = 0;

        // Correctness check: Strict ordering by year
        for (let i = 0; i < timeline.length - 1; i++) {
            if (timeline[i]!.year > timeline[i + 1]!.year) {
                mistakes++;
            }
        }

        // Better validation visual:
        // Sorting the current 5 items by year gives the "Correct" array
        const currentItems = [...timeline] as EventItem[];
        const sortedItems = [...currentItems].sort((a, b) => a.year - b.year);

        // Check which slots strictly match the sorted version
        const newValidation = currentItems.map((item, idx) => item.id === sortedItems[idx].id);
        setValidationResult(newValidation);

        const isCorrect = newValidation.every(v => v === true);

        if (isCorrect) {
            soundManager.playSuccess();
            setGameComplete(true);

            // Calculate Score
            const dResult = calculateDelta(elapsedTime, 'medium');
            const accuracy = Math.max(0, 100 - (attempts * 10)); // -10 per retry
            const finalScore = 500 + dResult.delta + accuracy; // Base 500

            setScore(finalScore);
            setDeltaResult(dResult);

            // Outcomes
            const outcome = assessLearningOutcome(dResult.delta, accuracy, attempts + 1, 0, 'medium');
            setLearningOutcome(outcome);

            // Save
            await saveGameResult({
                gameId: 'time_travel_debug',
                score: finalScore,
                maxScore: 1000,
                timeTaken: elapsedTime,
                difficulty: 'medium',
                accuracy: accuracy,
                subject: 'Social Science',
                classLevel: user?.selectedClass || '6',
                delta: dResult.delta,
                proficiency: dResult.proficiency,
                userId: user?._id
            });

            await updateLeaderboardPoints(dResult.delta, 'medium', user?._id || 'guest');
            setResultModalVisible(true);

        } else {
            soundManager.playWrong();
            startTimer(); // Resume timer
            Alert.alert("Time Paradox Detected!", "Events are out of order. Look for the red indicators and try again.");
        }
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <LinearGradient
                colors={isDark ? ['#0f172a', '#1e293b'] : ['#F0F9FF', '#E0F2FE']}
                style={styles.container}
            >
                {/* Header */}
                <View style={styles.header}>
                    <IconButton icon="arrow-left" iconColor={isDark ? "#fff" : "#0f172a"} onPress={() => navigation.goBack()} />
                    <View>
                        <Text variant="titleMedium" style={{ fontWeight: 'bold', color: isDark ? '#fff' : '#0f172a', textAlign: 'center' }}>Time Travel Debug</Text>
                        <Text variant="bodySmall" style={{ color: isDark ? '#94A3B8' : '#64748B', textAlign: 'center' }}>Arrange Oldest to Newest</Text>
                    </View>
                    <View style={styles.timerBadge}>
                        <MaterialCommunityIcons name="clock-outline" size={16} color="#fff" />
                        <Text style={{ color: '#fff', fontWeight: 'bold', marginLeft: 4 }}>{displayTime}</Text>
                    </View>
                </View>

                <ScrollView
                    style={styles.content}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    scrollEnabled={scrollEnabled}
                >
                    {/* Timeline Section */}
                    <View style={styles.section}>
                        <View style={styles.timelineTrack} />
                        {timeline.map((item, index) => (
                            <TouchableOpacity
                                key={`slot-${index}`}
                                activeOpacity={item ? 0.7 : 1}
                                onPress={() => handleTimelineItemPress(index)}
                            >
                                <TimelineSlot
                                    index={index}
                                    item={item}
                                    onMeasure={handleSlotMeasure}
                                    isDark={isDark}
                                    showYear={gameComplete || (attempts > 2)} // Show years on completion or after many fails (hint)
                                    isWrong={validationResult ? !validationResult[index] : false}
                                />
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Pool Section */}
                    <View style={styles.poolSection}>
                        <Text variant="titleMedium" style={[styles.sectionTitle, { color: isDark ? '#E2E8F0' : '#334155' }]}>
                            Temporal Anomalies
                        </Text>
                        <View style={styles.poolGrid}>
                            {pool.map((item, index) => (
                                <DraggableCard
                                    key={item.id}
                                    index={index}
                                    item={item}
                                    isLocked={false}
                                    onDragStart={handleDragStart}
                                    onDrop={handleDrop}
                                    isDark={isDark}
                                    showYear={false}
                                />
                            ))}
                            {pool.length === 0 && !gameComplete && (
                                <Text style={{ textAlign: 'center', color: '#94A3B8', marginTop: 20 }}>
                                    All events placed! Check your order.
                                </Text>
                            )}
                        </View>
                    </View>
                </ScrollView>

                {/* Footer Action */}
                {!gameComplete && (
                    <Surface style={[styles.footer, { backgroundColor: isDark ? '#1e293b' : '#fff' }]} elevation={4}>
                        <Button
                            mode="contained"
                            onPress={validateOrder}
                            style={styles.checkButton}
                            icon="check"
                            buttonColor="#10B981"
                        >
                            Check Timeline
                        </Button>
                    </Surface>
                )}

                <GameResultModal
                    visible={resultModalVisible}
                    gameId="time_travel_debug"
                    score={score}
                    maxScore={1000}
                    timeTaken={elapsedTime}
                    difficulty="medium"
                    deltaResult={deltaResult}
                    learningOutcome={learningOutcome}
                    onClose={() => setResultModalVisible(false)}
                    onGoHome={() => navigation.goBack()}
                    onPlayAgain={() => {
                        setResultModalVisible(false);
                        initGame();
                    }}
                />
            </LinearGradient>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: Platform.OS === 'android' ? 40 : 60,
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    timerBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#3B82F6',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    content: {
        flex: 1,
    },
    section: {
        padding: 24,
        position: 'relative',
    },
    timelineTrack: {
        position: 'absolute',
        left: 45, // Center of the badge (24 + 21?)
        top: 24,
        bottom: 24,
        width: 2,
        backgroundColor: '#CBD5E1', // slate-300
        zIndex: 0,
    },
    slotContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        zIndex: 1,
        minHeight: 70,
    },
    slotBadge: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        zIndex: 2,
    },
    slotContent: {
        flex: 1,
    },
    emptySlotPlaceholder: {
        height: 60,
        borderWidth: 2,
        borderColor: '#CBD5E1',
        borderStyle: 'dashed',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
    dockedCard: {
        padding: 16,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 60,
    },
    poolSection: {
        padding: 24,
        paddingTop: 0,
    },
    sectionTitle: {
        fontWeight: 'bold',
        marginBottom: 16,
    },
    poolGrid: {
        gap: 12,
    },
    cardContainer: {
        // marginBottom: 12,
    },
    card: {
        padding: 16,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardLocked: {
        opacity: 0.8,
    },
    dragHandle: {
        marginRight: 12,
    },
    cardContent: {
        flex: 1,
    },
    footer: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.05)',
    },
    checkButton: {
        borderRadius: 12,
        paddingVertical: 6,
    }
});

export default TimeTravelDebugScreen;
