import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, RefreshControl, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import GradientBackground from '../components/ui/GradientBackground';
import CustomCard from '../components/ui/CustomCard';
import { useAuth } from '../context/AuthContext';
import { useSync } from '../context/SyncContext';
import api from '../services/api';

const StudentOnlineAssignmentsScreen = () => {
    const navigation = useNavigation();
    const { isOffline } = useSync();
    const [assignments, setAssignments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        if (!isOffline) {
            fetchAssignments();
        }
    }, [isOffline]);

    const fetchAssignments = async () => {
        setLoading(true);
        try {
            const response = await api.get('/student/tasks');
            setAssignments(response.data);
        } catch (error) {
            console.error('Failed to fetch assignments', error);
            Alert.alert('Error', 'Failed to load assignments');
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        if (!isOffline) {
            await fetchAssignments();
        }
        setRefreshing(false);
    };

    if (isOffline) {
        return (
            <GradientBackground>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={24} color="#fff" />
                        </TouchableOpacity>
                        <Text style={styles.title}>Classroom</Text>
                        <View style={{ width: 40 }} />
                    </View>
                    <View style={styles.offlineContainer}>
                        <MaterialCommunityIcons name="wifi-off" size={80} color="rgba(255,255,255,0.5)" />
                        <Text style={styles.offlineTitle}>You are Offline</Text>
                        <Text style={styles.offlineText}>
                            This feature requires an active internet connection to view your teacher-assigned syllabus and quizzes.
                        </Text>
                        <TouchableOpacity style={styles.retryButton} onPress={fetchAssignments}>
                            <Text style={styles.retryButtonText}>Retry Connection</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </GradientBackground>
        );
    }

    return (
        <GradientBackground>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Classroom</Text>
                    <View style={{ width: 40 }} />
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color="#fff" style={{ marginTop: 40 }} />
                ) : (
                    <ScrollView
                        contentContainerStyle={styles.list}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />
                        }
                    >
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Assigned Syllabus & Quizzes</Text>
                        </View>

                        {assignments.length > 0 ? (
                            assignments.map((item, index) => (
                                <CustomCard key={index} style={styles.card}>
                                    <View style={styles.cardHeader}>
                                        <View style={[styles.iconContainer, {
                                            backgroundColor: item.type === 'quiz' ? '#FCE7F3' : item.type === 'teacherChapter' ? '#D1FAE5' : '#E0E7FF'
                                        }]}>
                                            <MaterialCommunityIcons
                                                name={item.type === 'quiz' ? 'clipboard-text-outline' : item.type === 'teacherChapter' ? 'book-open-page-variant' : 'book-open-variant'}
                                                size={24}
                                                color={item.type === 'quiz' ? '#EC4899' : item.type === 'teacherChapter' ? '#059669' : '#4F46E5'}
                                            />
                                        </View>
                                        <View style={styles.cardContent}>
                                            <Text style={styles.cardTitle}>{item.chapterName || item.title}</Text>
                                            <Text style={styles.cardSubtitle}>
                                                {item.subject} • Assigned: {new Date(item.assignedAt).toLocaleDateString()}
                                            </Text>
                                        </View>
                                        <View style={[styles.statusBadge, { backgroundColor: item.status === 'completed' ? '#D1FAE5' : '#FEF3C7' }]}>
                                            <Text style={[styles.statusText, { color: item.status === 'completed' ? '#059669' : '#D97706' }]}>
                                                {item.status === 'completed' ? 'Done' : 'Pending'}
                                            </Text>
                                        </View>
                                    </View>

                                    <TouchableOpacity
                                        style={styles.actionButton}
                                        onPress={() => {
                                            if (item.type === 'quiz') {
                                                // Navigate to quiz
                                                (navigation as any).navigate('Quiz', { quizData: item });
                                            } else if (item.type === 'teacherChapter') {
                                                // Navigate to custom chapter viewer
                                                (navigation as any).navigate('TeacherChapterViewer', { chapter: item });
                                            } else {
                                                // Navigate to chapter
                                                (navigation as any).navigate('Learn', {
                                                    screen: 'ChapterList',
                                                    params: { subject: item.subject }
                                                });
                                            }
                                        }}
                                    >
                                        <Text style={styles.actionButtonText}>
                                            {item.type === 'quiz' ? 'Start Quiz' : item.type === 'teacherChapter' ? 'Read Chapter' : 'View Chapter'}
                                        </Text>
                                        <Ionicons name="arrow-forward" size={16} color="#fff" />
                                    </TouchableOpacity>
                                </CustomCard>
                            ))
                        ) : (
                            <View style={styles.emptyState}>
                                <MaterialCommunityIcons name="notebook-check-outline" size={60} color="rgba(255,255,255,0.5)" />
                                <Text style={styles.emptyText}>No assignments yet!</Text>
                                <Text style={styles.emptySubtext}>Check back later for new syllabus and quizzes.</Text>
                            </View>
                        )}
                    </ScrollView>
                )}
            </View>
        </GradientBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 60,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    backButton: {
        padding: 8,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 12,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    offlineContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    offlineTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 20,
        marginBottom: 10,
    },
    offlineText: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 24,
    },
    retryButton: {
        backgroundColor: '#fff',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 25,
    },
    retryButtonText: {
        color: '#4F46E5',
        fontWeight: 'bold',
        fontSize: 16,
    },
    list: {
        paddingBottom: 20,
    },
    sectionHeader: {
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
        opacity: 0.9,
    },
    card: {
        marginBottom: 15,
        padding: 15,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 4,
    },
    cardSubtitle: {
        fontSize: 12,
        color: '#6B7280',
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    statusText: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    actionButton: {
        backgroundColor: '#4F46E5',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
        gap: 8,
    },
    actionButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
    emptyState: {
        alignItems: 'center',
        marginTop: 60,
    },
    emptyText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
    },
    emptySubtext: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 14,
        marginTop: 5,
    },
});

export default StudentOnlineAssignmentsScreen;
