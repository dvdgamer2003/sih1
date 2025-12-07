import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import GradientBackground from '../../components/ui/GradientBackground';
import CustomCard from '../../components/ui/CustomCard';
import CustomInput from '../../components/ui/CustomInput';
import CustomButton from '../../components/ui/CustomButton';
import api from '../../services/api';

const CreateTeacherScreen = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });

    const handleSubmit = async () => {
        if (!formData.name || !formData.email || !formData.password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            await api.post('/institute/teacher', formData);
            Alert.alert('Success', 'Teacher account created successfully', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to create teacher');
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
                    <Text style={styles.title}>Add Teacher</Text>
                    <View style={{ width: 40 }} />
                </View>

                <CustomCard style={styles.formCard}>
                    <CustomInput
                        label="Full Name *"
                        placeholder="Enter teacher's name"
                        value={formData.name}
                        onChangeText={(text) => setFormData({ ...formData, name: text })}
                        style={styles.input}
                    />
                    <CustomInput
                        label="Email Address *"
                        placeholder="teacher@institute.com"
                        value={formData.email}
                        onChangeText={(text) => setFormData({ ...formData, email: text })}
                        keyboardType="email-address"
                        style={styles.input}
                    />
                    <CustomInput
                        label="Password *"
                        placeholder="Create a password"
                        value={formData.password}
                        onChangeText={(text) => setFormData({ ...formData, password: text })}
                        secureTextEntry
                        style={styles.input}
                    />

                    <CustomButton
                        onPress={handleSubmit}
                        disabled={loading}
                        style={styles.submitButton}
                    >
                        {loading ? 'Creating...' : 'Create Account'}
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
    submitButton: {
        marginTop: 10,
    },
});

export default CreateTeacherScreen;
