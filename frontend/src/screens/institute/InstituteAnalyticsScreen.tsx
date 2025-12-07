import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Surface, ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import GradientBackground from '../../components/ui/GradientBackground';
import api from '../../services/api';
import { theme } from '../../theme';

const InstituteAnalyticsScreen = () => {
    const navigation = useNavigation();
    const [analytics, setAnalytics] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            const response = await api.get('/institute/analytics');
            setAnalytics(response.data);
        } catch (error) {
            console.error('Failed to fetch institute analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ title, value, icon, color }: any) => (
        <Surface style={styles.statCard} elevation={2}>
            <View style={[styles.iconContainer, { backgroundColor: color }]}>
                <MaterialCommunityIcons name={icon} size={24} color="#fff" />
            </View>
            <View>
                <Text style={styles.statValue}>{value}</Text>
                <Text style={styles.statTitle}>{title}</Text>
            </View>
        </Surface>
    );

    return (
        <GradientBackground>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Institute Analytics</Text>
                    <View style={{ width: 40 }} />
                </View>

                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#fff" />
                    </View>
                ) : analytics ? (
                    <ScrollView contentContainerStyle={styles.content}>
                        <View style={styles.statsGrid}>
                            <StatCard
                                title="Total Students"
                                value={analytics.totalStudents}
                                icon="school"
                                color="#3B82F6"
                            />
                            <StatCard
                                title="Total Teachers"
                                value={analytics.totalTeachers}
                                icon="teach"
                                color="#8B5CF6"
                            />
                            <StatCard
                                title="Pending Approvals"
                                value={analytics.pendingApprovals}
                                icon="account-clock"
                                color="#F59E0B"
                            />
                            <StatCard
                                title="Avg Quiz Score"
                                value={`${analytics.avgQuizScore}%`}
                                icon="chart-bar"
                                color="#10B981"
                            />
                        </View>

                        <Surface style={styles.sectionCard} elevation={1}>
                            <Text style={styles.sectionTitle}>Most Active Classes</Text>
                            {analytics.mostActiveGrades && analytics.mostActiveGrades.length > 0 ? (
                                analytics.mostActiveGrades.map((grade: string, index: number) => (
                                    <View key={index} style={styles.listItem}>
                                        <View style={styles.rankBadge}>
                                            <Text style={styles.rankText}>{index + 1}</Text>
                                        </View>
                                        <Text style={styles.listText}>{grade}</Text>
                                    </View>
                                ))
                            ) : (
                                <Text style={styles.emptyText}>No activity data yet</Text>
                            )}
                        </Surface>
                    </ScrollView>
                ) : (
                    <View style={styles.emptyContainer}>
                        <Text style={{ color: '#fff' }}>Failed to load analytics</Text>
                    </View>
                )}
            </View>
        </GradientBackground>
    );
};

import { TouchableOpacity } from 'react-native';

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
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    content: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    statCard: {
        width: '48%',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    statTitle: {
        fontSize: 12,
        color: '#666',
    },
    sectionCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#333',
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    rankBadge: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#E0E7FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    rankText: {
        color: '#6366F1',
        fontWeight: 'bold',
        fontSize: 12,
    },
    listText: {
        fontSize: 16,
        color: '#333',
    },
    emptyText: {
        color: '#999',
        fontStyle: 'italic',
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 40,
    },
});

export default InstituteAnalyticsScreen;
