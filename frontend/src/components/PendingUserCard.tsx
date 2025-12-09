import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { spacing, borderRadius } from '../theme';
import { useAppTheme } from '../context/ThemeContext';
import api from '../services/api';

interface PendingUserCardProps {
    user: {
        _id: string;
        name: string;
        email: string;
        role: string;
        createdAt: string;
        selectedClass?: number;
        instituteId?: { name: string } | string;
    };
    onApprove: (userId: string) => void;
    onReject: (userId: string) => void;
}

const PendingUserCard: React.FC<PendingUserCardProps> = ({ user, onApprove, onReject }) => {
    const { isDark } = useAppTheme();
    const styles = createStyles(isDark);
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
        } finally {
            setLoading(null);
        }
    };

    const getRoleConfig = (role: string): { color: string; gradient: readonly [string, string]; icon: string; label: string; bgColor: string } => {
        switch (role) {
            case 'student':
                return {
                    color: '#3B82F6',
                    gradient: ['#3B82F6', '#2563EB'] as const,
                    icon: 'school',
                    label: 'Student',
                    bgColor: '#DBEAFE'
                };
            case 'teacher':
                return {
                    color: '#10B981',
                    gradient: ['#10B981', '#059669'] as const,
                    icon: 'human-male-board',
                    label: 'Teacher',
                    bgColor: '#D1FAE5'
                };
            case 'institute':
                return {
                    color: '#8B5CF6',
                    gradient: ['#8B5CF6', '#7C3AED'] as const,
                    icon: 'domain',
                    label: 'Institute',
                    bgColor: '#EDE9FE'
                };
            case 'admin':
                return {
                    color: '#EF4444',
                    gradient: ['#EF4444', '#DC2626'] as const,
                    icon: 'shield-account',
                    label: 'Admin',
                    bgColor: '#FEE2E2'
                };
            default:
                return {
                    color: '#6B7280',
                    gradient: ['#6B7280', '#4B5563'] as const,
                    icon: 'account',
                    label: 'User',
                    bgColor: '#F3F4F6'
                };
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    const roleConfig = getRoleConfig(user.role);
    const instituteName = typeof user.instituteId === 'object' ? user.instituteId?.name : null;

    return (
        <Surface style={styles.card} elevation={2}>
            {/* Top accent line */}
            <LinearGradient
                colors={roleConfig.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.accentLine}
            />

            <View style={styles.content}>
                {/* Header Row */}
                <View style={styles.header}>
                    <LinearGradient
                        colors={roleConfig.gradient}
                        style={styles.avatarContainer}
                    >
                        <Text style={styles.avatarText}>
                            {user.name.charAt(0).toUpperCase()}
                        </Text>
                    </LinearGradient>

                    <View style={styles.info}>
                        <Text style={styles.name} numberOfLines={1}>{user.name}</Text>
                        <Text style={styles.email} numberOfLines={1}>{user.email}</Text>

                        <View style={styles.metaRow}>
                            <View style={[styles.roleBadge, { backgroundColor: isDark ? roleConfig.color + '30' : roleConfig.bgColor }]}>
                                <MaterialCommunityIcons
                                    name={roleConfig.icon as any}
                                    size={12}
                                    color={roleConfig.color}
                                />
                                <Text style={[styles.roleText, { color: roleConfig.color }]}>
                                    {roleConfig.label}
                                </Text>
                            </View>

                            <View style={styles.timeBadge}>
                                <MaterialCommunityIcons name="clock-outline" size={12} color={isDark ? '#94A3B8' : '#999'} />
                                <Text style={styles.timeText}>{formatDate(user.createdAt)}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Additional Info */}
                {(user.selectedClass || instituteName) && (
                    <View style={styles.detailsRow}>
                        {user.selectedClass && (
                            <View style={styles.detailItem}>
                                <MaterialCommunityIcons name="book-open-variant" size={14} color={isDark ? '#94A3B8' : '#666'} />
                                <Text style={styles.detailText}>Class {user.selectedClass}</Text>
                            </View>
                        )}
                        {instituteName && (
                            <View style={styles.detailItem}>
                                <MaterialCommunityIcons name="office-building-marker" size={14} color={isDark ? '#94A3B8' : '#666'} />
                                <Text style={styles.detailText} numberOfLines={1}>{instituteName}</Text>
                            </View>
                        )}
                    </View>
                )}

                {/* Actions */}
                <View style={styles.actions}>
                    <TouchableOpacity
                        style={styles.rejectButton}
                        onPress={() => handleAction('reject')}
                        disabled={loading !== null}
                        activeOpacity={0.7}
                    >
                        {loading === 'reject' ? (
                            <ActivityIndicator color="#EF4444" size="small" />
                        ) : (
                            <>
                                <MaterialCommunityIcons name="close-circle" size={20} color="#EF4444" />
                                <Text style={styles.rejectText}>Reject</Text>
                            </>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.approveButton}
                        onPress={() => handleAction('approve')}
                        disabled={loading !== null}
                        activeOpacity={0.7}
                    >
                        <LinearGradient
                            colors={['#10B981', '#059669']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.approveGradient}
                        >
                            {loading === 'approve' ? (
                                <ActivityIndicator color="#fff" size="small" />
                            ) : (
                                <>
                                    <MaterialCommunityIcons name="check-circle" size={20} color="#fff" />
                                    <Text style={styles.approveText}>Approve</Text>
                                </>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        </Surface>
    );
};

const createStyles = (isDark: boolean) => StyleSheet.create({
    card: {
        borderRadius: 16,
        marginHorizontal: 16,
        marginBottom: 12,
        backgroundColor: isDark ? '#1E293B' : '#fff',
        overflow: 'hidden',
    },
    accentLine: {
        height: 4,
    },
    content: {
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        gap: 14,
    },
    avatarContainer: {
        width: 52,
        height: 52,
        borderRadius: 26,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontSize: 22,
        fontWeight: '700',
        color: '#fff',
    },
    info: {
        flex: 1,
    },
    name: {
        fontSize: 17,
        fontWeight: '700',
        color: isDark ? '#F1F5F9' : '#1A1A1A',
        marginBottom: 2,
    },
    email: {
        fontSize: 13,
        color: isDark ? '#94A3B8' : '#666',
        marginBottom: 8,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flexWrap: 'wrap',
    },
    roleBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    roleText: {
        fontSize: 11,
        fontWeight: '700',
    },
    timeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    timeText: {
        fontSize: 11,
        color: isDark ? '#94A3B8' : '#999',
    },
    detailsRow: {
        flexDirection: 'row',
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: isDark ? '#334155' : '#F0F0F0',
        gap: 16,
        flexWrap: 'wrap',
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    detailText: {
        fontSize: 12,
        color: isDark ? '#94A3B8' : '#666',
    },
    actions: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 16,
    },
    rejectButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: isDark ? '#3F1F1F' : '#FEE2E2',
        gap: 6,
    },
    rejectText: {
        color: '#EF4444',
        fontWeight: '600',
        fontSize: 14,
    },
    approveButton: {
        flex: 1,
        borderRadius: 12,
        overflow: 'hidden',
    },
    approveGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        gap: 6,
    },
    approveText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
});

export default PendingUserCard;
