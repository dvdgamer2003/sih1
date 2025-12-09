import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Dimensions } from 'react-native';
import { Text, ActivityIndicator, Surface, Searchbar, Chip } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { useAppTheme } from '../context/ThemeContext';
import PendingUserCard from '../components/PendingUserCard';
import api from '../services/api';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface PendingUser {
    _id: string;
    name: string;
    email: string;
    role: 'student' | 'teacher' | 'institute';
    createdAt: string;
    selectedClass?: number;
    instituteId?: { name: string };
}

const AdminDashboardScreen = () => {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const { user, logout } = useAuth();
    const { isDark } = useAppTheme();
    const styles = createStyles(isDark);

    const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterRole, setFilterRole] = useState<string | null>(null);

    const fetchPendingUsers = async () => {
        try {
            const response = await api.get('/approval/pending');
            setPendingUsers(response.data);
        } catch (error) {
            console.error('Failed to fetch pending users:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchPendingUsers();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchPendingUsers();
    };

    const handleApprove = (userId: string) => {
        setPendingUsers(prev => prev.filter(u => u._id !== userId));
    };

    const handleReject = (userId: string) => {
        setPendingUsers(prev => prev.filter(u => u._id !== userId));
    };

    const getFilteredUsers = () => {
        let filtered = pendingUsers;

        if (searchQuery) {
            filtered = filtered.filter(u =>
                u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                u.email.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (filterRole) {
            filtered = filtered.filter(u => u.role === filterRole);
        }

        return filtered;
    };

    const getRoleCounts = () => {
        return {
            all: pendingUsers.length,
            student: pendingUsers.filter(u => u.role === 'student').length,
            teacher: pendingUsers.filter(u => u.role === 'teacher').length,
            institute: pendingUsers.filter(u => u.role === 'institute').length,
        };
    };

    const roleCounts = getRoleCounts();
    const filteredUsers = getFilteredUsers();

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                {/* Header */}
                <LinearGradient
                    colors={['#F59E0B', '#D97706', '#B45309']}
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
                        <MaterialCommunityIcons name="account-clock" size={48} color="#fff" />
                        <Text style={styles.headerTitle}>Pending Approvals</Text>
                        <Text style={styles.headerSubtitle}>
                            {pendingUsers.length} {pendingUsers.length === 1 ? 'request' : 'requests'} waiting for review
                        </Text>
                    </View>

                    <TouchableOpacity onPress={logout} style={styles.logoutButton}>
                        <Ionicons name="log-out-outline" size={22} color="#fff" />
                    </TouchableOpacity>
                </LinearGradient>

                {/* Stats Cards */}
                <Animated.View entering={FadeInDown.delay(100).duration(600)}>
                    <View style={styles.statsRow}>
                        <Surface style={styles.statCard} elevation={2}>
                            <View style={[styles.statIconContainer, { backgroundColor: '#FEF3C7' }]}>
                                <MaterialCommunityIcons name="account-group" size={24} color="#F59E0B" />
                            </View>
                            <Text style={styles.statValue}>{roleCounts.all}</Text>
                            <Text style={styles.statLabel}>Total Pending</Text>
                        </Surface>
                        <Surface style={styles.statCard} elevation={2}>
                            <View style={[styles.statIconContainer, { backgroundColor: '#DBEAFE' }]}>
                                <MaterialCommunityIcons name="school" size={24} color="#3B82F6" />
                            </View>
                            <Text style={styles.statValue}>{roleCounts.student}</Text>
                            <Text style={styles.statLabel}>Students</Text>
                        </Surface>
                        <Surface style={styles.statCard} elevation={2}>
                            <View style={[styles.statIconContainer, { backgroundColor: '#D1FAE5' }]}>
                                <MaterialCommunityIcons name="human-male-board" size={24} color="#10B981" />
                            </View>
                            <Text style={styles.statValue}>{roleCounts.teacher}</Text>
                            <Text style={styles.statLabel}>Teachers</Text>
                        </Surface>
                        <Surface style={styles.statCard} elevation={2}>
                            <View style={[styles.statIconContainer, { backgroundColor: '#EDE9FE' }]}>
                                <MaterialCommunityIcons name="domain" size={24} color="#8B5CF6" />
                            </View>
                            <Text style={styles.statValue}>{roleCounts.institute}</Text>
                            <Text style={styles.statLabel}>Institutes</Text>
                        </Surface>
                    </View>
                </Animated.View>

                {/* Search and Filter */}
                <Animated.View entering={FadeInDown.delay(200).duration(600)}>
                    <Searchbar
                        placeholder="Search by name or email..."
                        onChangeText={setSearchQuery}
                        value={searchQuery}
                        style={styles.searchBar}
                        inputStyle={styles.searchInput}
                        icon={() => <MaterialCommunityIcons name="magnify" size={22} color="#999" />}
                    />

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.chipScroll}
                        contentContainerStyle={styles.chipContainer}
                    >
                        <Chip
                            mode={filterRole === null ? 'flat' : 'outlined'}
                            selected={filterRole === null}
                            onPress={() => setFilterRole(null)}
                            style={[styles.chip, filterRole === null && styles.chipActive]}
                            textStyle={filterRole === null ? styles.chipTextActive : styles.chipText}
                        >
                            All ({roleCounts.all})
                        </Chip>
                        <Chip
                            mode={filterRole === 'student' ? 'flat' : 'outlined'}
                            selected={filterRole === 'student'}
                            onPress={() => setFilterRole('student')}
                            style={[styles.chip, filterRole === 'student' && styles.chipStudent]}
                            textStyle={filterRole === 'student' ? styles.chipTextActive : styles.chipText}
                        >
                            Students ({roleCounts.student})
                        </Chip>
                        <Chip
                            mode={filterRole === 'teacher' ? 'flat' : 'outlined'}
                            selected={filterRole === 'teacher'}
                            onPress={() => setFilterRole('teacher')}
                            style={[styles.chip, filterRole === 'teacher' && styles.chipTeacher]}
                            textStyle={filterRole === 'teacher' ? styles.chipTextActive : styles.chipText}
                        >
                            Teachers ({roleCounts.teacher})
                        </Chip>
                        <Chip
                            mode={filterRole === 'institute' ? 'flat' : 'outlined'}
                            selected={filterRole === 'institute'}
                            onPress={() => setFilterRole('institute')}
                            style={[styles.chip, filterRole === 'institute' && styles.chipInstitute]}
                            textStyle={filterRole === 'institute' ? styles.chipTextActive : styles.chipText}
                        >
                            Institutes ({roleCounts.institute})
                        </Chip>
                    </ScrollView>
                </Animated.View>

                {/* Pending Users List */}
                <Animated.View entering={FadeInDown.delay(300).duration(600)}>
                    <View style={styles.listHeader}>
                        <Text style={styles.listTitle}>
                            {filterRole ? `${filterRole.charAt(0).toUpperCase() + filterRole.slice(1)}s` : 'All'} Pending
                        </Text>
                        <Text style={styles.listCount}>{filteredUsers.length} results</Text>
                    </View>

                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#F59E0B" />
                            <Text style={styles.loadingText}>Loading requests...</Text>
                        </View>
                    ) : filteredUsers.length === 0 ? (
                        <Surface style={styles.emptyCard} elevation={2}>
                            <View style={styles.emptyContent}>
                                <View style={styles.emptyIconContainer}>
                                    <MaterialCommunityIcons name="check-decagram" size={64} color="#10B981" />
                                </View>
                                <Text style={styles.emptyTitle}>All Caught Up! 🎉</Text>
                                <Text style={styles.emptyText}>
                                    {searchQuery || filterRole
                                        ? 'No matching requests found. Try adjusting your filters.'
                                        : 'There are no pending approval requests at the moment. Check back later!'}
                                </Text>
                                {(searchQuery || filterRole) && (
                                    <TouchableOpacity
                                        style={styles.clearButton}
                                        onPress={() => { setSearchQuery(''); setFilterRole(null); }}
                                    >
                                        <Text style={styles.clearButtonText}>Clear Filters</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </Surface>
                    ) : (
                        filteredUsers.map((user, index) => (
                            <Animated.View
                                key={user._id}
                                entering={FadeInUp.delay(100 + index * 50).duration(400)}
                            >
                                <PendingUserCard
                                    user={user}
                                    onApprove={handleApprove}
                                    onReject={handleReject}
                                />
                            </Animated.View>
                        ))
                    )}
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
        position: 'relative',
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
        paddingVertical: 10,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#fff',
        marginTop: 10,
    },
    headerSubtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.9)',
        marginTop: 5,
    },
    logoutButton: {
        position: 'absolute',
        top: 60,
        right: 20,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    statsRow: {
        flexDirection: 'row',
        marginHorizontal: 16,
        marginTop: -20,
        gap: 8,
    },
    statCard: {
        flex: 1,
        padding: 12,
        borderRadius: 16,
        alignItems: 'center',
        backgroundColor: isDark ? '#1E293B' : '#fff',
    },
    statIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    statValue: {
        fontSize: 20,
        fontWeight: '800',
        color: isDark ? '#F1F5F9' : '#1A1A1A',
    },
    statLabel: {
        fontSize: 10,
        color: isDark ? '#94A3B8' : '#666',
        marginTop: 2,
        textAlign: 'center',
    },
    searchBar: {
        marginHorizontal: 16,
        marginTop: 20,
        borderRadius: 12,
        backgroundColor: isDark ? '#1E293B' : '#fff',
        elevation: 2,
    },
    searchInput: {
        color: isDark ? '#F1F5F9' : '#1A1A1A',
    },
    chipScroll: {
        marginTop: 12,
    },
    chipContainer: {
        paddingHorizontal: 16,
        gap: 8,
    },
    chip: {
        borderRadius: 20,
        backgroundColor: isDark ? '#1E293B' : '#fff',
    },
    chipActive: {
        backgroundColor: '#F59E0B',
    },
    chipStudent: {
        backgroundColor: '#3B82F6',
    },
    chipTeacher: {
        backgroundColor: '#10B981',
    },
    chipInstitute: {
        backgroundColor: '#8B5CF6',
    },
    chipText: {
        color: isDark ? '#94A3B8' : '#666',
    },
    chipTextActive: {
        color: '#fff',
        fontWeight: '600',
    },
    listHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 16,
        marginTop: 24,
        marginBottom: 12,
    },
    listTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: isDark ? '#F1F5F9' : '#1A1A1A',
    },
    listCount: {
        fontSize: 14,
        color: isDark ? '#94A3B8' : '#666',
    },
    loadingContainer: {
        padding: 40,
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        color: isDark ? '#94A3B8' : '#666',
    },
    emptyCard: {
        marginHorizontal: 16,
        borderRadius: 20,
        backgroundColor: isDark ? '#1E293B' : '#fff',
        overflow: 'hidden',
    },
    emptyContent: {
        alignItems: 'center',
        padding: 40,
    },
    emptyIconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: isDark ? '#064E3B' : '#D1FAE5',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    emptyTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: isDark ? '#F1F5F9' : '#1A1A1A',
        marginBottom: 10,
    },
    emptyText: {
        fontSize: 15,
        color: isDark ? '#94A3B8' : '#666',
        textAlign: 'center',
        lineHeight: 22,
        paddingHorizontal: 20,
    },
    clearButton: {
        marginTop: 20,
        paddingHorizontal: 24,
        paddingVertical: 12,
        backgroundColor: '#F59E0B',
        borderRadius: 25,
    },
    clearButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
});

export default AdminDashboardScreen;
