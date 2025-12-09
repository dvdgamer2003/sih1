import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Text, Surface, useTheme, ActivityIndicator, Searchbar } from 'react-native-paper';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { useAppTheme } from '../../context/ThemeContext';
import api from '../../services/api';

interface StudentWellbeing {
    _id: string;
    name: string;
    avatar: string | null;
    todayMinutes: number;
    weeklyMinutes: number;
    averageDaily: number;
    lastActive: string | null;
    streak: number;
}

interface WellbeingStats {
    students: StudentWellbeing[];
    classAverage: number;
    totalStudents: number;
    activeToday: number;
}

const TeacherWellbeingScreen = () => {
    const theme = useTheme();
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const { isDark } = useAppTheme();
    const styles = createStyles(isDark);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [stats, setStats] = useState<WellbeingStats | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'name' | 'today' | 'weekly'>('today');
    const [sortAsc, setSortAsc] = useState(false);

    const loadData = useCallback(async () => {
        try {
            const response = await api.get('/wellbeing/students');
            setStats(response.data);
        } catch (error) {
            console.error('Failed to load wellbeing data:', error);
            // Mock data for development
            setStats({
                students: [
                    { _id: '1', name: 'Rahul Sharma', avatar: null, todayMinutes: 45, weeklyMinutes: 280, averageDaily: 40, lastActive: new Date().toISOString(), streak: 5 },
                    { _id: '2', name: 'Priya Patel', avatar: null, todayMinutes: 30, weeklyMinutes: 210, averageDaily: 30, lastActive: new Date().toISOString(), streak: 3 },
                    { _id: '3', name: 'Amit Kumar', avatar: null, todayMinutes: 60, weeklyMinutes: 420, averageDaily: 60, lastActive: new Date().toISOString(), streak: 7 },
                    { _id: '4', name: 'Sneha Gupta', avatar: null, todayMinutes: 15, weeklyMinutes: 105, averageDaily: 15, lastActive: null, streak: 0 },
                    { _id: '5', name: 'Vikram Singh', avatar: null, todayMinutes: 0, weeklyMinutes: 90, averageDaily: 13, lastActive: null, streak: 0 },
                ],
                classAverage: 36,
                totalStudents: 5,
                activeToday: 3
            });
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const onRefresh = () => {
        setRefreshing(true);
        loadData();
    };

    const formatDuration = (minutes: number): string => {
        if (minutes < 60) {
            return `${minutes}m`;
        }
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    };

    const getActivityStatus = (minutes: number): { label: string; color: string } => {
        if (minutes === 0) return { label: 'Inactive', color: '#EF4444' };
        if (minutes < 20) return { label: 'Low', color: '#F97316' };
        if (minutes < 45) return { label: 'Moderate', color: '#F59E0B' };
        return { label: 'Active', color: '#10B981' };
    };

    const getSortedStudents = (): StudentWellbeing[] => {
        if (!stats) return [];

        let filtered = stats.students.filter(s =>
            s.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

        filtered.sort((a, b) => {
            let comparison = 0;
            switch (sortBy) {
                case 'name':
                    comparison = a.name.localeCompare(b.name);
                    break;
                case 'today':
                    comparison = b.todayMinutes - a.todayMinutes;
                    break;
                case 'weekly':
                    comparison = b.weeklyMinutes - a.weeklyMinutes;
                    break;
            }
            return sortAsc ? -comparison : comparison;
        });

        return filtered;
    };

    const toggleSort = (field: 'name' | 'today' | 'weekly') => {
        if (sortBy === field) {
            setSortAsc(!sortAsc);
        } else {
            setSortBy(field);
            setSortAsc(false);
        }
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
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {/* Header */}
                <LinearGradient
                    colors={['#8B5CF6', '#7C3AED', '#6D28D9']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.header, { paddingTop: insets.top + 10 }]}
                >
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <View style={styles.headerContent}>
                        <Text style={styles.headerTitle}>Student Wellbeing</Text>
                        <Text style={styles.headerSubtitle}>Monitor student screen time</Text>
                    </View>
                </LinearGradient>

                {/* Quick Stats */}
                <Animated.View entering={FadeInDown.delay(100).duration(600)}>
                    <View style={styles.statsRow}>
                        <Surface style={styles.statCard} elevation={2}>
                            <MaterialCommunityIcons name="account-group" size={28} color="#8B5CF6" />
                            <Text style={styles.statValue}>{stats?.totalStudents || 0}</Text>
                            <Text style={styles.statLabel}>Total Students</Text>
                        </Surface>
                        <Surface style={styles.statCard} elevation={2}>
                            <MaterialCommunityIcons name="account-check" size={28} color="#10B981" />
                            <Text style={styles.statValue}>{stats?.activeToday || 0}</Text>
                            <Text style={styles.statLabel}>Active Today</Text>
                        </Surface>
                        <Surface style={styles.statCard} elevation={2}>
                            <MaterialCommunityIcons name="clock-outline" size={28} color="#F59E0B" />
                            <Text style={styles.statValue}>{formatDuration(stats?.classAverage || 0)}</Text>
                            <Text style={styles.statLabel}>Avg. Daily</Text>
                        </Surface>
                    </View>
                </Animated.View>

                {/* Search Bar */}
                <Animated.View entering={FadeInDown.delay(200).duration(600)}>
                    <Searchbar
                        placeholder="Search students..."
                        onChangeText={setSearchQuery}
                        value={searchQuery}
                        style={styles.searchBar}
                        inputStyle={styles.searchInput}
                    />
                </Animated.View>

                {/* Sort Options */}
                <Animated.View entering={FadeInDown.delay(300).duration(600)}>
                    <View style={styles.sortRow}>
                        <Text style={styles.sortLabel}>Sort by:</Text>
                        <TouchableOpacity
                            style={[styles.sortButton, sortBy === 'name' && styles.sortButtonActive]}
                            onPress={() => toggleSort('name')}
                        >
                            <Text style={[styles.sortButtonText, sortBy === 'name' && styles.sortButtonTextActive]}>
                                Name {sortBy === 'name' && (sortAsc ? '↑' : '↓')}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.sortButton, sortBy === 'today' && styles.sortButtonActive]}
                            onPress={() => toggleSort('today')}
                        >
                            <Text style={[styles.sortButtonText, sortBy === 'today' && styles.sortButtonTextActive]}>
                                Today {sortBy === 'today' && (sortAsc ? '↑' : '↓')}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.sortButton, sortBy === 'weekly' && styles.sortButtonActive]}
                            onPress={() => toggleSort('weekly')}
                        >
                            <Text style={[styles.sortButtonText, sortBy === 'weekly' && styles.sortButtonTextActive]}>
                                Weekly {sortBy === 'weekly' && (sortAsc ? '↑' : '↓')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>

                {/* Student List */}
                <Animated.View entering={FadeInDown.delay(400).duration(600)}>
                    <Text style={styles.sectionTitle}>Students</Text>
                    {getSortedStudents().map((student, index) => {
                        const status = getActivityStatus(student.todayMinutes);
                        return (
                            <Surface key={student._id} style={styles.studentCard} elevation={2}>
                                <View style={styles.studentHeader}>
                                    <View style={styles.studentInfo}>
                                        <View style={styles.avatarContainer}>
                                            {student.avatar ? (
                                                <View style={styles.avatar}>
                                                    <Text style={styles.avatarText}>
                                                        {student.name.charAt(0).toUpperCase()}
                                                    </Text>
                                                </View>
                                            ) : (
                                                <LinearGradient
                                                    colors={['#8B5CF6', '#7C3AED']}
                                                    style={styles.avatar}
                                                >
                                                    <Text style={styles.avatarText}>
                                                        {student.name.charAt(0).toUpperCase()}
                                                    </Text>
                                                </LinearGradient>
                                            )}
                                            {student.streak > 0 && (
                                                <View style={styles.streakBadge}>
                                                    <Text style={styles.streakText}>🔥{student.streak}</Text>
                                                </View>
                                            )}
                                        </View>
                                        <View style={styles.nameContainer}>
                                            <Text style={styles.studentName}>{student.name}</Text>
                                            <View style={[styles.statusBadge, { backgroundColor: status.color + '20' }]}>
                                                <View style={[styles.statusDot, { backgroundColor: status.color }]} />
                                                <Text style={[styles.statusText, { color: status.color }]}>
                                                    {status.label}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.studentStats}>
                                    <View style={styles.studentStatItem}>
                                        <Text style={styles.studentStatLabel}>Today</Text>
                                        <Text style={styles.studentStatValue}>
                                            {formatDuration(student.todayMinutes)}
                                        </Text>
                                    </View>
                                    <View style={styles.divider} />
                                    <View style={styles.studentStatItem}>
                                        <Text style={styles.studentStatLabel}>This Week</Text>
                                        <Text style={styles.studentStatValue}>
                                            {formatDuration(student.weeklyMinutes)}
                                        </Text>
                                    </View>
                                    <View style={styles.divider} />
                                    <View style={styles.studentStatItem}>
                                        <Text style={styles.studentStatLabel}>Avg/Day</Text>
                                        <Text style={styles.studentStatValue}>
                                            {formatDuration(student.averageDaily)}
                                        </Text>
                                    </View>
                                </View>
                            </Surface>
                        );
                    })}
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
        paddingBottom: 24,
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
        paddingVertical: 10,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#fff',
    },
    headerSubtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 5,
    },
    statsRow: {
        flexDirection: 'row',
        marginHorizontal: 16,
        marginTop: 20,
        gap: 12,
    },
    statCard: {
        flex: 1,
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        backgroundColor: isDark ? '#1E293B' : '#fff',
    },
    statValue: {
        fontSize: 20,
        fontWeight: '800',
        color: isDark ? '#F1F5F9' : '#1A1A1A',
        marginTop: 8,
    },
    statLabel: {
        fontSize: 11,
        color: isDark ? '#94A3B8' : '#666',
        marginTop: 4,
        textAlign: 'center',
    },
    searchBar: {
        marginHorizontal: 16,
        marginTop: 20,
        borderRadius: 12,
        backgroundColor: isDark ? '#1E293B' : '#fff',
    },
    searchInput: {
        color: isDark ? '#F1F5F9' : '#1A1A1A',
    },
    sortRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        marginTop: 16,
        gap: 8,
    },
    sortLabel: {
        fontSize: 14,
        color: isDark ? '#94A3B8' : '#666',
    },
    sortButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: isDark ? '#1E293B' : '#fff',
    },
    sortButtonActive: {
        backgroundColor: '#8B5CF6',
    },
    sortButtonText: {
        fontSize: 13,
        color: isDark ? '#94A3B8' : '#666',
    },
    sortButtonTextActive: {
        color: '#fff',
        fontWeight: '600',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: isDark ? '#F1F5F9' : '#1A1A1A',
        marginHorizontal: 16,
        marginTop: 24,
        marginBottom: 12,
    },
    studentCard: {
        marginHorizontal: 16,
        marginBottom: 12,
        borderRadius: 16,
        padding: 16,
        backgroundColor: isDark ? '#1E293B' : '#fff',
    },
    studentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    studentInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatarContainer: {
        position: 'relative',
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontSize: 20,
        fontWeight: '700',
        color: '#fff',
    },
    streakBadge: {
        position: 'absolute',
        bottom: -4,
        right: -4,
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 4,
        paddingVertical: 2,
    },
    streakText: {
        fontSize: 10,
        fontWeight: '700',
    },
    nameContainer: {
        gap: 4,
    },
    studentName: {
        fontSize: 16,
        fontWeight: '700',
        color: isDark ? '#F1F5F9' : '#1A1A1A',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 10,
        gap: 4,
        alignSelf: 'flex-start',
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    statusText: {
        fontSize: 11,
        fontWeight: '600',
    },
    studentStats: {
        flexDirection: 'row',
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: isDark ? '#334155' : '#F0F0F0',
    },
    studentStatItem: {
        flex: 1,
        alignItems: 'center',
    },
    studentStatLabel: {
        fontSize: 11,
        color: isDark ? '#94A3B8' : '#666',
        marginBottom: 4,
    },
    studentStatValue: {
        fontSize: 16,
        fontWeight: '700',
        color: isDark ? '#F1F5F9' : '#1A1A1A',
    },
    divider: {
        width: 1,
        backgroundColor: isDark ? '#334155' : '#F0F0F0',
    },
});

export default TeacherWellbeingScreen;
