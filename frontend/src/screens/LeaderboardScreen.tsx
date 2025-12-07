import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import GradientBackground from '../components/ui/GradientBackground';
import CustomCard from '../components/ui/CustomCard';
import { useAuth } from '../context/AuthContext';
import { useAppTheme } from '../context/ThemeContext';
import api from '../services/api';
import LanguageSwitcher from '../components/LanguageSwitcher';

const AVATAR_OPTIONS = [
    { id: 1, source: require('../assets/avatars/avatar_student_1_1763752373295.png'), gradient: ['#FF6B6B', '#FF8E53'] as const },
    { id: 2, source: require('../assets/avatars/avatar_student_2_1763752389652.png'), gradient: ['#4FACFE', '#00F2FE'] as const },
    { id: 3, source: require('../assets/avatars/avatar_student_3_1763752405157.png'), gradient: ['#A8EDEA', '#FED6E3'] as const },
    { id: 4, source: require('../assets/avatars/avatar_student_4_1763752424974.png'), gradient: ['#5EE7DF', '#B490CA'] as const },
    { id: 5, source: require('../assets/avatars/avatar_student_5_1763752442026.png'), gradient: ['#F093FB', '#F5576C'] as const },
    { id: 6, source: require('../assets/avatars/avatar_student_6_1763752457724.png'), gradient: ['#FAD961', '#F76B1C'] as const },
    { id: 7, source: require('../assets/avatars/avatar_student_7_1763752477440.png'), gradient: ['#667EEA', '#764BA2'] as const },
];

