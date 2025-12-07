import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import GradientBackground from '../components/ui/GradientBackground';
import CustomCard from '../components/ui/CustomCard';
import { useAuth } from '../context/AuthContext';
import { useSync } from '../context/SyncContext';
import api from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TASKS_CACHE_KEY = 'student_tasks_cache';

const StudentTasksScreen = () => {
    const navigation = useNavigation();
    const { user } = useAuth();
    const { isOffline } = useSync();
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadTasks();
    }, [isOffline]);

    const loadTasks = async () => {
        setLoading(true);
        if (isOffline) {
            await loadFromCache();
        } else {
            await fetchTasks();
        }
        setLoading(false);
    };

    const loadFromCache = async () => {
        try {
            const cached = await AsyncStorage.getItem(TASKS_CACHE_KEY);
            if (cached) {
                setTasks(JSON.parse(cached));
            }
        } catch (error) {
            console.error('Failed to load tasks from cache', error);
        }
    };

    const fetchTasks = async () => {
        try {
            const response = await api.get('/student/tasks');
            setTasks(response.data);
            // Cache the tasks
            await AsyncStorage.setItem(TASKS_CACHE_KEY, JSON.stringify(response.data));
        } catch (error) {
            console.error('Failed to fetch tasks', error);
            // Fallback to cache if fetch fails
            await loadFromCache();
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        if (!isOffline) {
            await fetchTasks();
        }
        setRefreshing(false);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return '#10B981';
            case 'pending': return '#F59E0B';
            default: return '#6B7280';
        }
    };

    const renderTaskItem = (task: any, index: number) => (
        <CustomCard key={index} style={styles.taskCard}>
            <View style={styles.taskHeader}>
                <View style={styles.taskIcon}>
                    <Ionicons name="book" size={24} color="#4F46E5" />
                </View>
                <View style={styles.taskInfo}>
                    <Text style={styles.taskTitle}>Chapter: {task.chapterName}</Text>
                    <Text style={styles.taskDate}>Assigned: {new Date(task.assignedAt).toLocaleDateString()}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(task.status) + '20' }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(task.status) }]}>
                        {task.status.toUpperCase()}
                    </Text>
                </View>
            </View>

            {task.status === 'pending' && (
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => {
                        // Navigate to the chapter content
                        // Assuming we have a way to navigate to a specific chapter
                        // For now, just go to Learn tab
                        (navigation as any).navigate('Learn', {
                            screen: 'ChapterList',
                            params: { subject: task.subject } // You might need to adjust this based on your data structure
                        });
                    }}
                >
                    <Text style={styles.actionButtonText}>Start Learning</Text>
                    <Ionicons name="arrow-forward" size={16} color="#fff" />
                </TouchableOpacity>
            )}
        </CustomCard>
    );

    return (
        <GradientBackground>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>My Tasks</Text>
                    {isOffline && (
                        <View style={styles.offlineBadge}>
                            <Ionicons name="cloud-offline" size={16} color="#fff" />
                            <Text style={styles.offlineText}>Offline Mode</Text>
                        </View>
                    )}
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
                        {tasks.length > 0 ? (
                            tasks.map((task, index) => renderTaskItem(task, index))
                        ) : (
                            <View style={styles.emptyState}>
                                <Ionicons name="checkmark-circle-outline" size={60} color="rgba(255,255,255,0.5)" />
                                <Text style={styles.emptyText}>No pending tasks!</Text>
                                <Text style={styles.emptySubtext}>Great job staying on top of your work.</Text>
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
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
    },
    offlineBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(239, 68, 68, 0.8)', // Red for offline
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
        gap: 5,
    },
    offlineText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    list: {
        paddingBottom: 100, // Space for tab bar
    },
    taskCard: {
        marginBottom: 15,
        padding: 15,
    },
    taskHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    taskIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#E0E7FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    taskInfo: {
        flex: 1,
    },
    taskTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    taskDate: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 2,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
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
        padding: 10,
        borderRadius: 10,
        gap: 5,
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

export default StudentTasksScreen;
