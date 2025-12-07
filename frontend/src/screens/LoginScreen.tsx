import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    TouchableOpacity,
    Animated,
    Dimensions
} from 'react-native';
import { Text, Snackbar, useTheme, Button } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useAuth } from '../context/AuthContext';
import { useResponsive } from '../hooks/useResponsive';
import { useTranslation } from '../i18n';
import CustomInput from '../components/ui/CustomInput';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { spacing, borderRadius } from '../theme';

const { width } = Dimensions.get('window');

const LoginScreen = ({ navigation }: any) => {
    const { login, loginAsGuest } = useAuth();
    const theme = useTheme();
    const { formMaxWidth } = useResponsive();
    const { t } = useTranslation();

    // State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'student' | 'teacher'>('student');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [visible, setVisible] = useState(false);

    // Animations
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: Platform.OS !== 'web', // Web driver support varies
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: Platform.OS !== 'web',
            }),
        ]).start();
    }, []);

    const handleLogin = async () => {
        if (!email || !password) {
            setError(t('login.fillAllFields') || 'Please fill in all fields');
            setSuccess(null);
            setVisible(true);
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            await login(email, password, role);
            setSuccess(t('login.loginSuccess') || 'Login successful!');
            setVisible(true);
        } catch (e: any) {
            console.error('Login error:', e);

            // Determine error type and show appropriate message
            let errorMessage = t('login.loginFailed') || 'Login failed. Please try again.';

            if (e?.isNetworkError || e?.message?.includes('Network error')) {
                errorMessage = '🌐 Cannot connect to server. Please check:\n• Backend server is running\n• API URL is correct\n• Network connection is active';
            } else if (e?.response?.data?.message) {
                errorMessage = e.response.data.message;
            } else if (e?.message) {
                errorMessage = e.message;
            }

            setError(errorMessage);
            setVisible(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

            {/* Background Gradient */}
            <LinearGradient
                colors={['#4c669f', '#3b5998', '#192f6a']}
                style={StyleSheet.absoluteFillObject}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.keyboardAvoidingView}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <Animated.View
                        style={[
                            styles.contentWrapper,
                            {
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }],
                                maxWidth: formMaxWidth,
                            }
                        ]}
                    >
                        {/* Header Section */}
                        <View style={styles.header}>
                            <View style={styles.iconCircle}>
                                <MaterialCommunityIcons name="school" size={60} color="#fff" />
                            </View>
                            <Text variant="headlineMedium" style={styles.title}>
                                {t('login.title') || 'Welcome Back'}
                            </Text>
                            <Text variant="bodyLarge" style={styles.subtitle}>
                                {t('login.subtitle') || 'Login to continue learning'}
                            </Text>
                        </View>

                        {/* Form Card */}
                        <BlurView intensity={Platform.OS === 'web' ? 30 : 50} tint="light" style={styles.card}>
                            <View style={styles.cardContent}>


                                {/* Inputs */}
                                <CustomInput
                                    label={t('login.email') || 'Email'}
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    icon={<MaterialCommunityIcons name="email-outline" size={20} color={theme.colors.primary} />}
                                />

                                <CustomInput
                                    label={t('login.password') || 'Password'}
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                    icon={<MaterialCommunityIcons name="lock-outline" size={20} color={theme.colors.primary} />}
                                    rightIcon={showPassword ? "eye-off" : "eye"}
                                    onRightIconPress={() => setShowPassword(!showPassword)}
                                />

                                <TouchableOpacity style={styles.forgotPassword}>
                                    <Text style={styles.forgotPasswordText}>
                                        {t('login.forgotPassword') || 'Forgot Password?'}
                                    </Text>
                                </TouchableOpacity>

                                {/* Login Button */}
                                <Button
                                    mode="contained"
                                    onPress={handleLogin}
                                    loading={loading}
                                    disabled={loading}
                                    style={styles.loginButton}
                                    contentStyle={styles.loginButtonContent}
                                    labelStyle={styles.loginButtonLabel}
                                >
                                    {t('login.loginButton') || 'Login'}
                                </Button>

                                {/* Divider */}
                                <View style={styles.dividerContainer}>
                                    <View style={styles.dividerLine} />
                                    <Text style={styles.dividerText}>{t('common.or') || 'OR'}</Text>
                                    <View style={styles.dividerLine} />
                                </View>

                                {/* Guest Button */}
                                <Button
                                    mode="outlined"
                                    onPress={loginAsGuest}
                                    style={styles.guestButton}
                                    textColor="#fff"
                                    labelStyle={{ fontWeight: '600' }}
                                >
                                    {t('login.guestButton') || 'Continue as Guest'}
                                </Button>

                                {/* Register Link */}
                                <View style={styles.footer}>
                                    <Text style={styles.footerText}>{t('login.noAccount') || "Don't have an account?"} </Text>
                                    <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                                        <Text style={styles.registerLink}>
                                            {t('login.registerNow') || 'Register Now'}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </BlurView>
                    </Animated.View>
                </ScrollView>

                <Snackbar
                    visible={visible}
                    onDismiss={() => setVisible(false)}
                    duration={5000}
                    action={{
                        label: 'OK',
                        onPress: () => setVisible(false),
                        textColor: '#fff'
                    }}
                    style={{ backgroundColor: error ? theme.colors.error : theme.colors.primary }}
                >
                    <Text style={{ color: '#fff' }}>{error || success}</Text>
                </Snackbar>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center', // Added to center content
        padding: spacing.lg,
        paddingTop: Platform.OS === 'web' ? spacing.xl : spacing.xxxl,
    },
    contentWrapper: {
        width: '100%',
        alignSelf: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    iconCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.md,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    title: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: spacing.xs,
    },
    subtitle: {
        color: 'rgba(255,255,255,0.8)',
        textAlign: 'center',
    },
    card: {
        borderRadius: borderRadius.xl,
        overflow: 'hidden',
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    cardContent: {
        padding: spacing.xl,
        backgroundColor: 'rgba(255,255,255,0.7)', // Fallback/Overlay for readability
    },
    sectionLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: spacing.sm,
        marginLeft: spacing.xs,
    },
    roleContainer: {
        flexDirection: 'row',
        gap: spacing.md,
        marginBottom: spacing.lg,
    },
    roleButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.sm,
        borderRadius: borderRadius.lg,
        backgroundColor: '#f0f0f0',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        gap: 8,
    },
    roleButtonActive: {
        backgroundColor: '#3b5998', // Primary color
        borderColor: '#3b5998',
    },
    roleText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    roleTextActive: {
        color: '#fff',
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: spacing.lg,
        marginTop: -spacing.sm,
    },
    forgotPasswordText: {
        color: '#3b5998',
        fontWeight: '600',
    },
    loginButton: {
        borderRadius: borderRadius.lg,
        backgroundColor: '#3b5998',
        marginBottom: spacing.lg,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    loginButtonContent: {
        height: 50,
    },
    loginButtonLabel: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#ccc',
    },
    dividerText: {
        marginHorizontal: spacing.md,
        color: '#666',
        fontWeight: '500',
    },
    guestButton: {
        borderColor: '#3b5998',
        borderWidth: 1.5,
        backgroundColor: 'rgba(59, 89, 152, 0.8)', // Semi-transparent primary
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: spacing.xl,
    },
    footerText: {
        color: '#333',
        fontSize: 15,
    },
    registerLink: {
        color: '#3b5998',
        fontWeight: 'bold',
        fontSize: 15,
        textDecorationLine: 'underline',
    },
});

export default LoginScreen;
