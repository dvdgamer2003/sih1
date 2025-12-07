import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { Text, Surface, IconButton, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../services/api';
import { spacing, borderRadius, theme } from '../theme';
import { formatDistanceToNow } from 'date-fns';

const NotificationScreen = () => {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchNotifications = async () => {
        try {
            const response = await api.get('/notifications');
            setNotifications(response.data.notifications);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchNotifications();
    };

    const markAsRead = async (id: string) => {
        try {
            await api.put(`/notifications/${id}/read`);
            setNotifications(prev =>
                prev.map(n => n._id === id ? { ...n, isRead: true } : n)
            );
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.put('/notifications/read-all');
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'assignment': return 'book-open-variant';
            case 'approval': return 'check-decagram';
            case 'reminder': return 'clock-outline';
            default: return 'bell-outline';
        }
    };

    const getColor = (type: string) => {
        switch (type) {
            case 'assignment': return '#4facfe';
            case 'approval': return '#4CAF50';
            case 'reminder': return '#FF9800';
            default: return '#666';
        }
    };

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            onPress={() => !item.isRead && markAsRead(item._id)}
            activeOpacity={0.8}
        >
            <Surface style={[styles.card, !item.isRead && styles.unreadCard]} elevation={1}>
                <View style={[styles.iconContainer, { backgroundColor: getColor(item.type) + '20' }]}>
                    <MaterialCommunityIcons
                        name={getIcon(item.type) as any}
                        size={24}
                        color={getColor(item.type)}
                    />
                </View>
                <View style={styles.content}>
                    <Text style={[styles.title, !item.isRead && styles.unreadText]}>{item.title}</Text>
                    <Text style={styles.message} numberOfLines={2}>{item.message}</Text>
                    <Text style={styles.time}>
                        {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                    </Text>
                </View>
                {!item.isRead && (
                    <View style={styles.dot} />
                )}
            </Surface>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#f5f7fa', '#c3cfe2']}
                style={styles.background}
            />

            <View style={styles.header}>
                <Text style={styles.headerTitle}>Notifications</Text>
                <IconButton
                    icon="check-all"
                    iconColor={theme.colors.primary}
                    onPress={markAllAsRead}
                    disabled={notifications.every(n => n.isRead)}
                />
            </View>

            {loading ? (
                <ActivityIndicator style={{ marginTop: 20 }} />
            ) : (
                <FlatList
                    data={notifications}
                    renderItem={renderItem}
                    keyExtractor={item => item._id}
                    contentContainerStyle={styles.listContent}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <MaterialCommunityIcons name="bell-sleep-outline" size={60} color="#ccc" />
                            <Text style={styles.emptyText}>No notifications yet</Text>
                        </View>
                    }
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingTop: 60,
        paddingBottom: spacing.md,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    listContent: {
        padding: spacing.md,
    },
    card: {
        flexDirection: 'row',
        padding: spacing.md,
        marginBottom: spacing.sm,
        borderRadius: borderRadius.lg,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    unreadCard: {
        backgroundColor: '#f0f7ff',
        borderLeftWidth: 4,
        borderLeftColor: theme.colors.primary,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    content: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 2,
    },
    unreadText: {
        fontWeight: 'bold',
        color: '#000',
    },
    message: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    time: {
        fontSize: 12,
        color: '#999',
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: theme.colors.primary,
        marginLeft: spacing.sm,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 100,
    },
    emptyText: {
        marginTop: spacing.md,
        color: '#999',
        fontSize: 16,
    },
});

export default NotificationScreen;
