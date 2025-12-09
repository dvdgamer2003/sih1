import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { Text, Surface, useTheme, ActivityIndicator, Switch } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useAppTheme } from '../context/ThemeContext';
import screenTimeService, { ScreenTimeStats, DailyScreenTime } from '../services/screenTimeService';
import { BarChart } from 'react-native-chart-kit';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const DigitalWellbeingScreen = () => {
    const theme = useTheme();
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const { isDark } = useAppTheme();
    const styles = createStyles(isDark);

    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<ScreenTimeStats | null>(null);
    const [goalEnabled, setGoalEnabled] = useState(false);
    const [dailyGoal, setDailyGoal] = useState(60);

    const loadStats = useCallback(async () => {
        try {
            setLoading(true);
            const data = await screenTimeService.getStats();
            setStats(data);
            setDailyGoal(data.dailyGoalMinutes);
            setGoalEnabled(data.dailyGoalMinutes > 0);
        } catch (error) {
            console.error('Failed to load screen time stats:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadStats();
        }, [loadStats])
    );

    const handleGoalChange = async (enabled: boolean) => {
        setGoalEnabled(enabled);
        if (!enabled) {
            await screenTimeService.setDailyGoal(0);
        } else {
            await screenTimeService.setDailyGoal(dailyGoal);
        }
    };

    const adjustGoal = async (delta: number) => {
        const newGoal = Math.max(15, Math.min(300, dailyGoal + delta));
        setDailyGoal(newGoal);
        if (goalEnabled) {
            await screenTimeService.setDailyGoal(newGoal);
        }
    };

    const getWeekdayLabels = (): string[] => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return stats?.thisWeek.map(d => {
            const date = new Date(d.date);
            return days[date.getDay()];
        }) || [];
    };

    const getProgressPercentage = (): number => {
        if (!stats || dailyGoal === 0) return 0;
        return Math.min(100, (stats.today.totalMinutes / dailyGoal) * 100);
    };

    const getProgressColor = (): string => {
        const pct = getProgressPercentage();
        if (pct < 50) return '#10B981';
        if (pct < 80) return '#F59E0B';
        if (pct < 100) return '#F97316';
        return '#EF4444';
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.centered]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <LinearGradient
                    colors={['#10B981', '#059669', '#047857']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.header, { paddingTop: insets.top + 10 }]}
                >
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
                    </TouchableOpacity>
                    <View style={styles.headerContent}>
                        <MaterialCommunityIcons name="clock-time-eight-outline" size={48} color="#fff" />
                        <Text style={styles.headerTitle}>Digital Wellbeing</Text>
                        <Text style={styles.headerSubtitle}>Track your learning time</Text>
                    </View>
                </LinearGradient>

                {/* Today's Summary Card */}
                <Animated.View entering={FadeInDown.delay(100).duration(600)}>
                    <Surface style={styles.todayCard} elevation={3}>
                        <View style={styles.todayHeader}>
                            <Text style={styles.todayLabel}>Today's Screen Time</Text>
                            <View style={[styles.badge, { backgroundColor: getProgressColor() + '20' }]}>
                                <MaterialCommunityIcons
                                    name={getProgressPercentage() >= 100 ? "alert" : "check-circle"}
                                    size={14}
                                    color={getProgressColor()}
                                />
                                <Text style={[styles.badgeText, { color: getProgressColor() }]}>
                                    {getProgressPercentage() >= 100 ? 'Goal Reached' : 'On Track'}
                                </Text>
                            </View>
                        </View>
                        <Text style={styles.todayTime}>
                            {screenTimeService.formatDuration(stats?.today.totalMinutes || 0)}
                        </Text>

                        {/* Progress Bar */}
                        {goalEnabled && dailyGoal > 0 && (
                            <View style={styles.progressContainer}>
                                <View style={styles.progressBar}>
                                    <View
                                        style={[
                                            styles.progressFill,
                                            {
                                                width: `${getProgressPercentage()}%`,
                                                backgroundColor: getProgressColor()
                                            }
                                        ]}
                                    />
                                </View>
                                <Text style={styles.progressText}>
                                    {Math.round(getProgressPercentage())}% of {screenTimeService.formatDuration(dailyGoal)} goal
                                </Text>
                            </View>
                        )}

                        <Text style={styles.sessionsText}>
                            {stats?.today.sessions || 0} sessions today
                        </Text>
                    </Surface>
                </Animated.View>

                {/* Activity Breakdown */}
                <Animated.View entering={FadeInDown.delay(200).duration(600)}>
                    <Text style={styles.sectionTitle}>Activity Breakdown</Text>
                    <Surface style={styles.breakdownCard} elevation={2}>
                        <View style={styles.breakdownRow}>
                            <View style={styles.breakdownItem}>
                                <View style={[styles.breakdownIcon, { backgroundColor: '#E3F2FD' }]}>
                                    <MaterialCommunityIcons name="gamepad-variant" size={24} color="#1565C0" />
                                </View>
                                <Text style={styles.breakdownLabel}>Games</Text>
                                <Text style={styles.breakdownValue}>
                                    {screenTimeService.formatDuration(stats?.today.breakdown.games || 0)}
                                </Text>
                            </View>
                            <View style={styles.breakdownItem}>
                                <View style={[styles.breakdownIcon, { backgroundColor: '#E8F5E9' }]}>
                                    <MaterialCommunityIcons name="book-open-variant" size={24} color="#2E7D32" />
                                </View>
                                <Text style={styles.breakdownLabel}>Lessons</Text>
                                <Text style={styles.breakdownValue}>
                                    {screenTimeService.formatDuration(stats?.today.breakdown.lessons || 0)}
                                </Text>
                            </View>
                            <View style={styles.breakdownItem}>
                                <View style={[styles.breakdownIcon, { backgroundColor: '#FFF3E0' }]}>
                                    <MaterialCommunityIcons name="help-circle" size={24} color="#E65100" />
                                </View>
                                <Text style={styles.breakdownLabel}>Quizzes</Text>
                                <Text style={styles.breakdownValue}>
                                    {screenTimeService.formatDuration(stats?.today.breakdown.quizzes || 0)}
                                </Text>
                            </View>
                            <View style={styles.breakdownItem}>
                                <View style={[styles.breakdownIcon, { backgroundColor: '#F3E5F5' }]}>
                                    <MaterialCommunityIcons name="apps" size={24} color="#7B1FA2" />
                                </View>
                                <Text style={styles.breakdownLabel}>Other</Text>
                                <Text style={styles.breakdownValue}>
                                    {screenTimeService.formatDuration(stats?.today.breakdown.other || 0)}
                                </Text>
                            </View>
                        </View>
                    </Surface>
                </Animated.View>

                {/* Weekly Chart */}
                <Animated.View entering={FadeInDown.delay(300).duration(600)}>
                    <Text style={styles.sectionTitle}>This Week</Text>
                    <Surface style={styles.chartCard} elevation={2}>
                        <View style={styles.chartHeader}>
                            <Text style={styles.chartLabel}>Average: {screenTimeService.formatDuration(stats?.averageDaily || 0)}/day</Text>
                        </View>
                        {stats && stats.thisWeek.length > 0 && (
                            <BarChart
                                data={{
                                    labels: getWeekdayLabels(),
                                    datasets: [{
                                        data: stats.thisWeek.map(d => d.totalMinutes)
                                    }]
                                }}
                                width={SCREEN_WIDTH - 64}
                                height={180}
                                yAxisSuffix="m"
                                yAxisLabel=""
                                chartConfig={{
                                    backgroundColor: isDark ? '#1E293B' : '#fff',
                                    backgroundGradientFrom: isDark ? '#1E293B' : '#fff',
                                    backgroundGradientTo: isDark ? '#1E293B' : '#fff',
                                    decimalPlaces: 0,
                                    color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
                                    labelColor: (opacity = 1) => isDark ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
                                    style: { borderRadius: 16 },
                                    barPercentage: 0.6,
                                }}
                                style={styles.chart}
                                showValuesOnTopOfBars
                                fromZero
                            />
                        )}
                    </Surface>
                </Animated.View>

                {/* Daily Goal Setting */}
                <Animated.View entering={FadeInDown.delay(400).duration(600)}>
                    <Text style={styles.sectionTitle}>Daily Goal</Text>
                    <Surface style={styles.goalCard} elevation={2}>
                        <View style={styles.goalHeader}>
                            <View style={styles.goalInfo}>
                                <MaterialCommunityIcons name="target" size={24} color="#10B981" />
                                <Text style={styles.goalLabel}>Set a daily learning goal</Text>
                            </View>
                            <Switch
                                value={goalEnabled}
                                onValueChange={handleGoalChange}
                                color="#10B981"
                            />
                        </View>

                        {goalEnabled && (
                            <View style={styles.goalAdjuster}>
                                <TouchableOpacity
                                    style={styles.goalButton}
                                    onPress={() => adjustGoal(-15)}
                                >
                                    <MaterialCommunityIcons name="minus" size={24} color="#666" />
                                </TouchableOpacity>
                                <View style={styles.goalDisplay}>
                                    <Text style={styles.goalValue}>{screenTimeService.formatDuration(dailyGoal)}</Text>
                                    <Text style={styles.goalUnit}>per day</Text>
                                </View>
                                <TouchableOpacity
                                    style={styles.goalButton}
                                    onPress={() => adjustGoal(15)}
                                >
                                    <MaterialCommunityIcons name="plus" size={24} color="#666" />
                                </TouchableOpacity>
                            </View>
                        )}
                    </Surface>
                </Animated.View>

                {/* Tips Section */}
                <Animated.View entering={FadeInUp.delay(500).duration(600)}>
                    <Surface style={styles.tipsCard} elevation={2}>
                        <View style={styles.tipHeader}>
                            <MaterialCommunityIcons name="lightbulb-outline" size={24} color="#F59E0B" />
                            <Text style={styles.tipTitle}>Wellness Tip</Text>
                        </View>
                        <Text style={styles.tipText}>
                            Take regular breaks! The 20-20-20 rule: Every 20 minutes, look at something 20 feet away for 20 seconds.
                        </Text>
                    </Surface>
                </Animated.View>

                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
};

