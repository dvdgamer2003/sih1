import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import GradientBackground from '../../components/ui/GradientBackground';
import { useAuth } from '../../context/AuthContext';
import { theme } from '../../theme';

const AdminHomeScreen = () => {
    const navigation = useNavigation();
    const { user, logout } = useAuth();

    const menuItems = [
        { title: 'Manage Institutes', icon: 'business', screen: 'AdminInstituteManager', color: '#10B981' },
        { title: 'Manage Users', icon: 'people', screen: 'AdminUserManagement', color: '#8B5CF6' },
        { title: 'Pending Approvals', icon: 'time', screen: 'AdminDashboard', color: '#F59E0B' }, // Reusing existing dashboard for approvals
        { title: 'Global Analytics', icon: 'stats-chart', screen: 'AdminAnalytics', color: '#3B82F6' },
    ];

    return (
        <GradientBackground>
            <View style={styles.container}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>Welcome,</Text>
                        <Text style={styles.name}>{user?.name || 'System Admin'}</Text>
                    </View>
                    <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
                        <Ionicons name="log-out-outline" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.content}>
                    <View style={styles.grid}>
                        {menuItems.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.cardContainer}
                                onPress={() => (navigation as any).navigate(item.screen)}
                            >
                                <Surface style={styles.card} elevation={2}>
                                    <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
                                        <Ionicons name={item.icon as any} size={32} color="#fff" />
                                    </View>
                                    <Text style={styles.cardTitle}>{item.title}</Text>
                                </Surface>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
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
        marginBottom: 30,
    },
    greeting: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    logoutBtn: {
        padding: 8,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 12,
    },
    content: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    cardContainer: {
        width: '48%',
        marginBottom: 16,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        height: 160,
        justifyContent: 'center',
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
    },
});

export default AdminHomeScreen;