interface LeaderboardUser {
    _id: string;
    name: string;
    avatar?: string;
    level: number;
    selectedClass: string;
    xp: number;
    streak?: number;
    achievements?: any[];
    weeklyXP?: number;
}
const LeaderboardScreen = () => {
    const navigation = useNavigation();
    const { user } = useAuth();
    const { isDark } = useAppTheme();
    const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [timeFilter, setTimeFilter] = useState('all'); // 'all', 'week', 'month'

    const styles = createStyles(isDark);

    // Helper function to get avatar source from avatar ID
    const getAvatarSource = (avatarId?: string) => {
        if (!avatarId) return null;
        const avatarNum = parseInt(avatarId);
        const avatar = AVATAR_OPTIONS.find(a => a.id === avatarNum);
        return avatar ? avatar.source : null;
    };

    useEffect(() => {
        fetchLeaderboard();
    }, [timeFilter]);

    const fetchLeaderboard = async () => {
        try {
            const response = await api.get(`/xp/leaderboard?period=${timeFilter}`);
            setLeaderboard(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const renderTopThree = () => {
        if (leaderboard.length < 3) return null;

        const [first, second, third] = leaderboard.slice(0, 3);

        return (
            <View style={styles.podiumContainer}>
                {/* Second Place */}
                <View style={styles.podiumItem}>
                    <LinearGradient
                        colors={['#E5E7EB', '#9CA3AF']}
                        style={styles.podiumCard}
                    >
                        <View style={styles.rankBadge}>
                            <MaterialCommunityIcons name="medal" size={24} color="#9CA3AF" />
                            <Text style={styles.rankNumber}>2</Text>
                        </View>
                        <View style={styles.avatarWrapper}>
                            {getAvatarSource(second.avatar) ? (
                                <Image source={getAvatarSource(second.avatar)!} style={styles.podiumAvatar} />
                            ) : (
                                <View style={[styles.avatarPlaceholder, { backgroundColor: '#9CA3AF' }]}>
                                    <Text style={styles.avatarText}>{second.name.charAt(0).toUpperCase()}</Text>
                                </View>
                            )}
                        </View>
                        <Text style={styles.podiumName} numberOfLines={1}>{second.name}</Text>
                        <View style={styles.statsRow}>
                            <MaterialCommunityIcons name="star" size={14} color="#F59E0B" />
                            <Text style={styles.podiumXP}>{second.xp} XP</Text>
                        </View>
                        <Text style={styles.podiumLevel}>Level {second.level}</Text>
                        {second.streak && (
                            <View style={styles.streakBadge}>
                                <MaterialCommunityIcons name="fire" size={12} color="#FF6B6B" />
                                <Text style={styles.streakText}>{second.streak} day streak</Text>
                            </View>
                        )}
                    </LinearGradient>
                </View>

                {/* First Place */}
                <View style={[styles.podiumItem, styles.firstPlace]}>
                    <LinearGradient
                        colors={['#FEF3C7', '#F59E0B']}
                        style={[styles.podiumCard, styles.firstPlaceCard]}
                    >
                        <View style={styles.crownContainer}>
                            <MaterialCommunityIcons name="crown" size={32} color="#F59E0B" />
                        </View>
                        <View style={styles.rankBadge}>
                            <MaterialCommunityIcons name="trophy" size={28} color="#F59E0B" />
                            <Text style={[styles.rankNumber, styles.firstRankNumber]}>1</Text>
                        </View>
                        <View style={styles.avatarWrapper}>
                            {getAvatarSource(first.avatar) ? (
                                <Image source={getAvatarSource(first.avatar)!} style={styles.podiumAvatarLarge} />
                            ) : (
                                <View style={[styles.avatarPlaceholder, styles.avatarPlaceholderLarge, { backgroundColor: '#F59E0B' }]}>
                                    <Text style={[styles.avatarText, styles.avatarTextLarge]}>{first.name.charAt(0).toUpperCase()}</Text>
                                </View>
                            )}
                            <View style={styles.glowRing} />
                        </View>
                        <Text style={[styles.podiumName, styles.firstPlaceName]} numberOfLines={1}>{first.name}</Text>
                        <View style={styles.statsRow}>
                            <MaterialCommunityIcons name="star" size={16} color="#F59E0B" />
                            <Text style={[styles.podiumXP, styles.firstPlaceXP]}>{first.xp} XP</Text>
                        </View>
                        <Text style={[styles.podiumLevel, styles.firstPlaceLevel]}>Level {first.level}</Text>
                        {first.streak && (
                            <View style={[styles.streakBadge, styles.firstStreakBadge]}>
                                <MaterialCommunityIcons name="fire" size={14} color="#FF6B6B" />
                                <Text style={[styles.streakText, styles.firstStreakText]}>{first.streak} day streak</Text>
                            </View>
                        )}
                    </LinearGradient>
                </View>

                {/* Third Place */}
                <View style={styles.podiumItem}>
                    <LinearGradient
                        colors={['#FED7AA', '#B45309']}
                        style={styles.podiumCard}
                    >
                        <View style={styles.rankBadge}>
                            <MaterialCommunityIcons name="medal" size={24} color="#B45309" />
                            <Text style={styles.rankNumber}>3</Text>
                        </View>
                        <View style={styles.avatarWrapper}>
                            {getAvatarSource(third.avatar) ? (
                                <Image source={getAvatarSource(third.avatar)!} style={styles.podiumAvatar} />
                            ) : (
                                <View style={[styles.avatarPlaceholder, { backgroundColor: '#B45309' }]}>
                                    <Text style={styles.avatarText}>{third.name.charAt(0).toUpperCase()}</Text>
                                </View>
                            )}
                        </View>
                        <Text style={styles.podiumName} numberOfLines={1}>{third.name}</Text>
                        <View style={styles.statsRow}>
                            <MaterialCommunityIcons name="star" size={14} color="#F59E0B" />
                            <Text style={styles.podiumXP}>{third.xp} XP</Text>
                        </View>
                        <Text style={styles.podiumLevel}>Level {third.level}</Text>
                        {third.streak && (
                            <View style={styles.streakBadge}>
                                <MaterialCommunityIcons name="fire" size={12} color="#FF6B6B" />
                                <Text style={styles.streakText}>{third.streak} day streak</Text>
                            </View>
                        )}
                    </LinearGradient>
                </View>
            </View>
        );
    };

    const renderItem = ({ item, index }: { item: LeaderboardUser, index: number }) => {
        // Skip top 3 only if we have enough users for the podium
        if (leaderboard.length >= 3 && index < 3) return null;

        const isCurrentUser = item._id === user?._id;
        const rank = index + 1;

        return (
            <CustomCard style={[styles.card, isCurrentUser && styles.currentUserCard]}>
                <View style={styles.rankContainer}>
                    <Text style={styles.rankText}>{rank}</Text>
                </View>

                <View style={styles.userInfo}>
                    <View style={styles.avatarContainer}>
                        {getAvatarSource(item.avatar) ? (
                            <Image source={getAvatarSource(item.avatar)!} style={styles.avatar} />
                        ) : (
                            <View style={[styles.avatarPlaceholder, { backgroundColor: '#6A5AE0' }]}>
                                <Text style={styles.avatarText}>{item.name.charAt(0).toUpperCase()}</Text>
                            </View>
                        )}
                    </View>
                    <View style={styles.userDetails}>
                        <View style={styles.nameRow}>
                            <Text style={[styles.name, isCurrentUser && styles.currentUserName]}>
                                {item.name} {isCurrentUser && '(You)'}
                            </Text>
                            {item.achievements && item.achievements.length > 0 && (
                                <View style={styles.achievementBadge}>
                                    <MaterialCommunityIcons name="trophy-variant" size={12} color="#F59E0B" />
                                    <Text style={styles.achievementCount}>{item.achievements.length}</Text>
                                </View>
                            )}
                        </View>
                        <View style={styles.detailsRow}>
                            <View style={styles.detailItem}>
                                <MaterialCommunityIcons name="school" size={12} color={isDark ? '#94A3B8' : '#6B7280'} />
                                <Text style={styles.detailText}>Level {item.level}</Text>
                            </View>
                            <View style={styles.detailItem}>
                                <MaterialCommunityIcons name="book-open-variant" size={12} color={isDark ? '#94A3B8' : '#6B7280'} />
                                <Text style={styles.detailText}>Class {item.selectedClass}</Text>
                            </View>
                            {item.streak && (
                                <View style={styles.detailItem}>
                                    <MaterialCommunityIcons name="fire" size={12} color="#FF6B6B" />
                                    <Text style={styles.detailText}>{item.streak}d</Text>
                                </View>
                            )}
                        </View>
                    </View>
                </View>

                <View style={styles.xpContainer}>
                    <Text style={styles.xpValue}>{item.xp.toLocaleString()}</Text>
                    <Text style={styles.xpLabel}>XP</Text>
                    {item.weeklyXP && (
                        <View style={styles.weeklyXPBadge}>
                            <MaterialCommunityIcons name="trending-up" size={10} color="#10B981" />
                            <Text style={styles.weeklyXPText}>+{item.weeklyXP}</Text>
                        </View>
                    )}
                </View>
            </CustomCard>
        );
    };

    return (
        <GradientBackground>
            <View style={styles.container}>
                {/* Header */}
                <LinearGradient
                    colors={['#2563EB', '#60A5FA']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.headerBackground}
                >
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
                    </TouchableOpacity>
                    <View style={styles.headerTitleContainer}>
                        <MaterialCommunityIcons name="trophy" size={28} color="#FFD700" />
                        <Text style={styles.headerTitle}>Leaderboard</Text>
                    </View>
                    <LanguageSwitcher />
                </LinearGradient>

                {/* Time Filter */}
                <View style={styles.filterContainer}>
                    <TouchableOpacity
                        style={[styles.filterButton, timeFilter === 'all' && styles.filterButtonActive]}
                        onPress={() => setTimeFilter('all')}
                    >
                        <Text style={styles.filterButtonText}>All Time</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterButton, timeFilter === 'month' && styles.filterButtonActive]}
                        onPress={() => setTimeFilter('month')}
                    >
                        <Text style={styles.filterButtonText}>This Month</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterButton, timeFilter === 'week' && styles.filterButtonActive]}
                        onPress={() => setTimeFilter('week')}
                    >
                        <Text style={styles.filterButtonText}>This Week</Text>
                    </TouchableOpacity>
                </View>

                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#2563EB" />
                        <Text style={styles.loadingText}>Loading rankings...</Text>
                    </View>
                ) : (
                    <FlatList
                        data={leaderboard}
                        renderItem={renderItem}
                        keyExtractor={(item: LeaderboardUser) => item._id}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        ListHeaderComponent={renderTopThree()}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <MaterialCommunityIcons name="trophy-outline" size={64} color={isDark ? '#475569' : '#9CA3AF'} />
                                <Text style={styles.emptyText}>No rankings yet</Text>
                                <Text style={styles.emptySubtext}>Start learning to appear on the leaderboard!</Text>
                            </View>
                        }
                    />
                )}
            </View>
        </GradientBackground>
    );
};

