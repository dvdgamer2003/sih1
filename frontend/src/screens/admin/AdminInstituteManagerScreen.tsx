import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Text, Surface, ActivityIndicator, FAB, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import GradientBackground from '../../components/ui/GradientBackground';
import api from '../../services/api';
import { theme } from '../../theme';

const AdminInstituteManagerScreen = () => {
    const navigation = useNavigation();
    const [institutes, setInstitutes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [newInstitute, setNewInstitute] = useState({ name: '', code: '', address: '', adminEmail: '' });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchInstitutes();
    }, []);

    const fetchInstitutes = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/institutes');
            setInstitutes(response.data);
        } catch (error) {
            console.error('Failed to fetch institutes:', error);
            Alert.alert('Error', 'Failed to fetch institutes');
        } finally {
            setLoading(false);
        }
    };

    const handleAddInstitute = async () => {
        if (!newInstitute.name || !newInstitute.code || !newInstitute.adminEmail) {
            Alert.alert('Error', 'Please fill required fields');
            return;
        }

        setSubmitting(true);
        try {
            await api.post('/admin/institute', newInstitute);
            Alert.alert('Success', 'Institute added successfully');
            setModalVisible(false);
            setNewInstitute({ name: '', code: '', address: '', adminEmail: '' });
            fetchInstitutes();
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to add institute');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteInstitute = (id: string) => {
        Alert.alert(
            'Confirm Delete',
            'Are you sure you want to remove this institute?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await api.delete(`/admin/institute/${id}`);
                            setInstitutes(prev => prev.filter(i => i._id !== id));
                        } catch (error) {
                            Alert.alert('Error', 'Failed to delete institute');
                        }
                    }
                }
            ]
        );
    };

    const renderInstituteItem = ({ item }: { item: any }) => (
        <Surface style={styles.card} elevation={1}>
            <View style={styles.cardContent}>
                <View style={styles.iconBox}>
                    <MaterialCommunityIcons name="office-building" size={24} color={theme.colors.primary} />
                </View>
                <View style={styles.info}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <Text style={styles.name}>{item.name}</Text>
                        {item.status === 'pending' && (
                            <View style={{ backgroundColor: '#F59E0B', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 }}>
                                <Text style={{ color: '#fff', fontSize: 10, fontWeight: '600' }}>Pending</Text>
                            </View>
                        )}
                        {item.status === 'active' && (
                            <View style={{ backgroundColor: '#10B981', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 }}>
                                <Text style={{ color: '#fff', fontSize: 10, fontWeight: '600' }}>Active</Text>
                            </View>
                        )}
                    </View>
                    <Text style={styles.code}>Code: {item.code}</Text>
                    <Text style={styles.email}>{item.adminEmail}</Text>
                    {item.source === 'user_registration' && (
                        <Text style={{ fontSize: 10, color: '#8B5CF6', marginTop: 4 }}>📋 Registered Account</Text>
                    )}
                </View>
                <TouchableOpacity onPress={() => handleDeleteInstitute(item._id)} style={styles.deleteBtn}>
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
                    <Text style={styles.headerTitle}>Manage Institutes</Text>
                    <View style={{ width: 40 }} />
                </View>

                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#fff" />
                    </View>
                ) : (
                    <FlatList
                        data={institutes}
                        renderItem={renderInstituteItem}
                        keyExtractor={item => item._id}
                        contentContainerStyle={styles.listContent}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Text style={{ color: '#fff' }}>No institutes found</Text>
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
                                <Text style={styles.modalTitle}>Add New Institute</Text>

                                <TextInput
                                    style={styles.input}
                                    placeholder="Institute Name"
                                    value={newInstitute.name}
                                    onChangeText={text => setNewInstitute({ ...newInstitute, name: text })}
                                    placeholderTextColor="#666"
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Institute Code (Unique)"
                                    value={newInstitute.code}
                                    onChangeText={text => setNewInstitute({ ...newInstitute, code: text })}
                                    autoCapitalize="characters"
                                    placeholderTextColor="#666"
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Admin Email"
                                    value={newInstitute.adminEmail}
                                    onChangeText={text => setNewInstitute({ ...newInstitute, adminEmail: text })}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    placeholderTextColor="#666"
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Address (Optional)"
                                    value={newInstitute.address}
                                    onChangeText={text => setNewInstitute({ ...newInstitute, address: text })}
                                    placeholderTextColor="#666"
                                />

                                <View style={styles.modalButtons}>
                                    <Button mode="outlined" onPress={() => setModalVisible(false)} style={styles.modalBtn}>
                                        Cancel
                                    </Button>
                                    <Button
                                        mode="contained"
                                        onPress={handleAddInstitute}
                                        loading={submitting}
                                        disabled={submitting}
                                        style={styles.modalBtn}
                                    >
                                        Add Institute
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
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F3E8FF',
        justifyContent: 'center',
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
    code: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#6366F1',
    },
    email: {
        fontSize: 12,
        color: '#666',
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

export default AdminInstituteManagerScreen;
