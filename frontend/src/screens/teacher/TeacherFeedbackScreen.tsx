import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { Text, Surface, Avatar, ActivityIndicator, Chip, FAB } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '../../context/ThemeContext';
import api from '../../services/api';
import { formatDistanceToNow } from 'date-fns';
import FeedbackFormModal from '../../components/FeedbackFormModal';

const TeacherFeedbackScreen = () => {
    const navigation = useNavigation();
    const { isDark } = useAppTheme();
    const [viewMode, setViewMode] = useState<'received' | 'sent'>('received'); // 'received' = from students, 'sent' = my feedback
    const [feedback, setFeedback] = useState<any[]>([]); // Student feedback
    const [myFeedback, setMyFeedback] = useState<any[]>([]); // My feedback
    const [stats, setStats] = useState<any>({ totalFeedback: 0, avgRating: 0, pending: 0 });
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, pending, low_rating
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (viewMode === 'received') {
            fetchTeacherFeedback();
        } else {
            fetchMyFeedback();
        }
    }, [viewMode]);

    const fetchTeacherFeedback = async () => {
        setLoading(true);
        try {
            const response = await api.get('/feedback/teacher');
            setFeedback(response.data.feedback);
            setStats(response.data.stats);
        } catch (error) {
            console.error('Error fetching teacher feedback:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMyFeedback = async () => {
        setLoading(true);
        try {
            const response = await api.get('/feedback/user'); // Reusing existing user feedback endpoint
            setMyFeedback(response.data.feedback);
        } catch (error) {
            console.error('Error fetching my feedback:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFeedbackSuccess = () => {
        if (viewMode === 'sent') {
            fetchMyFeedback();
        } else {
            // If currently viewing received, but submitted feedback, maybe switch to sent?
            // Or just stay.
            setViewMode('sent'); // Switch to show the new feedback
        }
    };

    const getFilteredFeedback = () => {
        if (viewMode === 'sent') return myFeedback;

        if (filter === 'pending') {
            return feedback.filter(f => f.status === 'pending');
        } else if (filter === 'low_rating') {
            return feedback.filter(f => f.rating <= 3);
        }
        return feedback;
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'bug': return '#EF4444';
            case 'suggestion': return '#F59E0B';
            case 'praise': return '#EC4899';
            case 'complaint': return '#F97316';
            default: return '#6B7280';
        }
    };

    const renderFeedbackItem = ({ item }: any) => (
        <Surface style={[styles.card, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }]} elevation={2}>
            <View style={styles.cardHeader}>
                <View style={styles.userInfo}>
                    {item.userId?.avatar ? (
                        <Avatar.Image size={32} source={typeof item.userId.avatar === 'string' ? { uri: item.userId.avatar } : item.userId.avatar} />
                    ) : (
                        <Avatar.Text size={32} label={item.userId?.name?.substring(0, 2) || 'S'} />
                    )}
                    <View style={{ marginLeft: 8 }}>
                        <Text style={[styles.userName, { color: isDark ? '#FFF' : '#0F172A' }]}>{item.userId?.name || 'User'}</Text>
                        <Text style={[styles.userEmail, { color: isDark ? '#94A3B8' : '#64748B' }]}>{item.userId?.email}</Text>
                    </View>
                </View>
                <Text style={[styles.date, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                    {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                </Text>
            </View>

            <View style={styles.ratingRow}>
                <View style={styles.ratingContainer}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <MaterialCommunityIcons
                            key={star}
                            name={item.rating >= star ? "star" : "star-outline"}
                            size={16}
                            color={item.rating >= star ? "#FFD700" : "#E2E8F0"}
                        />
                    ))}
                </View>
                <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(item.category) + '20' }]}>
                    <Text style={[styles.categoryText, { color: getCategoryColor(item.category) }]}>
                        {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                    </Text>
                </View>
            </View>

            <Text style={[styles.comment, { color: isDark ? '#E2E8F0' : '#334155' }]}>
                {item.comment}
            </Text>

            {item.targetName && (
                <Text style={[styles.targetText, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                    Re: {item.targetName} ({item.targetType})
                </Text>
            )}

            {/* Show status for sent feedback */}
            {viewMode === 'sent' && (
                <View style={[styles.statusBadge, {
                    backgroundColor: item.status === 'resolved' ? '#10B98120' : item.status === 'reviewed' ? '#3B82F620' : '#F59E0B20'
                }]}>
                    <MaterialCommunityIcons
                        name={item.status === 'resolved' ? 'check-circle' : item.status === 'reviewed' ? 'eye' : 'clock-outline'}
                        size={14}
                        color={item.status === 'resolved' ? '#10B981' : item.status === 'reviewed' ? '#3B82F6' : '#F59E0B'}
                    />
                    <Text style={[styles.statusText, {
                        color: item.status === 'resolved' ? '#10B981' : item.status === 'reviewed' ? '#3B82F6' : '#F59E0B'
                    }]}>
                        {item.status.toUpperCase()}
                    </Text>
                </View>
            )}
        </Surface>
    );

    const StatCard = ({ title, value, icon, color }: any) => (
        <Surface style={[styles.statCard, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }]} elevation={2}>
            <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
                <MaterialCommunityIcons name={icon} size={24} color={color} />
            </View>
            <View>
                <Text style={[styles.statValue, { color: isDark ? '#FFF' : '#0F172A' }]}>{value}</Text>
                <Text style={[styles.statTitle, { color: isDark ? '#94A3B8' : '#64748B' }]}>{title}</Text>
            </View>
        </Surface>
    );

    return (
        <View style={[styles.container, { backgroundColor: isDark ? '#0F172A' : '#F8FAFC' }]}>
            <LinearGradient
                colors={['#10B981', '#059669']}
                style={styles.header}
            >
                <View style={styles.headerContent}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <MaterialCommunityIcons name="arrow-left" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <Text variant="headlineMedium" style={styles.headerTitle}>Feedback</Text>
                </View>

                {/* Tabs */}
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[styles.tab, viewMode === 'received' && styles.activeTab]}
                        onPress={() => setViewMode('received')}
                    >
                        <Text style={[styles.tabText, viewMode === 'received' && styles.activeTabText]}>Student Feedback</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, viewMode === 'sent' && styles.activeTab]}
                        onPress={() => setViewMode('sent')}
                    >
                        <Text style={[styles.tabText, viewMode === 'sent' && styles.activeTabText]}>My Feedback</Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>

            <View style={styles.content}>
                {viewMode === 'received' && (
                    <View style={styles.statsContainer}>
                        <StatCard
                            title="Total Feedback"
                            value={stats.totalFeedback}
                            icon="message-text-outline"
                            color="#3B82F6"
                        />
                        <StatCard
                            title="Avg Rating"
                            value={stats.avgRating ? stats.avgRating.toFixed(1) : '0.0'}
                            icon="star-outline"
                            color="#F59E0B"
                        />
                        <StatCard
                            title="Pending"
                            value={stats.pending}
                            icon="clock-outline"
                            color="#EC4899"
                        />
                    </View>
                )}

                {viewMode === 'received' && (
                    <View style={styles.filterContainer}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <Chip
                                selected={filter === 'all'}
                                onPress={() => setFilter('all')}
                                style={styles.chip}
                                showSelectedOverlay
                            >
                                All
                            </Chip>
                            <Chip
                                selected={filter === 'pending'}
                                onPress={() => setFilter('pending')}
                                style={styles.chip}
                                showSelectedOverlay
                            >
                                Pending
                            </Chip>
                            <Chip
                                selected={filter === 'low_rating'}
                                onPress={() => setFilter('low_rating')}
                                style={styles.chip}
                                showSelectedOverlay
                            >
                                Low Rating
                            </Chip>
                        </ScrollView>
                    </View>
                )}

                {loading ? (
                    <ActivityIndicator style={{ marginTop: 40 }} />
                ) : (
                    <FlatList
                        data={getFilteredFeedback()}
                        renderItem={renderFeedbackItem}
                        keyExtractor={(item) => item._id}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <MaterialCommunityIcons name="comment-check-outline" size={64} color="#CBD5E1" />
                                <Text style={styles.emptyText}>
                                    {viewMode === 'received' ? 'No student feedback found' : 'You haven\'t submitted any feedback yet'}
                                </Text>
                            </View>
                        }
                    />
                )}
            </View>

            <FAB
                icon="plus"
                label="Give Feedback"
                style={[styles.fab, { backgroundColor: '#10B981' }]}
                onPress={() => setShowModal(true)}
                color="#FFF"
            />

            <FeedbackFormModal
                visible={showModal}
                onClose={() => setShowModal(false)}
                initialTargetType="app"
                onSuccess={handleFeedbackSuccess}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    backButton: {
        marginRight: 15,
        padding: 5,
    },
    headerTitle: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 12,
        padding: 4,
    },
    tab: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 10,
    },
    activeTab: {
        backgroundColor: '#FFF',
    },
    tabText: {
        color: '#FFF',
        fontWeight: '600',
    },
    activeTabText: {
        color: '#10B981',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        marginTop: 20,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    statCard: {
        width: '31%',
        padding: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    statIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    statTitle: {
        fontSize: 11,
    },
    filterContainer: {
        marginBottom: 16,
    },
    chip: {
        marginRight: 8,
    },
    listContent: {
        paddingBottom: 80, // Space for FAB
    },
    card: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    userName: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    userEmail: {
        fontSize: 12,
    },
    date: {
        fontSize: 11,
    },
    ratingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    ratingContainer: {
        flexDirection: 'row',
        gap: 2,
    },
    categoryBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
    },
    categoryText: {
        fontSize: 11,
        fontWeight: '600',
    },
    comment: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 8,
    },
    targetText: {
        fontSize: 12,
        fontStyle: 'italic',
        marginTop: 8,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        marginTop: 8,
        gap: 4
    },
    statusText: {
        fontSize: 11,
        fontWeight: 'bold',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 60,
    },
    emptyText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#94A3B8',
        marginTop: 16,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
});

export default TeacherFeedbackScreen;