const createStyles = (isDark: boolean) => StyleSheet.create({
    container: {
        flex: 1,
    },
    headerBackground: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 60, // Status bar space
        paddingBottom: 30, // Increased from 20
        paddingHorizontal: 24, // Increased from 20
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
        zIndex: 10, // Ensure it sits above content
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    headerTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#fff',
    },
    filterContainer: {
        flexDirection: 'row',
        gap: 12,
        paddingHorizontal: 24, // Increased from 20
        marginTop: 20, // Added margin top
        marginBottom: 24, // Increased from 20
    },
    filterButton: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 12, // Increased from 10
        borderRadius: 20,
        backgroundColor: isDark ? '#334155' : 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        borderColor: isDark ? '#475569' : 'rgba(255, 255, 255, 0.3)',
        alignItems: 'center',
    },
    filterButtonActive: {
        backgroundColor: '#2563EB',
        borderColor: '#2563EB',
    },
    filterButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
    podiumContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginBottom: 30,
        alignItems: 'flex-end',
        gap: 12,
    },
    podiumItem: {
        flex: 1,
    },
    firstPlace: {
        marginBottom: 20,
    },
    podiumCard: {
        padding: 16,
        borderRadius: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 8,
    },
    firstPlaceCard: {
        padding: 20,
    },
    crownContainer: {
        position: 'absolute',
        top: -20,
    },
    rankBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    rankNumber: {
        fontSize: 18,
        fontWeight: '800',
        color: '#fff',
        marginLeft: 4,
    },
    firstRankNumber: {
        fontSize: 20,
    },
    avatarWrapper: {
        position: 'relative',
        marginBottom: 12,
    },
    podiumAvatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 3,
        borderColor: '#fff',
    },
    podiumAvatarLarge: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 4,
        borderColor: '#fff',
    },
    glowRing: {
        position: 'absolute',
        width: 90,
        height: 90,
        borderRadius: 45,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        top: -5,
        left: -5,
    },
    podiumName: {
        fontSize: 14,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 4,
    },
    firstPlaceName: {
        fontSize: 16,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    podiumXP: {
        fontSize: 12,
        fontWeight: '600',
        color: '#fff',
        marginLeft: 4,
    },
    firstPlaceXP: {
        fontSize: 14,
    },
    podiumLevel: {
        fontSize: 11,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    firstPlaceLevel: {
        fontSize: 12,
    },
    streakBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginTop: 8,
    },
    firstStreakBadge: {
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    streakText: {
        fontSize: 10,
        color: '#fff',
        fontWeight: '600',
        marginLeft: 4,
    },
    firstStreakText: {
        fontSize: 11,
    },
    listContent: {
        paddingBottom: 40, // Increased from 20
        paddingTop: 10, // Added top padding
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        marginHorizontal: 20,
        marginBottom: 12,
        borderRadius: 16,
        backgroundColor: isDark ? '#1E293B' : '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    currentUserCard: {
        borderWidth: 2,
        borderColor: '#2563EB',
    },
    rankContainer: {
        width: 40,
        alignItems: 'center',
        marginRight: 12,
    },
    rankText: {
        fontSize: 18,
        fontWeight: '800',
        color: isDark ? '#60A5FA' : '#2563EB',
    },
    userInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        marginRight: 12,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    avatarPlaceholder: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarPlaceholderLarge: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    avatarText: {
        fontSize: 20,
        fontWeight: '700',
        color: '#fff',
    },
    avatarTextLarge: {
        fontSize: 32,
    },
    userDetails: {
        flex: 1,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    name: {
        fontSize: 16,
        fontWeight: '700',
        color: isDark ? '#F1F5F9' : '#1A1A1A',
        marginRight: 8,
    },
    currentUserName: {
        color: '#2563EB',
    },
    achievementBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: isDark ? '#334155' : '#FEF3C7',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
    },
    achievementCount: {
        fontSize: 10,
        fontWeight: '600',
        color: isDark ? '#FCD34D' : '#F59E0B',
        marginLeft: 2,
    },
    detailsRow: {
        flexDirection: 'row',
        gap: 12,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    detailText: {
        fontSize: 12,
        color: isDark ? '#CBD5E1' : '#6B7280',
        marginLeft: 4,
    },
    xpContainer: {
        alignItems: 'flex-end',
    },
    xpValue: {
        fontSize: 18,
        fontWeight: '800',
        color: isDark ? '#60A5FA' : '#2563EB',
        marginBottom: 2,
    },
    xpLabel: {
        fontSize: 11,
        color: isDark ? '#94A3B8' : '#9CA3AF',
        fontWeight: '600',
    },
    weeklyXPBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#D1FAE5',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
        marginTop: 4,
    },
    weeklyXPText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#10B981',
        marginLeft: 2,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 15,
    },
    loadingText: {
        color: isDark ? '#CBD5E1' : '#6B7280',
        fontSize: 14,
        fontWeight: '600',
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 60,
        gap: 12,
    },
    emptyText: {
        color: isDark ? '#CBD5E1' : '#6B7280',
        fontSize: 18,
        fontWeight: '700',
    },
    emptySubtext: {
        color: isDark ? '#94A3B8' : '#9CA3AF',
        fontSize: 14,
        textAlign: 'center',
    },
});

export default LeaderboardScreen;
