import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { Text, Surface, Avatar, Searchbar, Chip, ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import GradientBackground from '../../components/ui/GradientBackground';
import api from '../../services/api';

const TeacherAnalyticsScreen = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const [students, setStudents] = useState<any[]>([]);
    const [filteredStudents, setFilteredStudents] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [classFilter, setClassFilter] = useState('all');

    useEffect(() => {
        fetchAnalytics();
    }, [classFilter]);

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/analytics/class/${classFilter}`);
            setStudents(response.data);
            setFilteredStudents(response.data);
        } catch (error) {
            console.error('Failed to fetch class analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const onChangeSearch = (query: string) => {
        setSearchQuery(query);
        if (query) {
            const filtered = students.filter(student =>
                student.name.toLowerCase().includes(query.toLowerCase()) ||
                student.email.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredStudents(filtered);
        } else {
            setFilteredStudents(students);
        }
    };

    const renderStudentItem = ({ item }: { item: any }) => (
        <Surface style={styles.studentCard} elevation={1}>
            <View style={styles.studentHeader}>
                <Avatar.Text size={40} label={item.name.substring(0, 2).toUpperCase()} style={{ backgroundColor: '#6366F1' }} />
                <View style={styles.studentInfo}>
                    <Text style={styles.studentName}>{item.name}</Text>
                    <Text style={styles.studentEmail}>{item.email}</Text>
                </View>
                <View style={styles.xpBadge}>
                    <MaterialCommunityIcons name="trophy" size={16} color="#FFD700" />
                    <Text style={styles.xpText}>{item.xp} XP</Text>
                </View>
            </View>

            <View style={styles.statsRow}>
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>{item.completedTasks}</Text>
                    <Text style={styles.statLabel}>Completed</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: '#F59E0B' }]}>{item.pendingTasks}</Text>
                    <Text style={styles.statLabel}>Pending</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: '#EF4444' }]}>{item.streak}</Text>
                    <Text style={styles.statLabel}>Streak</Text>
                </View>
            </View>

            <TouchableOpacity
                style={styles.viewDetailsBtn}
                onPress={() => (navigation as any).navigate('StudentAnalytics', { studentId: item.id })}
            >
                <Text style={styles.viewDetailsText}>View Full Analytics</Text>
                <Ionicons name="arrow-forward" size={16} color="#6366F1" />
            </TouchableOpacity>
        </Surface>
    );

    return (
        <GradientBackground>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Class Analytics</Text>
                    <View style={{ width: 40 }} />
                </View>

                <View style={styles.filterContainer}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.classFilters}>
                        <Chip
                            selected={classFilter === 'all'}
                            onPress={() => setClassFilter('all')}
                            style={styles.chip}
                            showSelectedOverlay
                        >
                            All Classes
                        </Chip>
                        {['6', '7', '8', '9', '10'].map(c => (
                            <Chip
                                key={c}
                                selected={classFilter === c}
                                onPress={() => setClassFilter(c)}
                                style={styles.chip}
                                showSelectedOverlay
                            >
                                Class {c}
                            </Chip>
                        ))}
                    </ScrollView>
                </View>

                <Searchbar
                    placeholder="Search students..."
                    onChangeText={onChangeSearch}
                    value={searchQuery}
                    style={styles.searchBar}
                    inputStyle={{ color: '#333' }}
                />

                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#fff" />
                    </View>
                ) : (
                    <FlatList
                        data={filteredStudents}
                        renderItem={renderStudentItem}
                        keyExtractor={item => item.id}
                        contentContainerStyle={styles.listContent}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Text style={{ color: '#fff' }}>No students found</Text>
                            </View>
                        }
                    />
                )}
            </View>
        </GradientBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 60,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    backButton: {
        padding: 8,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 12,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    filterContainer: {
        marginBottom: 16,
    },
    classFilters: {
        paddingHorizontal: 20,
    },
    chip: {
        marginRight: 8,
        backgroundColor: 'rgba(255,255,255,0.9)',
    },
    searchBar: {
        marginHorizontal: 20,
        marginBottom: 20,
        borderRadius: 12,
        backgroundColor: '#fff',
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    studentCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
    },
    studentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    studentInfo: {
        flex: 1,
        marginLeft: 12,
    },
    studentName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    studentEmail: {
        fontSize: 12,
        color: '#666',
    },
    xpBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF9C4',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    xpText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#F59E0B',
        marginLeft: 4,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        paddingTop: 12,
        marginBottom: 12,
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#10B981',
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
    },
    viewDetailsBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    viewDetailsText: {
        color: '#6366F1',
        fontWeight: '600',
        marginRight: 4,
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 40,
    },
});

export default TeacherAnalyticsScreen;
