import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import GradientBackground from '../../components/ui/GradientBackground';
import CustomCard from '../../components/ui/CustomCard';
import CustomInput from '../../components/ui/CustomInput';
import CustomButton from '../../components/ui/CustomButton';
import api from '../../services/api';

const EditStudentScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { student } = route.params as any;

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: student.name,
        email: student.email,
        grade: student.selectedClass?.toString() || '',
        password: '',
        status: student.status || 'active'
    });

    const handleSubmit = async () => {
        if (!formData.name || !formData.email || !formData.grade) {
            Alert.alert('Error', 'Name, Email and Grade are required');
            return;
        }

        setLoading(true);
        try {
            const updateData: any = {
                name: formData.name,
                email: formData.email,
                grade: formData.grade,
                status: formData.status
            };
            if (formData.password) {
                updateData.password = formData.password;
            }

            await api.put(`/teacher/student/${student._id}`, updateData);
            Alert.alert('Success', 'Student updated successfully', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to update student');
        } finally {
            setLoading(false);
        }
    };

    return (
        <GradientBackground>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Edit Student</Text>
                    <View style={{ width: 40 }} />
                </View>

                <CustomCard style={styles.formCard}>
                    <CustomInput
                        label="Full Name *"
                        value={formData.name}
                        onChangeText={(text) => setFormData({ ...formData, name: text })}
                        style={styles.input}
                    />
                    <CustomInput
                        label="Email Address *"
                        value={formData.email}
                        onChangeText={(text) => setFormData({ ...formData, email: text })}
                        keyboardType="email-address"
                        style={styles.input}
                    />
                    <CustomInput
                        label="Grade (6-12) *"
                        value={formData.grade}
                        onChangeText={(text) => setFormData({ ...formData, grade: text })}
                        keyboardType="numeric"
                        style={styles.input}
                    />
                    <CustomInput
                        label="New Password (Optional)"
                        placeholder="Leave blank to keep current"
                        value={formData.password}
                        onChangeText={(text) => setFormData({ ...formData, password: text })}
                        secureTextEntry
                        style={styles.input}
                    />

                    <Text style={styles.label}>Status</Text>
                    <View style={styles.statusContainer}>
                        <TouchableOpacity
                            style={[styles.statusButton, formData.status === 'active' && styles.activeStatus]}
                            onPress={() => setFormData({ ...formData, status: 'active' })}
                        >
                            <Text style={[styles.statusText, formData.status === 'active' && styles.activeStatusText]}>Active</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.statusButton, formData.status === 'disabled' && styles.disabledStatus]}
                            onPress={() => setFormData({ ...formData, status: 'disabled' })}
                        >
                            <Text style={[styles.statusText, formData.status === 'disabled' && styles.disabledStatusText]}>Disabled</Text>
                        </TouchableOpacity>
                    </View>

                    <CustomButton
                        onPress={handleSubmit}
                        disabled={loading}
                        style={styles.submitButton}
                    >
                        {loading ? 'Updating...' : 'Update Student'}
                    </CustomButton>
                </CustomCard>
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
    formCard: {
        padding: 20,
    },
    input: {
        marginBottom: 15,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
        marginLeft: 4,
    },
    statusContainer: {
        flexDirection: 'row',
        marginBottom: 25,
        gap: 10,
    },
    statusButton: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        alignItems: 'center',
    },
    activeStatus: {
        backgroundColor: '#D1FAE5',
        borderColor: '#059669',
    },
    disabledStatus: {
        backgroundColor: '#FEE2E2',
        borderColor: '#DC2626',
    },
    statusText: {
        fontWeight: '600',
        color: '#6B7280',
    },
    activeStatusText: {
        color: '#059669',
    },
    disabledStatusText: {
        color: '#DC2626',
    },
    submitButton: {
        marginTop: 10,
    },
});

export default EditStudentScreen;