const createStyles = (isDark: boolean) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: isDark ? '#0F172A' : '#F5F5F5',
    },
    centered: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    header: {
        paddingHorizontal: 20,
        paddingBottom: 30,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    headerContent: {
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#fff',
        marginTop: 10,
    },
    headerSubtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 5,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: isDark ? '#F1F5F9' : '#1A1A1A',
        marginHorizontal: 20,
        marginTop: 24,
        marginBottom: 12,
    },
    todayCard: {
        marginHorizontal: 20,
        marginTop: -20,
        borderRadius: 20,
        padding: 24,
        backgroundColor: isDark ? '#1E293B' : '#fff',
    },
    todayHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    todayLabel: {
        fontSize: 14,
        color: isDark ? '#94A3B8' : '#666',
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        gap: 4,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '600',
    },
    todayTime: {
        fontSize: 48,
        fontWeight: '800',
        color: isDark ? '#F1F5F9' : '#1A1A1A',
        marginTop: 10,
    },
    progressContainer: {
        marginTop: 16,
    },
    progressBar: {
        height: 8,
        backgroundColor: isDark ? '#334155' : '#E5E7EB',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 4,
    },
    progressText: {
        fontSize: 12,
        color: isDark ? '#94A3B8' : '#666',
        marginTop: 6,
    },
    sessionsText: {
        fontSize: 14,
        color: isDark ? '#94A3B8' : '#666',
        marginTop: 12,
    },
    breakdownCard: {
        marginHorizontal: 20,
        borderRadius: 20,
        padding: 20,
        backgroundColor: isDark ? '#1E293B' : '#fff',
    },
    breakdownRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    breakdownItem: {
        alignItems: 'center',
        flex: 1,
    },
    breakdownIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    breakdownLabel: {
        fontSize: 12,
        color: isDark ? '#94A3B8' : '#666',
        marginBottom: 4,
    },
    breakdownValue: {
        fontSize: 16,
        fontWeight: '700',
        color: isDark ? '#F1F5F9' : '#1A1A1A',
    },
    chartCard: {
        marginHorizontal: 20,
        borderRadius: 20,
        padding: 16,
        backgroundColor: isDark ? '#1E293B' : '#fff',
    },
    chartHeader: {
        marginBottom: 10,
    },
    chartLabel: {
        fontSize: 14,
        color: isDark ? '#94A3B8' : '#666',
    },
    chart: {
        borderRadius: 16,
        marginLeft: -16,
    },
    goalCard: {
        marginHorizontal: 20,
        borderRadius: 20,
        padding: 20,
        backgroundColor: isDark ? '#1E293B' : '#fff',
    },
    goalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    goalInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    goalLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: isDark ? '#F1F5F9' : '#1A1A1A',
    },
    goalAdjuster: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        gap: 20,
    },
    goalButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: isDark ? '#334155' : '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    goalDisplay: {
        alignItems: 'center',
    },
    goalValue: {
        fontSize: 32,
        fontWeight: '800',
        color: '#10B981',
    },
    goalUnit: {
        fontSize: 14,
        color: isDark ? '#94A3B8' : '#666',
    },
    tipsCard: {
        marginHorizontal: 20,
        marginTop: 24,
        borderRadius: 20,
        padding: 20,
        backgroundColor: isDark ? '#1E293B' : '#fff',
    },
    tipHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 10,
    },
    tipTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#F59E0B',
    },
    tipText: {
        fontSize: 14,
        color: isDark ? '#CBD5E1' : '#666',
        lineHeight: 22,
    },
});

export default DigitalWellbeingScreen;
