import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text, Surface, Avatar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { spacing, borderRadius, theme } from '../theme';
import api from '../services/api';

interface PendingUserCardProps {
    user: {
        _id: string;
        name: string;
        email: string;
        role: string;
        createdAt: string;
        instituteId?: string;
    };
    onApprove: (userId: string) => void;
    onReject: (userId: string) => void;
}

const PendingUserCard: React.FC<PendingUserCardProps> = ({ user, onApprove, onReject }) => {
    const [loading, setLoading] = useState<'approve' | 'reject' | null>(null);

    const handleAction = async (action: 'approve' | 'reject') => {
        setLoading(action);
        try {
            if (action === 'approve') {
                await api.post(`/approval/approve/${user._id}`);
                onApprove(user._id);
            } else {
                await api.post(`/approval/reject/${user._id}`);
                onReject(user._id);
            }
        } catch (error) {
            console.error(`Failed to ${action} user:`, error);
            // Ideally show toast/snackbar here
        } finally {
            setLoading(null);
        }
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'student': return '#667eea';
            case 'teacher': return '#f093fb';
            case 'institute': return '#4facfe';
            case 'admin': return '#f5576c';
            default: return '#666';
        }
    };

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'student': return 'school';
            case 'teacher': return 'account-tie';
            case 'institute': return 'office-building';
            case 'admin': return 'shield-account';
            default: return 'account';
        }
    };

    return (
        <Surface style={styles.card} elevation={2}>
            <View style={styles.header}>
                <View style={[styles.iconContainer, { backgroundColor: getRoleColor(user.role) + '20' }]}>
                    <MaterialCommunityIcons
                        name={getRoleIcon(user.role) as any}
                        size={24}
                        color={getRoleColor(user.role)}
                    />
                </View>
                <View style={styles.info}>
                    <Text style={styles.name}>{user.name}</Text>
                    <Text style={styles.email}>{user.email}</Text>
                    <View style={styles.roleBadge}>
                        <Text style={[styles.roleText, { color: getRoleColor(user.role) }]}>
                            {user.role.toUpperCase()}
                        </Text>
                    </View>
                </View>
            </View>

            <View style={styles.actions}>
                <TouchableOpacity
                    style={[styles.actionButton, styles.rejectButton]}
                    onPress={() => handleAction('reject')}
                    disabled={loading !== null}
                >
                    {loading === 'reject' ? (
                        <ActivityIndicator color="#f44336" size="small" />
                    ) : (
                        <>
                            <MaterialCommunityIcons name="close" size={20} color="#f44336" />
                            <Text style={styles.rejectText}>Reject</Text>
                        </>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionButton, styles.approveButton]}
                    onPress={() => handleAction('approve')}
                    disabled={loading !== null}
                >
                    {loading === 'approve' ? (
                        <ActivityIndicator color="#fff" size="small" />
                    ) : (
                        <>
                            <MaterialCommunityIcons name="check" size={20} color="#fff" />
                            <Text style={styles.approveText}>Approve</Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </Surface>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        marginBottom: spacing.md,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        gap: spacing.md,
        marginBottom: spacing.md,
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    info: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    email: {
        fontSize: 14,
        color: '#666',
        marginBottom: spacing.xs,
    },
    roleBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: spacing.sm,
        paddingVertical: 2,
        borderRadius: 4,
        backgroundColor: '#f5f5f5',
    },
    roleText: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    actions: {
        flexDirection: 'row',
        gap: spacing.md,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        paddingTop: spacing.md,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.md,
        gap: 4,
    },
    rejectButton: {
        backgroundColor: '#ffebee',
    },
    approveButton: {
        backgroundColor: '#4CAF50',
    },
    rejectText: {
        color: '#f44336',
        fontWeight: '600',
    },
    approveText: {
        color: '#fff',
        fontWeight: '600',
    },
});

export default PendingUserCard;
