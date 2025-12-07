import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import GradientBackground from '../../components/ui/GradientBackground';
import CustomCard from '../../components/ui/CustomCard';
import api from '../../services/api';

const StudentAnalyticsScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { studentId, studentName } = route.params as any;

    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        xp: 0,
        streak: 0,
        completedLessons: 0,
        quizHistory: [],
        weakAreas: [],
        performanceTrend: []
    });

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const response = await api.get(`/teacher/analytics/${studentId}`);
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
                    <Text style={styles.title}>{studentName}'s Progress</Text>
                    <View style={{ width: 40 }} />
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color="#fff" style={{ marginTop: 20 }} />
                ) : (
                    <View>
                        <View style={styles.grid}>
                            <StatCard
                                title="Total XP"
                                value={stats.xp}
                                icon="trophy"
                                color="#F59E0B"
                            />
                            <StatCard
                                title="Current Streak"
                                value={stats.streak}
                                icon="flame"
                                color="#EF4444"
                            />
                            <StatCard
                                title="Lessons Done"
                                value={stats.completedLessons}
                                icon="checkmark-circle"
                                color="#10B981"
                            />
                        </View>

                        <CustomCard style={styles.sectionCard}>
                            <Text style={styles.sectionTitle}>Recent Quiz Performance</Text>
                            {stats.quizHistory.length > 0 ? (
                                stats.quizHistory.map((quiz: any, index) => (
                                    <View key={index} style={styles.quizRow}>
                                        <Text style={styles.quizDate}>{new Date(quiz.date).toLocaleDateString()}</Text>
                                        <View style={styles.scoreContainer}>
                                            <Text style={styles.scoreText}>
                                                {Math.round((quiz.score / quiz.totalQuestions) * 100)}%
                                            </Text>
                                        </View>
                                    </View>
                                ))
                            ) : (
                                <Text style={styles.emptyText}>No quizzes taken yet</Text>
                            )}
                        </CustomCard>

                        <CustomCard style={styles.sectionCard}>
                            <Text style={styles.sectionTitle}>Weak Areas</Text>
                            {stats.weakAreas.length > 0 ? (
                                stats.weakAreas.map((area: any, index) => (
                                    <View key={index} style={styles.weakAreaRow}>
                                        <Ionicons name="alert-circle" size={20} color="#EF4444" />
                                        <Text style={styles.weakAreaText}>Quiz ID: {area}</Text>
                                    </View>
                                ))
                            ) : (
                                <Text style={styles.emptyText}>No weak areas identified</Text>
                            )}
                        </CustomCard>
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
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    statCard: {
        width: '31%',
        marginBottom: 20,
        padding: 10,
        alignItems: 'center',
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    statValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    statTitle: {
        fontSize: 10,
        color: '#6B7280',
        textAlign: 'center',
    },
    sectionCard: {
        padding: 20,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 15,
    },
    quizRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    quizDate: {
        color: '#4B5563',
    },
    scoreContainer: {
        backgroundColor: '#E0E7FF',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    scoreText: {
        color: '#4F46E5',
        fontWeight: 'bold',
        fontSize: 12,
    },
    weakAreaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 10,
    },
    weakAreaText: {
        color: '#374151',
    },
    emptyText: {
        color: '#6B7280',
        fontStyle: 'italic',
    },
});

export default StudentAnalyticsScreen;
