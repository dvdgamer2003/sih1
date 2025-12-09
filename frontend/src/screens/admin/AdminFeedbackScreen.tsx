import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Text, Surface, Avatar, ActivityIndicator, Chip, Button, TextInput, Menu, Dialog, Provider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import GradientBackground from '../../components/ui/GradientBackground';
import api from '../../services/api';
import { formatDistanceToNow } from 'date-fns';

const AdminFeedbackScreen = () => {
    const navigation = useNavigation();
    const [feedback, setFeedback] = useState<any[]>([]);
    const [stats, setStats] = useState<any>({ total: 0, pending: 0, reviewed: 0, resolved: 0 });
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('pending');
    const [selectedFeedback, setSelectedFeedback] = useState<any>(null);
    const [notes, setNotes] = useState('');
    const [visible, setVisible] = useState(false);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchFeedback();
    }, [statusFilter]);

    const fetchFeedback = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/feedback/admin?status=${statusFilter === 'all' ? '' : statusFilter}`);
            setFeedback(response.data.feedback);
            setStats(response.data.stats);
        } catch (error) {
            console.error('Error fetching admin feedback:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (status: string) => {
        if (!selectedFeedback) return;
        setUpdating(true);
        try {
            await api.patch(`/feedback/${selectedFeedback._id}/status`, {
                status,
                adminNotes: notes
            });
            setVisible(false);
            setNotes('');
            setSelectedFeedback(null);
            fetchFeedback(); // Refresh list
        } catch (error) {
            console.error('Error updating feedback:', error);
            Alert.alert('Error', 'Failed to update feedback status');
        } finally {
            setUpdating(false);
        }
    };

    const handleDelete = (id: string) => {
        Alert.alert(
            'Delete Feedback',
            'Are you sure you want to delete this feedback?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await api.delete(`/feedback/${id}`);
                            fetchFeedback();
                        } catch (error) {
                            console.error('Error deleting feedback:', error);
                            Alert.alert('Error', 'Failed to delete feedback');
                        }
                    }
                }
            ]
        );
    };

    const openActionDialog = (item: any) => {
        setSelectedFeedback(item);
        setNotes(item.adminNotes || '');
        setVisible(true);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'resolved': return '#10B981';
            case 'reviewed': return '#3B82F6';
            case 'pending': return '#F59E0B';
            default: return '#9CA3AF';
        }
    };

    const renderFeedbackItem = ({ item }: any) => (
        <Surface style={styles.card} elevation={2}>
            <View style={styles.cardHeader}>
                <View style={styles.userInfo}>
                    {item.userId?.avatar ? (
                        <Avatar.Image size={32} source={typeof item.userId.avatar === 'string' ? { uri: item.userId.avatar } : item.userId.avatar} />
                    ) : (
                        <Avatar.Text size={32} label={item.userId?.name?.substring(0, 2) || 'U'} />
                    )}
                    <View style={{ marginLeft: 8 }}>
                        <Text style={styles.userName}>{item.userId?.name || 'Unknown User'}</Text>
                        <Text style={styles.userRole}>{item.userId?.role || 'user'}</Text>
                    </View>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                        {item.status.toUpperCase()}
                    </Text>
                </View>
            </View>

            <Text style={styles.categoryInfo}>
                {item.category.toUpperCase()} • {item.targetType} {item.targetName ? `(${item.targetName})` : ''}
            </Text>

            <View style={styles.ratingContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <MaterialCommunityIcons
                        key={star}
                        name={item.rating >= star ? "star" : "star-outline"}
                        size={16}
                        color={item.rating >= star ? "#FFD700" : "#E2E8F0"}
                    />
                ))}
                <Text style={styles.dateText}>
                    {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                </Text>
            </View>

            <Text style={styles.comment}>
                {item.comment}
            </Text>

            {item.adminNotes && (
                <View style={styles.adminNotesContainer}>
                    <Text style={styles.adminNotesLabel}>Admin Notes:</Text>
                    <Text style={styles.adminNotesText}>{item.adminNotes}</Text>
                </View>
            )}

            <View style={styles.actionRow}>
                <Button
                    mode="outlined"
                    compact
                    onPress={() => openActionDialog(item)}
                    style={styles.actionBtn}
                >
                    Update Status
                </Button>
                <Button
                    mode="text"
                    compact
                    textColor="#EF4444"
                    onPress={() => handleDelete(item._id)}
                >
                    Delete
                </Button>
            </View>
        </Surface>
    );

    return (
        <Provider>
            <GradientBackground>
                <ScrollView contentContainerStyle={styles.container}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                            <MaterialCommunityIcons name="arrow-left" size={24} color="#FFF" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Feedback Manager</Text>
                    </View>

                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{stats.pending}</Text>
                            <Text style={styles.statLabel}>Pending</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{stats.reviewed}</Text>
                            <Text style={styles.statLabel}>Reviewed</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{stats.resolved}</Text>
                            <Text style={styles.statLabel}>Resolved</Text>
                        </View>
                    </View>

                    <View style={styles.filterContainer}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {['pending', 'reviewed', 'resolved', 'all'].map((filter) => (
                                <Chip
                                    key={filter}
                                    selected={statusFilter === filter}
                                    onPress={() => setStatusFilter(filter)}
                                    style={styles.filterChip}
                                    textStyle={{ color: statusFilter === filter ? '#FFF' : '#333' }}
                                    selectedColor="#FFF"
                                >
                                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                                </Chip>
                            ))}
                        </ScrollView>
                    </View>

                    {loading ? (
                        <ActivityIndicator style={{ marginTop: 40 }} color="#FFF" />
                    ) : (
                        <FlatList
                            data={feedback}
                            renderItem={renderFeedbackItem}
                            keyExtractor={(item) => item._id}
                            contentContainerStyle={styles.listContent}
                            scrollEnabled={false} // Since we are inside ScrollView
                            ListEmptyComponent={
                                <View style={styles.emptyContainer}>
                                    <Text style={styles.emptyText}>No feedback found</Text>
                                </View>
                            }
                        />
                    )}
                </ScrollView>

                <Dialog visible={visible} onDismiss={() => setVisible(false)} style={styles.dialog}>
                    <Dialog.Title>Update Status</Dialog.Title>
                    <Dialog.Content>
                        <TextInput
                            label="Admin Notes"
                            value={notes}
                            onChangeText={setNotes}
                            multiline
                            numberOfLines={3}
                            style={styles.dialogInput}
                        />
                        <View style={styles.statusActions}>
                            <Button
                                mode={selectedFeedback?.status === 'pending' ? 'contained' : 'outlined'}
                                onPress={() => handleUpdateStatus('pending')}
                                style={styles.statusBtn}
                                buttonColor={selectedFeedback?.status === 'pending' ? '#F59E0B' : undefined}
                            >Pending</Button>
                            <Button
                                mode={selectedFeedback?.status === 'reviewed' ? 'contained' : 'outlined'}
                                onPress={() => handleUpdateStatus('reviewed')}
                                style={styles.statusBtn}
                                buttonColor={selectedFeedback?.status === 'reviewed' ? '#3B82F6' : undefined}
                            >Reviewed</Button>
                            <Button
                                mode={selectedFeedback?.status === 'resolved' ? 'contained' : 'outlined'}
                                onPress={() => handleUpdateStatus('resolved')}
                                style={styles.statusBtn}
                                buttonColor={selectedFeedback?.status === 'resolved' ? '#10B981' : undefined}
                            >Resolved</Button>
                        </View>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setVisible(false)}>Cancel</Button>
                    </Dialog.Actions>
                </Dialog>
            </GradientBackground>
        </Provider>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    backButton: {
        marginRight: 15,
        padding: 5,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 12,
        padding: 15,
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF',
    },
    statLabel: {
        fontSize: 12,
        color: '#E5E7EB',
    },
    filterContainer: {
        marginBottom: 20,
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 8,
    },
    filterChip: {
        marginRight: 8,
    },
    listContent: {
        paddingBottom: 20,
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    userName: {
        fontWeight: 'bold',
        fontSize: 14,
        color: '#1F2937',
    },
    userRole: {
        fontSize: 11,
        color: '#6B7280',
        textTransform: 'capitalize',
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
    },
    statusText: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    categoryInfo: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 8,
        fontWeight: '500',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 2,
    },
    dateText: {
        fontSize: 11,
        color: '#9CA3AF',
        marginLeft: 8,
    },
    comment: {
        fontSize: 14,
        color: '#374151',
        marginBottom: 12,
        lineHeight: 20,
    },
    adminNotesContainer: {
        backgroundColor: '#F3F4F6',
        padding: 10,
        borderRadius: 8,
        marginBottom: 12,
    },
    adminNotesLabel: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#4B5563',
        marginBottom: 2,
    },
    adminNotesText: {
        fontSize: 13,
        color: '#4B5563',
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        paddingTop: 8,
    },
    actionBtn: {
        marginRight: 8,
    },
    emptyContainer: {
        alignItems: 'center',
        padding: 40,
    },
    emptyText: {
        color: '#FFF',
        fontSize: 16,
    },
    dialog: {
        borderRadius: 12,
        backgroundColor: '#FFF',
    },
    dialogInput: {
        backgroundColor: '#F9FAFB',
        marginBottom: 16,
    },
    statusActions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    statusBtn: {
        flex: 1,
        minWidth: '30%',
    }
});

export default AdminFeedbackScreen;
