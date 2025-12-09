import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Surface } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInRight, FadeIn } from 'react-native-reanimated';
import GradientBackground from '../../components/ui/GradientBackground';
import api from '../../services/api';

const { width } = Dimensions.get('window');

interface AnalyticsData {
    totalInstitutes: number;
    totalTeachers: number;
    totalStudents: number;
    totalQuizzesTaken: number;
    totalGamesPlayed: number;
    totalLessonsCompleted: number;
    dailyActiveUsers: number;
    weeklyActiveUsers: number;
    pendingApprovals: number;
    newUsersThisWeek: number;
    userGrowthPercent: number;
    avgQuizScore: number;
    topStudents: Array<{
        _id: string;
        name: string;
        email: string;
        xp: number;
        streak: number;
        avatar?: string;
    }>;
    gameStats: Array<{
        _id: string;
        totalPlays: number;
        avgScore: number;
    }>;
    usersByRole: Array<{ _id: string; count: number }>;
    usersByCity: Array<{ _id: string; count: number }>;
}

const GlobalAnalyticsScreen = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<AnalyticsData | null>(null);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/analytics');
            setStats(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ title, value, icon, gradient, delay = 0 }: any) => (
        <Animated.View
            entering={FadeInDown.delay(delay).duration(400)}
            style={styles.statCardContainer}
        >
            <LinearGradient colors={gradient} style={styles.statCard} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                <View style={styles.statIconContainer}>
                    <Ionicons name={icon} size={24} color="#fff" />
                </View>
                <Text style={styles.statValue}>{value?.toLocaleString() || 0}</Text>
                <Text style={styles.statTitle}>{title}</Text>
            </LinearGradient>
        </Animated.View>
    );

    const GrowthIndicator = ({ value }: { value: number }) => (
        <View style={[styles.growthBadge, { backgroundColor: value >= 0 ? '#10B981' : '#EF4444' }]}>
            <Ionicons name={value >= 0 ? 'trending-up' : 'trending-down'} size={12} color="#fff" />
            <Text style={styles.growthText}>{Math.abs(value)}%</Text>
        </View>
    );

    if (loading) {
        return (
            <GradientBackground>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#fff" />
                    <Text style={styles.loadingText}>Loading analytics...</Text>
                </View>
            </GradientBackground>
        );
    }

    return (
        <GradientBackground>
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Global Analytics</Text>
                    <TouchableOpacity onPress={fetchAnalytics} style={styles.refreshButton}>
                        <Ionicons name="refresh" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>

                {/* Quick Stats Grid */}
                <Animated.View entering={FadeIn.duration(400)} style={styles.section}>
                    <Text style={styles.sectionTitle}>Overview</Text>
                    <View style={styles.statsGrid}>
                        <StatCard title="Students" value={stats?.totalStudents} icon="people" gradient={['#10B981', '#059669']} delay={0} />
                        <StatCard title="Teachers" value={stats?.totalTeachers} icon="person" gradient={['#F59E0B', '#D97706']} delay={100} />
                        <StatCard title="Institutes" value={stats?.totalInstitutes} icon="business" gradient={['#8B5CF6', '#7C3AED']} delay={200} />
                        <StatCard title="Quizzes Taken" value={stats?.totalQuizzesTaken} icon="help-circle" gradient={['#3B82F6', '#2563EB']} delay={300} />
                        <StatCard title="Games Played" value={stats?.totalGamesPlayed} icon="game-controller" gradient={['#EC4899', '#DB2777']} delay={400} />
                        <StatCard title="Lessons Done" value={stats?.totalLessonsCompleted} icon="book" gradient={['#06B6D4', '#0891B2']} delay={500} />
                    </View>
                </Animated.View>

                {/* Engagement Section */}
                <Animated.View entering={FadeInDown.delay(300).duration(400)} style={styles.section}>
                    <Text style={styles.sectionTitle}>Engagement</Text>
                    <Surface style={styles.engagementCard} elevation={3}>
                        <View style={styles.engagementRow}>
                            <View style={styles.engagementItem}>
                                <View style={[styles.engagementIcon, { backgroundColor: '#10B98120' }]}>
                                    <Ionicons name="flash" size={24} color="#10B981" />
                                </View>
                                <Text style={styles.engagementValue}>{stats?.dailyActiveUsers || 0}</Text>
                                <Text style={styles.engagementLabel}>Daily Active</Text>
                            </View>
                            <View style={styles.engagementDivider} />
                            <View style={styles.engagementItem}>
                                <View style={[styles.engagementIcon, { backgroundColor: '#3B82F620' }]}>
                                    <Ionicons name="calendar" size={24} color="#3B82F6" />
                                </View>
                                <Text style={styles.engagementValue}>{stats?.weeklyActiveUsers || 0}</Text>
                                <Text style={styles.engagementLabel}>Weekly Active</Text>
                            </View>
                            <View style={styles.engagementDivider} />
                            <View style={styles.engagementItem}>
                                <View style={[styles.engagementIcon, { backgroundColor: '#8B5CF620' }]}>
                                    <Ionicons name="star" size={24} color="#8B5CF6" />
                                </View>
                                <Text style={styles.engagementValue}>{stats?.avgQuizScore || 0}%</Text>
                                <Text style={styles.engagementLabel}>Avg Quiz Score</Text>
                            </View>
                        </View>
                    </Surface>
                </Animated.View>

                {/* Growth Card */}
                <Animated.View entering={FadeInDown.delay(400).duration(400)} style={styles.section}>
                    <Text style={styles.sectionTitle}>Growth</Text>
                    <Surface style={styles.growthCard} elevation={3}>
                        <LinearGradient
                            colors={['#667eea', '#764ba2']}
                            style={styles.growthGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            <View style={styles.growthContent}>
                                <View>
                                    <Text style={styles.growthLabel}>New Users This Week</Text>
                                    <View style={styles.growthValueRow}>
                                        <Text style={styles.growthValue}>{stats?.newUsersThisWeek || 0}</Text>
                                        {stats && <GrowthIndicator value={stats.userGrowthPercent} />}
                                    </View>
                                </View>
                                <MaterialCommunityIcons name="chart-line" size={48} color="rgba(255,255,255,0.3)" />
                            </View>
                        </LinearGradient>
                        <View style={styles.growthStats}>
                            <View style={styles.growthStatItem}>
                                <Text style={styles.growthStatValue}>{stats?.pendingApprovals || 0}</Text>
                                <Text style={styles.growthStatLabel}>Pending Approvals</Text>
                            </View>
                        </View>
                    </Surface>
                </Animated.View>

                {/* Top Students */}
                {stats?.topStudents && stats.topStudents.length > 0 && (
                    <Animated.View entering={FadeInDown.delay(500).duration(400)} style={styles.section}>
                        <Text style={styles.sectionTitle}>🏆 Top Students</Text>
                        <Surface style={styles.leaderboardCard} elevation={3}>
                            {stats.topStudents.map((student, index) => (
                                <View key={student._id} style={[styles.studentRow, index < stats.topStudents.length - 1 && styles.studentRowBorder]}>
                                    <View style={styles.rankBadge}>
                                        <Text style={styles.rankText}>{index + 1}</Text>
                                    </View>
                                    <View style={styles.studentInfo}>
                                        <Text style={styles.studentName}>{student.name}</Text>
                                        <Text style={styles.studentEmail}>{student.email}</Text>
                                    </View>
                                    <View style={styles.studentStats}>
                                        <Text style={styles.xpValue}>{student.xp} XP</Text>
                                        <View style={styles.streakBadge}>
                                            <Ionicons name="flame" size={12} color="#F59E0B" />
                                            <Text style={styles.streakText}>{student.streak || 0}</Text>
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </Surface>
                    </Animated.View>
                )}

                {/* Popular Games */}
                {stats?.gameStats && stats.gameStats.length > 0 && (
                    <Animated.View entering={FadeInDown.delay(600).duration(400)} style={styles.section}>
                        <Text style={styles.sectionTitle}>🎮 Popular Games</Text>
                        <Surface style={styles.gamesCard} elevation={3}>
                            {stats.gameStats.map((game, index) => (
                                <View key={game._id || index} style={[styles.gameRow, index < stats.gameStats.length - 1 && styles.gameRowBorder]}>
                                    <View style={styles.gameInfo}>
                                        <Text style={styles.gameName}>{formatGameName(game._id)}</Text>
                                        <Text style={styles.gamePlays}>{game.totalPlays} plays</Text>
                                    </View>
                                    <View style={styles.gameScore}>
                                        <Text style={styles.gameScoreValue}>{Math.round(game.avgScore || 0)}</Text>
                                        <Text style={styles.gameScoreLabel}>avg score</Text>
                                    </View>
                                </View>
                            ))}
                        </Surface>
                    </Animated.View>
                )}

                {/* Cities with Users */}
                {stats?.usersByCity && stats.usersByCity.length > 0 && (
                    <Animated.View entering={FadeInDown.delay(700).duration(400)} style={styles.section}>
                        <Text style={styles.sectionTitle}>📍 Top Cities</Text>
                        <View style={styles.citiesContainer}>
                            {stats.usersByCity.map((city, index) => (
                                <View key={city._id || index} style={styles.cityChip}>
                                    <Text style={styles.cityName}>{city._id}</Text>
                                    <View style={styles.cityCount}>
                                        <Text style={styles.cityCountText}>{city.count}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </Animated.View>
                )}

                <View style={{ height: 40 }} />
            </ScrollView>
        </GradientBackground>
    );
};

const formatGameName = (name: string) => {
    if (!name) return 'Unknown';
    return name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingTop: 60,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: '#fff',
        marginTop: 12,
        fontSize: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    backButton: {
        padding: 8,
    },
    refreshButton: {
        padding: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 12,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    statCardContainer: {
        width: '31%',
        marginBottom: 12,
    },
    statCard: {
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
    },
    statIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    statValue: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
    },
    statTitle: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.9)',
        textAlign: 'center',
        marginTop: 4,
    },
    engagementCard: {
        borderRadius: 16,
        backgroundColor: '#fff',
        overflow: 'hidden',
    },
    engagementRow: {
        flexDirection: 'row',
        padding: 20,
    },
    engagementItem: {
        flex: 1,
        alignItems: 'center',
    },
    engagementDivider: {
        width: 1,
        backgroundColor: '#E5E7EB',
    },
    engagementIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    engagementValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    engagementLabel: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 4,
    },
    growthCard: {
        borderRadius: 16,
        backgroundColor: '#fff',
        overflow: 'hidden',
    },
    growthGradient: {
        padding: 20,
    },
    growthContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    growthLabel: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
    },
    growthValueRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginTop: 4,
    },
    growthValue: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#fff',
    },
    growthBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    growthText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    growthStats: {
        padding: 16,
        backgroundColor: '#F9FAFB',
    },
    growthStatItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    growthStatValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    growthStatLabel: {
        fontSize: 14,
        color: '#6B7280',
    },
    leaderboardCard: {
        borderRadius: 16,
        backgroundColor: '#fff',
        overflow: 'hidden',
    },
    studentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    studentRowBorder: {
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    rankBadge: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#667eea',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    rankText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    studentInfo: {
        flex: 1,
    },
    studentName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
    },
    studentEmail: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    studentStats: {
        alignItems: 'flex-end',
    },
    xpValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#10B981',
    },
    streakBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 4,
    },
    streakText: {
        fontSize: 12,
        color: '#F59E0B',
        fontWeight: '600',
    },
    gamesCard: {
        borderRadius: 16,
        backgroundColor: '#fff',
        overflow: 'hidden',
    },
    gameRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    gameRowBorder: {
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    gameInfo: {},
    gameName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
    },
    gamePlays: {
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 2,
    },
    gameScore: {
        alignItems: 'center',
    },
    gameScoreValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#8B5CF6',
    },
    gameScoreLabel: {
        fontSize: 10,
        color: '#9CA3AF',
    },
    citiesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    cityChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.15)',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        gap: 8,
    },
    cityName: {
        color: '#fff',
        fontSize: 14,
    },
    cityCount: {
        backgroundColor: 'rgba(255,255,255,0.3)',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
    },
    cityCountText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
});

export default GlobalAnalyticsScreen;
