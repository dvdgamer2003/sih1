import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, ActivityIndicator } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useAuth } from '../context/AuthContext';
import { spacing, borderRadius } from '../theme';

const NewLoginScreen = ({ navigation }: any) => {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async () => {
        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await login(email, password);
        } catch (e: any) {
            setError(e?.response?.data?.message || 'Login failed. Please try again.');
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
                        <MaterialCommunityIcons name="school" size={80} color="#fff" />
                        <Text style={styles.title}>Welcome Back!</Text>
                        <Text style={styles.subtitle}>Sign in to continue learning</Text>
                    </Animated.View>

                    {/* Form Card */}
                    <Animated.View entering={FadeInUp.delay(200).duration(600)} style={styles.card}>
                        <View style={styles.cardContent}>
                            {/* Email Input */}
                            <View style={styles.inputContainer}>
                                <MaterialCommunityIcons name="email-outline" size={20} color="#667eea" style={styles.inputIcon} />
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
                                />
                            </View>

                            {/* Password Input */}
                            <View style={styles.inputContainer}>
                                <MaterialCommunityIcons name="lock-outline" size={20} color="#667eea" style={styles.inputIcon} />
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
                                    right={
                                        <TextInput.Icon
                                            icon={showPassword ? 'eye-off' : 'eye'}
                                            onPress={() => setShowPassword(!showPassword)}
                                        />
                                    }
                                />
                            </View>

                            {/* Error Message */}
                            {error ? (
                                <Text style={styles.errorText}>{error}</Text>
                            ) : null}

                            {/* Login Button */}
                            <TouchableOpacity
                                onPress={handleLogin}
                                disabled={loading}
                                activeOpacity={0.8}
                            >
                                <LinearGradient
                                    colors={['#667eea', '#764ba2']}
                                    style={styles.loginButton}
                                >
                                    {loading ? (
                                        <ActivityIndicator color="#fff" />
                                    ) : (
                                        <>
                                            <Text style={styles.loginButtonText}>Sign In</Text>
                                            <MaterialCommunityIcons name="arrow-right" size={24} color="#fff" />
                                        </>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>

                            {/* Guest Login */}
                            <TouchableOpacity
                                style={styles.guestButton}
                                onPress={() => navigation.navigate('Main')}
                            >
                                <Text style={styles.guestButtonText}>Continue as Guest</Text>
                            </TouchableOpacity>

                            {/* Sign Up Link */}
                            <View style={styles.signupContainer}>
                                <Text style={styles.signupText}>Don't have an account? </Text>
                                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                                    <Text style={styles.signupLink}>Sign Up</Text>
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
        maxWidth: 500,
        width: '100%',
        alignSelf: 'center',
    },
    cardContent: {
        gap: spacing.lg,
    },
    inputContainer: {
        position: 'relative',
    },
    inputIcon: {
        position: 'absolute',
        left: 12,
        top: 20,
        zIndex: 1,
    },
    input: {
        backgroundColor: '#fff',
    },
    errorText: {
        color: '#f44336',
        fontSize: 14,
        textAlign: 'center',
    },
    loginButton: {
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
    loginButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
    guestButton: {
        paddingVertical: 16,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#667eea',
        alignItems: 'center',
    },
    guestButtonText: {
        color: '#667eea',
        fontSize: 16,
        fontWeight: '600',
    },
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    signupText: {
        color: '#666',
        fontSize: 14,
    },
    signupLink: {
        color: '#667eea',
        fontSize: 14,
        fontWeight: '700',
    },
});

export default NewLoginScreen;
