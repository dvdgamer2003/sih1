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

const LANGUAGES = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
    { code: 'od', label: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
];

const RegisterScreen = ({ navigation }: any) => {
    const { register } = useAuth();
    const theme = useTheme();
    const { formMaxWidth } = useResponsive();
    const { language, setLanguage, t } = useTranslation();

    // State
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'student' | 'teacher' | 'admin' | 'institute'>('student');
    const [selectedLanguage, setSelectedLanguage] = useState(language);
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
                useNativeDriver: Platform.OS !== 'web',
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: Platform.OS !== 'web',
            }),
        ]).start();
    }, []);

    const handleRegister = async () => {
        if (!name || !email || !password) {
            setError(t('register.fillAllFields') || 'Please fill in all fields');
            setSuccess(null);
            setVisible(true);
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            await register({ name, email, password, language: selectedLanguage });
            setSuccess(t('register.registerSuccess') || 'Registration successful!');
            setVisible(true);
        } catch (e: any) {
            console.error('❌ Registration error:', e);
            console.error('Error keys:', e ? Object.keys(e) : null);
            const errorMessage = e?.response?.data?.message || t('register.registerFailed') || 'Registration failed. Please try again.';
            setError(errorMessage);
            setVisible(true);
        } finally {
            setLoading(false);
        }
    };

    const handleLanguageSelect = async (lang: 'en' | 'hi' | 'od') => {
        setSelectedLanguage(lang);
        await setLanguage(lang);
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
                                <MaterialCommunityIcons name="account-plus" size={60} color="#fff" />
                            </View>
                            <Text variant="headlineMedium" style={styles.title}>
                                {t('register.title') || 'Create Account'}
                            </Text>
                            <Text variant="bodyLarge" style={styles.subtitle}>
                                {t('register.subtitle') || 'Join us and start learning'}
                            </Text>
                        </View>

                        {/* Form Card */}
                        <BlurView intensity={Platform.OS === 'web' ? 30 : 50} tint="light" style={styles.card}>
                            <View style={styles.cardContent}>

                                {/* Inputs */}
                                <CustomInput
                                    label={t('register.fullName') || 'Full Name'}
                                    value={name}
                                    onChangeText={setName}
                                    icon={<MaterialCommunityIcons name="account-outline" size={20} color={theme.colors.primary} />}
                                />

                                <CustomInput
                                    label={t('register.email') || 'Email'}
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    icon={<MaterialCommunityIcons name="email-outline" size={20} color={theme.colors.primary} />}
                                />

                                <CustomInput
                                    label={t('register.password') || 'Password'}
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                    icon={<MaterialCommunityIcons name="lock-outline" size={20} color={theme.colors.primary} />}
                                    rightIcon={showPassword ? "eye-off" : "eye"}
                                    onRightIconPress={() => setShowPassword(!showPassword)}
                                />

                                {/* Role Selection */}
                                <Text style={styles.sectionLabel}>Who are you?</Text>
                                <View style={styles.roleDropdownContainer}>
                                    {[
                                        { value: 'student', label: 'Student', icon: 'account-school' },
                                        { value: 'teacher', label: 'Teacher', icon: 'human-male-board' },
                                        { value: 'institute', label: 'Institute', icon: 'office-building' },
                                        { value: 'admin', label: 'Admin', icon: 'shield-account' },
                                    ].map((option) => (
                                        <TouchableOpacity
                                            key={option.value}
                                            style={[
                                                styles.roleOption,
                                                role === option.value && styles.roleOptionActive
                                            ]}
                                            onPress={() => setRole(option.value as any)}
                                            activeOpacity={0.7}
                                        >
                                            <MaterialCommunityIcons
                                                name={option.icon as any}
                                                size={24}
                                                color={role === option.value ? '#fff' : '#666'}
                                            />
                                            <Text style={[
                                                styles.roleOptionText,
                                                role === option.value && styles.roleOptionTextActive
                                            ]}>
                                                {option.label}
                                            </Text>
                                            {role === option.value && (
                                                <MaterialCommunityIcons name="check-circle" size={20} color="#fff" />
                                            )}
                                        </TouchableOpacity>
                                    ))}
                                </View>

                                {/* Language Selection */}
                                <Text style={styles.sectionLabel}>{t('register.selectLanguage') || 'Select Language'}</Text>
                                <View style={styles.languageContainer}>
                                    {LANGUAGES.map((lang) => (
                                        <TouchableOpacity
                                            key={lang.code}
                                            style={[
                                                styles.languageButton,
                                                selectedLanguage === lang.code && styles.languageButtonActive
                                            ]}
                                            onPress={() => handleLanguageSelect(lang.code as 'en' | 'hi' | 'od')}
                                            activeOpacity={0.8}
                                        >
                                            <Text style={styles.languageFlag}>{lang.flag}</Text>
                                            <Text style={[
                                                styles.languageText,
                                                selectedLanguage === lang.code && styles.languageTextActive
                                            ]}>
                                                {lang.label}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>

                                {/* Register Button */}
                                <Button
                                    mode="contained"
                                    onPress={handleRegister}
                                    loading={loading}
                                    disabled={loading}
                                    style={styles.registerButton}
                                    contentStyle={styles.registerButtonContent}
                                    labelStyle={styles.registerButtonLabel}
                                >
                                    {t('register.registerButton') || 'Register'}
                                </Button>

                                {/* Login Link */}
                                <View style={styles.footer}>
                                    <Text style={styles.footerText}>{t('register.haveAccount') || "Already have an account?"} </Text>
                                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                        <Text style={styles.loginLink}>
                                            {t('register.loginNow') || 'Login Now'}
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
                    duration={3000}
                    action={{
                        label: 'OK',
                        onPress: () => setVisible(false),
                        textColor: '#fff'
                    }}
                    style={{ backgroundColor: error ? theme.colors.error : theme.colors.primary }}
                >
                    {error || success}
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
    roleDropdownContainer: {
        gap: spacing.sm,
        marginBottom: spacing.lg,
    },
    roleOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        borderRadius: borderRadius.md,
        backgroundColor: '#f5f5f5',
        borderWidth: 2,
        borderColor: '#e0e0e0',
        gap: spacing.sm,
    },
    roleOptionActive: {
        backgroundColor: '#3b5998',
        borderColor: '#3b5998',
    },
    roleOptionText: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    roleOptionTextActive: {
        color: '#fff',
    },
    languageContainer: {
        flexDirection: 'row',
        gap: spacing.sm,
        marginBottom: spacing.xl,
        flexWrap: 'wrap',
    },
    languageButton: {
        flex: 1,
        minWidth: 90,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.sm,
        borderRadius: borderRadius.md,
        backgroundColor: '#f0f0f0',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        gap: 4,
    },
    languageButtonActive: {
        backgroundColor: '#3b5998',
        borderColor: '#3b5998',
    },
    languageFlag: {
        fontSize: 16,
    },
    languageText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    languageTextActive: {
        color: '#fff',
    },
    registerButton: {
        borderRadius: borderRadius.lg,
        backgroundColor: '#3b5998',
        marginBottom: spacing.lg,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    registerButtonContent: {
        height: 50,
    },
    registerButtonLabel: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: spacing.sm,
    },
    footerText: {
        color: '#333',
        fontSize: 15,
    },
    loginLink: {
        color: '#3b5998',
        fontWeight: 'bold',
        fontSize: 15,
        textDecorationLine: 'underline',
    },
});

export default RegisterScreen;
