import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import GradientBackground from '../../components/ui/GradientBackground';
import CustomCard from '../../components/ui/CustomCard';
import api from '../../services/api';

const AdminUserListScreen = () => {
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');

    useEffect(() => {
        if (isFocused) {
            fetchUsers();
        }
    }, [isFocused, search, roleFilter]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            let url = '/admin/users?';
            if (search) url += `search=${search}&`;
            if (roleFilter) url += `role=${roleFilter}`;

            const response = await api.get(url);
            setUsers(response.data);
        } catch (error) {
            console.error('Failed to fetch users:', error);
            Alert.alert('Error', 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id: string, name: string) => {
        Alert.alert(
            'Delete User',
            `Are you sure you want to delete ${name}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await api.delete(`/admin/users/${id}`);
                            fetchUsers();
                            Alert.alert('Success', 'User deleted successfully');
                        } catch (error) {
                            Alert.alert('Error', 'Failed to delete user');
                        }
                    }
                }
            ]
        );
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'admin': return '#EF4444';
            case 'institute': return '#F59E0B';
            case 'teacher': return '#10B981';
            case 'student': return '#3B82F6';
            default: return '#6B7280';
        }
    };

    return (
        <GradientBackground>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.title}>User Management</Text>
                    <TouchableOpacity
                        onPress={() => (navigation as any).navigate('AdminCreateUser')}
                        style={styles.addButton}
                    >
                        <Ionicons name="add" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>

                {/* Search and Filter */}
                <View style={styles.controls}>
                    <View style={styles.searchContainer}>
                        <Ionicons name="search" size={20} color="#9CA3AF" />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search users..."
                            placeholderTextColor="#9CA3AF"
                            value={search}
                            onChangeText={setSearch}
                        />
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
                        {['', 'student', 'teacher', 'institute', 'admin'].map((role) => (
                            <TouchableOpacity
                                key={role}
                                style={[
                                    styles.filterChip,
                                    roleFilter === role && styles.filterChipActive
                                ]}
                                onPress={() => setRoleFilter(role)}
                            >
                                <Text style={[
                                    styles.filterText,
                                    roleFilter === role && styles.filterTextActive
                                ]}>
                                    {role === '' ? 'All' : role.charAt(0).toUpperCase() + role.slice(1)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color="#fff" style={{ marginTop: 40 }} />
                ) : (
                    <ScrollView contentContainerStyle={styles.list}>
                        {users.map((user) => (
                            <CustomCard key={user._id} style={styles.userCard}>
                                <View style={styles.userInfo}>
                                    <View style={[styles.avatar, { backgroundColor: getRoleColor(user.role) }]}>
                                        <Text style={styles.avatarText}>{user.name.charAt(0).toUpperCase()}</Text>
                                    </View>
                                    <View style={styles.userDetails}>
                                        <Text style={styles.userName}>{user.name}</Text>
                                        <Text style={styles.userEmail}>{user.email}</Text>
                                        <View style={styles.roleBadge}>
                                            <Text style={[styles.roleText, { color: getRoleColor(user.role) }]}>
                                                {user.role.toUpperCase()}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.actions}>
                                    <TouchableOpacity
                                        onPress={() => (navigation as any).navigate('AdminEditUser', { user })}
                                        style={styles.actionButton}
                                    >
                                        <Ionicons name="create-outline" size={20} color="#4F46E5" />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => handleDelete(user._id, user.name)}
                                        style={styles.actionButton}
                                    >
                                        <Ionicons name="trash-outline" size={20} color="#EF4444" />
                                    </TouchableOpacity>
                                </View>
                            </CustomCard>
                        ))}
                        {users.length === 0 && (
                            <Text style={styles.emptyText}>No users found</Text>
                        )}
                    </ScrollView>
                )}
            </View>
        </GradientBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 60,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    backButton: {
        padding: 8,
    },
    addButton: {
        backgroundColor: '#10B981',
        padding: 8,
        borderRadius: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    controls: {
        marginBottom: 20,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 12,
        paddingHorizontal: 15,
        height: 50,
        marginBottom: 15,
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        color: '#fff',
        fontSize: 16,
    },
    filterContainer: {
        flexDirection: 'row',
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginRight: 10,
    },
    filterChipActive: {
        backgroundColor: '#fff',
    },
    filterText: {
        color: '#fff',
        fontWeight: '600',
    },
    filterTextActive: {
        color: '#4F46E5',
    },
    list: {
        paddingBottom: 20,
    },
    userCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        padding: 15,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    avatarText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    userDetails: {
        flex: 1,
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    userEmail: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 4,
    },
    roleBadge: {
        alignSelf: 'flex-start',
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    roleText: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    actions: {
        flexDirection: 'row',
        gap: 10,
    },
    actionButton: {
        padding: 8,
    },
    emptyText: {
        color: '#fff',
        textAlign: 'center',
        marginTop: 40,
        fontSize: 16,
    }
});

export default AdminUserListScreen;
