import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import GradientBackground from '../../components/ui/GradientBackground';
import CustomCard from '../../components/ui/CustomCard';
import api from '../../services/api';

const AdminEditUserScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { user } = route.params as any;

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email,
        password: '', // Leave empty to keep unchanged
        role: user.role,
        status: user.status,
        selectedClass: user.selectedClass ? String(user.selectedClass) : '',
    });

    const handleUpdate = async () => {
        if (!formData.name || !formData.email) {
            Alert.alert('Error', 'Name and Email are required');
            return;
        }

        setLoading(true);
        try {
            const updateData: any = { ...formData };
            if (!updateData.password) delete updateData.password; // Don't send empty password

            await api.put(`/admin/users/${user._id}`, updateData);
            Alert.alert('Success', 'User updated successfully', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to update user');
        } finally {
            setLoading(false);
        }
    };

    const roles = ['student', 'teacher', 'institute', 'admin'];
    const statuses = ['active', 'pending', 'disabled'];

    return (
        <GradientBackground>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Edit User</Text>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView contentContainerStyle={styles.content}>
                    <CustomCard style={styles.card}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Full Name *</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.name}
                                onChangeText={(text) => setFormData({ ...formData, name: text })}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email Address *</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.email}
                                onChangeText={(text) => setFormData({ ...formData, email: text })}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>New Password (Optional)</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Leave empty to keep current"
                                secureTextEntry
                                value={formData.password}
                                onChangeText={(text) => setFormData({ ...formData, password: text })}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Role</Text>
                            <View style={styles.roleContainer}>
                                {roles.map((role) => (
                                    <TouchableOpacity
                                        key={role}
                                        style={[
                                            styles.roleChip,
                                            formData.role === role && styles.roleChipActive
                                        ]}
                                        onPress={() => setFormData({ ...formData, role })}
                                    >
                                        <Text style={[
                                            styles.roleText,
                                            formData.role === role && styles.roleTextActive
                                        ]}>
                                            {role.charAt(0).toUpperCase() + role.slice(1)}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Status</Text>
                            <View style={styles.roleContainer}>
                                {statuses.map((status) => (
                                    <TouchableOpacity
                                        key={status}
                                        style={[
                                            styles.roleChip,
                                            formData.status === status && styles.roleChipActive
                                        ]}
                                        onPress={() => setFormData({ ...formData, status })}
                                    >
                                        <Text style={[
                                            styles.roleText,
                                            formData.status === status && styles.roleTextActive
                                        ]}>
                                            {status.charAt(0).toUpperCase() + status.slice(1)}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {formData.role === 'student' && (
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Class</Text>
                                <TextInput
                                    style={styles.input}
                                    keyboardType="numeric"
                                    value={formData.selectedClass}
                                    onChangeText={(text) => setFormData({ ...formData, selectedClass: text })}
                                />
                            </View>
                        )}

                        <TouchableOpacity
                            style={styles.submitButton}
                            onPress={handleUpdate}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.submitButtonText}>Update User</Text>
                            )}
                        </TouchableOpacity>
                    </CustomCard>
                </ScrollView>
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
    content: {
        paddingBottom: 20,
    },
    card: {
        padding: 20,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    roleContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    roleChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    roleChipActive: {
        backgroundColor: '#4F46E5',
        borderColor: '#4F46E5',
    },
    roleText: {
        color: '#6B7280',
        fontWeight: '600',
    },
    roleTextActive: {
        color: '#fff',
    },
    submitButton: {
        backgroundColor: '#4F46E5',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default AdminEditUserScreen;
