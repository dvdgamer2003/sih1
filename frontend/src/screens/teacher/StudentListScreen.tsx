import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity, ActivityIndicator, Alert, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../../services/api';

const StudentListScreen = () => {
    const navigation = useNavigation();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            console.log('🔍 Fetching students...');
            const response = await api.get('/teacher/students');
            console.log('📊 Students response:', response.data);
            console.log('📊 Count:', response.data.length);
            setStudents(response.data);
        } catch (error) {
            console.error('❌ Fetch error:', error);
            Alert.alert('Error', 'Failed to fetch students');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id: string) => {
        Alert.alert(
            'Delete Student',
            'Are you sure you want to delete this student?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await api.delete(`/teacher/student/${id}`);
                            fetchStudents();
                        } catch (error) {
                            Alert.alert('Error', 'Failed to delete student');
                        }
                    },
                },
            ]
        );
    };

    const filteredStudents = students.filter((student: any) =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getLearnerGradient = (category: string): [string, string] => {
        if (category === 'fast') return ['#4F46E5', '#7C3AED'];
        if (category === 'slow') return ['#F59E0B', '#F97316'];
        return ['#6B7280', '#9CA3AF'];
    };

    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <LinearGradient
                    colors={['#6200EA', '#7C4DFF']}
                    style={styles.avatar}
                >
                    <Text style={styles.avatarText}>{item.name.substring(0, 2).toUpperCase()}</Text>
                </LinearGradient>

                <View style={styles.cardInfo}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.email}>{item.email}</Text>
                    <View style={styles.metaRow}>
                        <MaterialCommunityIcons name="school" size={14} color="#666" />
                        <Text style={styles.grade}>Class {item.selectedClass}</Text>
                    </View>
                </View>

                <View style={styles.badgesColumn}>
                    <View style={[
                        styles.statusBadge,
                        { backgroundColor: item.status === 'active' ? '#D1FAE5' : '#FEE2E2' }
                    ]}>
                        <Text style={[
                            styles.statusText,
                            { color: item.status === 'active' ? '#059669' : '#DC2626' }
                        ]}>
                            {item.status?.toUpperCase() || 'ACTIVE'}
                        </Text>
                    </View>

                    {item.learnerCategory && item.learnerCategory !== 'neutral' && (
                        <LinearGradient
                            colors={getLearnerGradient(item.learnerCategory)}
                            style={styles.learnerBadge}
                        >
                            <MaterialCommunityIcons
                                name={item.learnerCategory === 'fast' ? 'lightning-bolt' : 'turtle'}
                                size={12}
                                color="#fff"
                            />
                            <Text style={styles.learnerText}>
                                {item.learnerCategory === 'fast' ? 'Fast' : 'Slow'}
                            </Text>
                        </LinearGradient>
                    )}
                </View>
            </View>

            <View style={styles.actions}>
                <TouchableOpacity
                    style={[styles.actionButton, styles.analyticsButton]}
                    onPress={() => (navigation as any).navigate('StudentAnalytics', {
                        studentId: item._id,
                        studentName: item.name
                    })}
                >
                    <MaterialCommunityIcons name="chart-line" size={18} color="#fff" />
                    <Text style={styles.actionButtonText}>Analytics</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionButton, styles.editButton]}
                    onPress={() => (navigation as any).navigate('EditStudent', { student: item })}
                >
                    <MaterialCommunityIcons name="pencil" size={18} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDelete(item._id)}
                >
                    <MaterialCommunityIcons name="delete" size={18} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Gradient Header */}
            <LinearGradient
                colors={['#6200EA', '#7C4DFF']}
                style={styles.header}
            >
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
                </TouchableOpacity>
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>My Students</Text>
                    <Text style={styles.headerSubtitle}>{students.length} student{students.length !== 1 ? 's' : ''}</Text>
                </View>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => (navigation as any).navigate('CreateStudent')}
                >
                    <MaterialCommunityIcons name="plus" size={24} color="#6200EA" />
                </TouchableOpacity>
            </LinearGradient>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <MaterialCommunityIcons name="magnify" size={20} color="#666" />
                    <TextInput
                        placeholder="Search students..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        style={styles.searchInput}
                    />
                </View>
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#6200EA" />
                </View>
            ) : (
                <FlatList
                    data={filteredStudents}
                    renderItem={renderItem}
                    keyExtractor={(item: any) => item._id}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <LinearGradient
                                colors={['rgba(98, 0, 234, 0.1)', 'rgba(124, 77, 255, 0.1)']}
                                style={styles.emptyIconContainer}
                            >
                                <MaterialCommunityIcons name="account-group-outline" size={64} color="#6200EA" />
                            </LinearGradient>
                            <Text style={styles.emptyText}>No students found</Text>
                            <Text style={styles.emptySubtext}>
                                {searchQuery ? 'Try adjusting your search' : 'Add your first student to get started'}
                            </Text>
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
        backgroundColor: '#F5F5F7',
    },
    header: {
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        elevation: 8,
        shadowColor: '#6200EA',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    backButton: {
        padding: 8,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 12,
    },
    headerContent: {
        flex: 1,
        marginLeft: 16,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    headerSubtitle: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        marginTop: 2,
    },
    addButton: {
        backgroundColor: '#fff',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchContainer: {
        padding: 16,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 14,
        color: '#333',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    list: {
        padding: 16,
        paddingTop: 0,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    avatarText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    cardInfo: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    email: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    grade: {
        fontSize: 12,
        color: '#666',
        fontWeight: '500',
    },
    badgesColumn: {
        gap: 6,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    statusText: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    learnerBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    learnerText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    actions: {
        flexDirection: 'row',
        gap: 8,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        gap: 6,
    },
    analyticsButton: {
        backgroundColor: '#10B981',
        flex: 1,
    },
    editButton: {
        backgroundColor: '#3B82F6',
    },
    deleteButton: {
        backgroundColor: '#EF4444',
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '600',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 60,
        paddingHorizontal: 20,
    },
    emptyIconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    emptyText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
});

export default StudentListScreen;
