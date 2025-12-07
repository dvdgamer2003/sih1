import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import GradientBackground from '../../components/ui/GradientBackground';
import CustomCard from '../../components/ui/CustomCard';
import api from '../../services/api';

const GlobalAnalyticsScreen = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalInstitutes: 0,
        totalTeachers: 0,
        totalStudents: 0,
        totalQuizzesTaken: 0,
        totalLessonsCompleted: 0,
        dailyActiveUsers: 0
    });

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const response = await api.get('/admin/analytics');
            setStats(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ title, value, icon, color }: any) => (
        <CustomCard style={styles.statCard}>
            <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
                <Ionicons name={icon} size={24} color={color} />
            </View>
            <View>
                <Text style={styles.statValue}>{value}</Text>
                <Text style={styles.statTitle}>{title}</Text>
            </View>
        </CustomCard>
    );

    return (
        <GradientBackground>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Global Analytics</Text>
                    <View style={{ width: 40 }} />
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color="#fff" style={{ marginTop: 20 }} />
                ) : (
                    <View style={styles.grid}>
                        <StatCard
                            title="Total Institutes"
                            value={stats.totalInstitutes}
                            icon="school"
                            color="#4F46E5"
                        />
                        <StatCard
                            title="Total Students"
                            value={stats.totalStudents}
                            icon="people"
                            color="#10B981"
                        />
                        <StatCard
                            title="Total Teachers"
                            value={stats.totalTeachers}
                            icon="person"
                            color="#F59E0B"
                        />
                        <StatCard
                            title="Daily Active Users"
                            value={stats.dailyActiveUsers}
                            icon="trending-up"
                            color="#EC4899"
                        />
                        <StatCard
                            title="Quizzes Taken"
                            value={stats.totalQuizzesTaken}
                            icon="help-circle"
                            color="#8B5CF6"
                        />
                        <StatCard
                            title="Lessons Completed"
                            value={stats.totalLessonsCompleted}
                            icon="book"
                            color="#3B82F6"
                        />
                    </View>
                )}
            </ScrollView>
        </GradientBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingTop: 60,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
    },
    backButton: {
        padding: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    statCard: {
        width: '48%',
        marginBottom: 20,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    statTitle: {
        fontSize: 12,
        color: '#6B7280',
    },
});

export default GlobalAnalyticsScreen;
