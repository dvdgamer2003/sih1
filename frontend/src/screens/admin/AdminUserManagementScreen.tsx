import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Text, Surface, Avatar, ActivityIndicator, FAB, Button, Searchbar, Chip } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import GradientBackground from '../../components/ui/GradientBackground';
import api from '../../services/api';
import { theme } from '../../theme';

const AdminUserManagementScreen = () => {
    const navigation = useNavigation();
    const [users, setUsers] = useState<any[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('all'); // 'all', 'teacher', 'student'

    const [modalVisible, setModalVisible] = useState(false);
    const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'student', selectedClass: '' });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        filterUsers();
    }, [searchQuery, roleFilter, users]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Failed to fetch users:', error);
            Alert.alert('Error', 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const filterUsers = () => {
        let result = users;

        if (roleFilter !== 'all') {
            result = result.filter(u => u.role === roleFilter);
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(u =>
                u.name.toLowerCase().includes(query) ||
                u.email.toLowerCase().includes(query)
            );
        }

        setFilteredUsers(result);
    };

    const handleAddUser = async () => {
        if (!newUser.name || !newUser.email || !newUser.password) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }

        setSubmitting(true);
        try {
            await api.post('/admin/users', newUser);
            Alert.alert('Success', 'User added successfully');
            setModalVisible(false);
            setNewUser({ name: '', email: '', password: '', role: 'student', selectedClass: '' });
            fetchUsers();
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to add user');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteUser = (id: string) => {
        Alert.alert(
            'Confirm Delete',
            'Are you sure you want to remove this user?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await api.delete(`/admin/users/${id}`);
                            setUsers(prev => prev.filter(u => u._id !== id));
                        } catch (error) {
                            Alert.alert('Error', 'Failed to delete user');
                        }
                    }
                }
            ]
        );
    };

    const renderUserItem = ({ item }: { item: any }) => (
        <Surface style={styles.card} elevation={1}>
            <View style={styles.cardContent}>
                <Avatar.Text
                    size={40}
                    label={item.name.substring(0, 2).toUpperCase()}
                    style={{ backgroundColor: item.role === 'teacher' ? theme.colors.primary : '#10B981' }}
                />
                <View style={styles.info}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.email}>{item.email}</Text>
                    <View style={styles.badges}>
                        <View style={[styles.roleBadge, { backgroundColor: item.role === 'teacher' ? '#E0E7FF' : '#D1FAE5' }]}>
                            <Text style={[styles.roleText, { color: item.role === 'teacher' ? '#4338CA' : '#065F46' }]}>
                                {item.role.toUpperCase()}
                            </Text>
                        </View>
                        {item.selectedClass && (
                            <View style={styles.classBadge}>
                                <Text style={styles.classText}>Class {item.selectedClass}</Text>
                            </View>
                        )}
                    </View>
                </View>
                <TouchableOpacity onPress={() => handleDeleteUser(item._id)} style={styles.deleteBtn}>
                    <Ionicons name="trash-outline" size={20} color="#EF4444" />
                </TouchableOpacity>
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
                    <Text style={styles.headerTitle}>User Management</Text>
                    <View style={{ width: 40 }} />
                </View>

                <View style={styles.filters}>
                    <Searchbar
                        placeholder="Search users..."
                        onChangeText={setSearchQuery}
                        value={searchQuery}
                        style={styles.searchBar}
                        inputStyle={{ color: '#333' }}
                    />
                    <View style={styles.chipContainer}>
                        <Chip selected={roleFilter === 'all'} onPress={() => setRoleFilter('all')} style={styles.chip}>All</Chip>
                        <Chip selected={roleFilter === 'student'} onPress={() => setRoleFilter('student')} style={styles.chip}>Students</Chip>
                        <Chip selected={roleFilter === 'teacher'} onPress={() => setRoleFilter('teacher')} style={styles.chip}>Teachers</Chip>
                    </View>
                </View>

                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#fff" />
                    </View>
                ) : (
                    <FlatList
                        data={filteredUsers}
                        renderItem={renderUserItem}
                        keyExtractor={item => item._id}
                        contentContainerStyle={styles.listContent}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Text style={{ color: '#fff' }}>No users found</Text>
                            </View>
                        }
                    />
                )}

                <FAB
                    style={styles.fab}
                    icon="plus"
                    color="#fff"
                    onPress={() => setModalVisible(true)}
                />

                <Modal
                    visible={modalVisible}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        style={styles.modalOverlay}
                    >
                        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>Add New User</Text>

                                <TextInput
                                    style={styles.input}
                                    placeholder="Full Name"
                                    value={newUser.name}
                                    onChangeText={text => setNewUser({ ...newUser, name: text })}
                                    placeholderTextColor="#666"
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Email Address"
                                    value={newUser.email}
                                    onChangeText={text => setNewUser({ ...newUser, email: text })}
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                    placeholderTextColor="#666"
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Password"
                                    value={newUser.password}
                                    onChangeText={text => setNewUser({ ...newUser, password: text })}
                                    secureTextEntry
                                    placeholderTextColor="#666"
                                />

                                <View style={styles.roleSelector}>
                                    <Text style={styles.label}>Role:</Text>
                                    <View style={styles.roleButtons}>
                                        <TouchableOpacity
                                            style={[styles.roleBtn, newUser.role === 'student' && styles.roleBtnActive]}
                                            onPress={() => setNewUser({ ...newUser, role: 'student' })}
                                        >
                                            <Text style={[styles.roleBtnText, newUser.role === 'student' && styles.roleBtnTextActive]}>Student</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.roleBtn, newUser.role === 'teacher' && styles.roleBtnActive]}
                                            onPress={() => setNewUser({ ...newUser, role: 'teacher' })}
                                        >
                                            <Text style={[styles.roleBtnText, newUser.role === 'teacher' && styles.roleBtnTextActive]}>Teacher</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                {newUser.role === 'student' && (
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Class (6-12)"
                                        value={newUser.selectedClass}
                                        onChangeText={text => setNewUser({ ...newUser, selectedClass: text })}
                                        keyboardType="numeric"
                                        placeholderTextColor="#666"
                                    />
                                )}

                                <View style={styles.modalButtons}>
                                    <Button mode="outlined" onPress={() => setModalVisible(false)} style={styles.modalBtn}>
                                        Cancel
                                    </Button>
                                    <Button
                                        mode="contained"
                                        onPress={handleAddUser}
                                        loading={submitting}
                                        disabled={submitting}
                                        style={styles.modalBtn}
                                    >
                                        Add User
                                    </Button>
                                </View>
                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </Modal>
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
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    filters: {
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    searchBar: {
        marginBottom: 12,
        borderRadius: 12,
        backgroundColor: '#fff',
    },
    chipContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    chip: {
        backgroundColor: 'rgba(255,255,255,0.9)',
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
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    info: {
        flex: 1,
        marginLeft: 12,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    email: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    badges: {
        flexDirection: 'row',
        gap: 8,
    },
    roleBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
    },
    roleText: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    classBadge: {
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
    },
    classText: {
        fontSize: 10,
        color: '#374151',
    },
    deleteBtn: {
        padding: 8,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: theme.colors.primary,
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 40,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20,
        zIndex: 1000,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 24,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        fontSize: 16,
    },
    roleSelector: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    roleButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    roleBtn: {
        flex: 1,
        padding: 12,
        borderRadius: 12,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
    },
    roleBtnActive: {
        backgroundColor: theme.colors.primary,
    },
    roleBtnText: {
        color: '#666',
        fontWeight: '600',
    },
    roleBtnTextActive: {
        color: '#fff',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
    },
    modalBtn: {
        flex: 1,
        marginHorizontal: 6,
    },
});

export default AdminUserManagementScreen;
