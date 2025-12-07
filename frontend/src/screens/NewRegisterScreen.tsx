import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, ActivityIndicator } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';
import { useAuth } from '../context/AuthContext';
import { spacing, borderRadius } from '../theme';

const ROLES = [
    { value: 'student', label: 'Student', icon: 'account-school', color: '#667eea' },
    { value: 'teacher', label: 'Teacher', icon: 'human-male-board', color: '#f093fb' },
    { value: 'institute', label: 'Institute', icon: 'office-building', color: '#4facfe' },
    { value: 'admin', label: 'Admin', icon: 'shield-account', color: '#f5576c' },
];

const NewRegisterScreen = ({ navigation }: any) => {
    const { register } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'student' | 'teacher' | 'admin' | 'institute'>('student');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleRegister = async () => {
        if (!name || !email || !password) {
            setError('Please fill in all fields');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await register({ name, email, password, language: 'en', role });
        } catch (e: any) {
            setError(e?.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.background}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.keyboardView}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Header */}
                    <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
                        <MaterialCommunityIcons name="account-plus" size={80} color="#fff" />
                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.subtitle}>Join us and start learning</Text>
                    </Animated.View>

                    {/* Form Card */}
                    <Animated.View entering={FadeInUp.delay(200).duration(600)} style={styles.card}>
                        <View style={styles.cardContent}>
                            {/* Name Input */}
                            <View style={styles.inputContainer}>
                                <TextInput
                                    mode="outlined"
                                    label="Full Name"
                                    value={name}
                                    onChangeText={setName}
                                    style={styles.input}
                                    outlineColor="#e0e0e0"
                                    activeOutlineColor="#667eea"
                                    theme={{ roundness: 12 }}
                                    left={<TextInput.Icon icon="account-outline" />}
                                />
                            </View>

                            {/* Email Input */}
                            <View style={styles.inputContainer}>
                                <TextInput
                                    mode="outlined"
                                    label="Email"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    style={styles.input}
                                    outlineColor="#e0e0e0"
                                    activeOutlineColor="#667eea"
                                    theme={{ roundness: 12 }}
                                    left={<TextInput.Icon icon="email-outline" />}
                                />
                            </View>

                            {/* Password Input */}
                            <View style={styles.inputContainer}>
                                <TextInput
                                    mode="outlined"
                                    label="Password"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                    style={styles.input}
                                    outlineColor="#e0e0e0"
                                    activeOutlineColor="#667eea"
                                    theme={{ roundness: 12 }}
                                    left={<TextInput.Icon icon="lock-outline" />}
                                    right={
                                        <TextInput.Icon
                                            icon={showPassword ? 'eye-off' : 'eye'}
                                            onPress={() => setShowPassword(!showPassword)}
                                        />
                                    }
                                />
                            </View>

                            {/* Role Selection */}
                            <View style={styles.roleSection}>
                                <Text style={styles.roleTitle}>Who are you?</Text>
                                <View style={styles.roleGrid}>
                                    {ROLES.map((roleItem, index) => (
                                        <Animated.View
                                            key={roleItem.value}
                                            entering={ZoomIn.delay(400 + index * 100).duration(400)}
                                            style={styles.roleCardWrapper}
                                        >
                                            <TouchableOpacity
                                                onPress={() => setRole(roleItem.value as any)}
                                                activeOpacity={0.7}
                                            >
                                                <LinearGradient
                                                    colors={
                                                        role === roleItem.value
                                                            ? [roleItem.color, roleItem.color + 'dd']
                                                            : ['#f5f5f5', '#e0e0e0']
                                                    }
                                                    style={[
                                                        styles.roleCard,
                                                        role === roleItem.value && styles.roleCardActive
                                                    ]}
                                                >
                                                    <MaterialCommunityIcons
                                                        name={roleItem.icon as any}
                                                        size={32}
                                                        color={role === roleItem.value ? '#fff' : '#666'}
                                                    />
                                                    <Text style={[
                                                        styles.roleLabel,
                                                        role === roleItem.value && styles.roleLabelActive
                                                    ]}>
                                                        {roleItem.label}
                                                    </Text>
                                                    {role === roleItem.value && (
                                                        <View style={styles.checkmark}>
                                                            <MaterialCommunityIcons name="check-circle" size={20} color="#4CAF50" />
                                                        </View>
                                                    )}
                                                </LinearGradient>
                                            </TouchableOpacity>
                                        </Animated.View>
                                    ))}
                                </View>
                            </View>

                            {/* Error Message */}
                            {error ? (
                                <Text style={styles.errorText}>{error}</Text>
                            ) : null}

                            {/* Register Button */}
                            <TouchableOpacity
                                onPress={handleRegister}
                                disabled={loading}
                                activeOpacity={0.8}
                            >
                                <LinearGradient
                                    colors={['#667eea', '#764ba2']}
                                    style={styles.registerButton}
                                >
                                    {loading ? (
                                        <ActivityIndicator color="#fff" />
                                    ) : (
                                        <>
                                            <Text style={styles.registerButtonText}>Create Account</Text>
                                            <MaterialCommunityIcons name="rocket-launch" size={24} color="#fff" />
                                        </>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>

                            {/* Sign In Link */}
                            <View style={styles.signinContainer}>
                                <Text style={styles.signinText}>Already have an account? </Text>
                                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                    <Text style={styles.signinLink}>Sign In</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: spacing.xl,
        paddingTop: 60,
        paddingBottom: 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: spacing.xxl,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: '#fff',
        marginTop: spacing.md,
        marginBottom: spacing.xs,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.9)',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: spacing.xl,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
        maxWidth: 600,
        width: '100%',
        alignSelf: 'center',
    },
    cardContent: {
        gap: spacing.lg,
    },
    inputContainer: {
        position: 'relative',
    },
    input: {
        backgroundColor: '#fff',
    },
    roleSection: {
        marginTop: spacing.sm,
    },
    roleTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        marginBottom: spacing.md,
        textAlign: 'center',
    },
    roleGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.md,
        justifyContent: 'center',
    },
    roleCardWrapper: {
        width: '45%',
        minWidth: 140,
    },
    roleCard: {
        padding: spacing.lg,
        borderRadius: borderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 100,
        position: 'relative',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    roleCardActive: {
        shadowColor: '#667eea',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    roleLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: '#666',
        marginTop: spacing.xs,
    },
    roleLabelActive: {
        color: '#fff',
    },
    checkmark: {
        position: 'absolute',
        top: 6,
        right: 6,
        backgroundColor: '#fff',
        borderRadius: 10,
    },
    errorText: {
        color: '#f44336',
        fontSize: 14,
        textAlign: 'center',
    },
    registerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 12,
        gap: spacing.sm,
        shadowColor: '#667eea',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    registerButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
    signinContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    signinText: {
        color: '#666',
        fontSize: 14,
    },
    signinLink: {
        color: '#667eea',
        fontSize: 14,
        fontWeight: '700',
    },
});

export default NewRegisterScreen;
