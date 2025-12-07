import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Text, Surface, Avatar, ActivityIndicator, FAB, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import GradientBackground from '../../components/ui/GradientBackground';
import api from '../../services/api';
import { theme } from '../../theme';

const InstituteTeacherManagerScreen = () => {
    const navigation = useNavigation();
    const [teachers, setTeachers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [newTeacher, setNewTeacher] = useState({ name: '', email: '', password: '' });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchTeachers();
    }, []);

    const fetchTeachers = async () => {
        setLoading(true);
        try {
            const response = await api.get('/institute/teachers');
            setTeachers(response.data);
        } catch (error) {
            console.error('Failed to fetch teachers:', error);
            Alert.alert('Error', 'Failed to fetch teachers');
        } finally {
            setLoading(false);
        }
    };

    const handleAddTeacher = async () => {
        if (!newTeacher.name || !newTeacher.email || !newTeacher.password) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }

        setSubmitting(true);
        try {
            await api.post('/institute/teacher', newTeacher);
            Alert.alert('Success', 'Teacher added successfully');
            setModalVisible(false);
            setNewTeacher({ name: '', email: '', password: '' });
            fetchTeachers();
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to add teacher');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteTeacher = (id: string) => {
        Alert.alert(
            'Confirm Delete',
            'Are you sure you want to remove this teacher?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await api.delete(`/institute/teacher/${id}`);
                            setTeachers(prev => prev.filter(t => t._id !== id));
                        } catch (error) {
                            Alert.alert('Error', 'Failed to delete teacher');
                        }
                    }
                }
            ]
        );
    };

    const renderTeacherItem = ({ item }: { item: any }) => (
        <Surface style={styles.card} elevation={1}>
            <View style={styles.cardContent}>
                <Avatar.Text size={40} label={item.name.substring(0, 2).toUpperCase()} style={{ backgroundColor: theme.colors.primary }} />
                <View style={styles.info}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.email}>{item.email}</Text>
                    <Text style={[styles.status, { color: item.status === 'active' ? 'green' : 'orange' }]}>
                        {item.status.toUpperCase()}
                    </Text>
                </View>
                <TouchableOpacity onPress={() => handleDeleteTeacher(item._id)} style={styles.deleteBtn}>
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
                    <Text style={styles.headerTitle}>Manage Teachers</Text>
                    <View style={{ width: 40 }} />
                </View>

                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#fff" />
                    </View>
                ) : (
                    <FlatList
                        data={teachers}
                        renderItem={renderTeacherItem}
                        keyExtractor={item => item._id}
                        contentContainerStyle={styles.listContent}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Text style={{ color: '#fff' }}>No teachers found</Text>
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
                                <Text style={styles.modalTitle}>Add New Teacher</Text>

                                <TextInput
                                    style={styles.input}
                                    placeholder="Full Name"
                                    value={newTeacher.name}
                                    onChangeText={text => setNewTeacher({ ...newTeacher, name: text })}
                                    placeholderTextColor="#666"
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Email Address"
                                    value={newTeacher.email}
                                    onChangeText={text => setNewTeacher({ ...newTeacher, email: text })}
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                    placeholderTextColor="#666"
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Password"
                                    value={newTeacher.password}
                                    onChangeText={text => setNewTeacher({ ...newTeacher, password: text })}
                                    secureTextEntry
                                    placeholderTextColor="#666"
                                />

                                <View style={styles.modalButtons}>
                                    <Button mode="outlined" onPress={() => setModalVisible(false)} style={styles.modalBtn}>
                                        Cancel
                                    </Button>
                                    <Button
                                        mode="contained"
                                        onPress={handleAddTeacher}
                                        loading={submitting}
                                        disabled={submitting}
                                        style={styles.modalBtn}
                                    >
                                        Add Teacher
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
    },
    status: {
        fontSize: 12,
        fontWeight: 'bold',
        marginTop: 4,
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

export default InstituteTeacherManagerScreen;
