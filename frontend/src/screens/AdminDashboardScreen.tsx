import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import PendingUserCard from '../components/PendingUserCard';
import api from '../services/api';
import { spacing, theme } from '../theme';

const AdminDashboardScreen = () => {
    const navigation = useNavigation();
    const { user, logout } = useAuth();
    const [pendingUsers, setPendingUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

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

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#f5f7fa', '#c3cfe2']}
                style={styles.background}
            />

            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#333" />
                    </TouchableOpacity>
                    <View>
                        <Text style={styles.welcomeText}>Admin Dashboard</Text>
                        <Text style={styles.subText}>Manage approvals and system</Text>
                    </View>
                </View>
                <TouchableOpacity onPress={logout}>
                    <Ionicons name="log-out-outline" size={24} color={theme.colors.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView
                contentContainerStyle={styles.content}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Pending Approvals</Text>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{pendingUsers.length}</Text>
                    </View>
                </View>

                {loading ? (
                    <ActivityIndicator style={{ marginTop: 20 }} />
                ) : pendingUsers.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>No pending approvals</Text>
                    </View>
                ) : (
                    pendingUsers.map(user => (
                        <PendingUserCard
                            key={user._id}
                            user={user}
                            onApprove={handleApprove}
                            onReject={handleReject}
                        />
                    ))
                )}
            </ScrollView>
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
        padding: spacing.xl,
        paddingTop: 60,
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    backButton: {
        padding: 4,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    subText: {
        fontSize: 14,
        color: '#666',
    },
    content: {
        padding: spacing.lg,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.md,
        gap: spacing.sm,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    badge: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
    },
    badgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    emptyState: {
        padding: spacing.xl,
        alignItems: 'center',
    },
    emptyText: {
        color: '#999',
        fontSize: 16,
    },
});

export default AdminDashboardScreen;
