import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Alert } from 'react-native';
import { Text, Switch, useTheme, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { spacing } from '../theme';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import CustomButton from '../components/ui/CustomButton';

import { useResponsive } from '../hooks/useResponsive';

const PrivacySecurityScreen = ({ navigation }: any) => {
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const { containerStyle } = useResponsive();

    // Privacy Settings
    const [profileVisibility, setProfileVisibility] = useState(true);
    const [showProgress, setShowProgress] = useState(true);
    const [allowAnalytics, setAllowAnalytics] = useState(true);
    const [personalizedAds, setPersonalizedAds] = useState(false);

    // Security Settings
    const [twoFactorAuth, setTwoFactorAuth] = useState(false);
    const [biometricLogin, setBiometricLogin] = useState(false);
    const [sessionTimeout, setSessionTimeout] = useState(true);

    const SettingItem = ({ icon, title, description, onPress, rightComponent, gradient }: any) => (
        <TouchableOpacity
            onPress={onPress}
            disabled={!onPress}
            activeOpacity={0.7}
            style={styles.settingItem}
        >
            <LinearGradient
                colors={gradient || ['#F5F5F5', '#E0E0E0']}
                style={styles.settingIconContainer}
            >
                <MaterialCommunityIcons name={icon} size={24} color={gradient ? '#fff' : '#666'} />
            </LinearGradient>
            <View style={styles.settingContent}>
                <Text variant="titleMedium" style={styles.settingTitle}>{title}</Text>
                {description && (
                    <Text variant="bodySmall" style={styles.settingDescription}>{description}</Text>
                )}
            </View>
            {rightComponent || (
                <MaterialCommunityIcons name="chevron-right" size={24} color="#999" />
            )}
        </TouchableOpacity>
    );

    const handleChangePassword = () => {
        Alert.alert(
            'Change Password',
            'You will receive an email with instructions to reset your password.',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Send Email', onPress: () => Alert.alert('Success', 'Password reset email sent!') }
            ]
        );
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            'Delete Account',
            'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => Alert.alert('Account Deletion', 'Please contact support to delete your account.')
                }
            ]
        );
    };

    const handleExportData = () => {
        Alert.alert(
            'Export Data',
            'Your data will be prepared and sent to your registered email address within 24 hours.',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Export', onPress: () => Alert.alert('Success', 'Data export request submitted!') }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

            {/* Header */}
            <LinearGradient
                colors={['#667EEA', '#764BA2', '#5B4B8A']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.headerBackground, { paddingTop: insets.top + spacing.md }]}
            >
                {/* Decorative circles */}
                <View style={[styles.decorativeCircle, { top: -60, right: -40, width: 180, height: 180 }]} />
                <View style={[styles.decorativeCircle, { bottom: -50, left: -30, width: 150, height: 150 }]} />

                <View style={[styles.headerContent, containerStyle]}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.backButton}
                        activeOpacity={0.7}
                    >
                        <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text variant="headlineMedium" style={styles.headerTitle}>Privacy & Security</Text>
                    <View style={{ width: 44 }} />
                </View>
            </LinearGradient>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={[styles.scrollContent, containerStyle]}
                showsVerticalScrollIndicator={false}
            >
                {/* Privacy Settings */}
                <Animated.View entering={FadeInDown.delay(100).duration(600)}>
                    <Text variant="titleSmall" style={styles.sectionTitle}>PRIVACY</Text>
                    <Surface style={styles.section} elevation={2}>
                        <SettingItem
                            icon="account-eye"
                            title="Profile Visibility"
                            description="Allow others to see your profile"
                            gradient={profileVisibility ? ['#10B981', '#059669'] : undefined}
                            rightComponent={
                                <Switch
                                    value={profileVisibility}
                                    onValueChange={setProfileVisibility}
                                    color="#667EEA"
                                />
                            }
                        />
                        <View style={styles.divider} />
                        <SettingItem
                            icon="chart-line"
                            title="Show Progress"
                            description="Display your learning progress publicly"
                            gradient={showProgress ? ['#3B82F6', '#2563EB'] : undefined}
                            rightComponent={
                                <Switch
                                    value={showProgress}
                                    onValueChange={setShowProgress}
                                    color="#667EEA"
                                />
                            }
                        />
                        <View style={styles.divider} />
                        <SettingItem
                            icon="chart-box"
                            title="Analytics"
                            description="Help us improve by sharing usage data"
                            gradient={allowAnalytics ? ['#8B5CF6', '#7C3AED'] : undefined}
                            rightComponent={
                                <Switch
                                    value={allowAnalytics}
                                    onValueChange={setAllowAnalytics}
                                    color="#667EEA"
                                />
                            }
                        />
                        <View style={styles.divider} />
                        <SettingItem
                            icon="advertisements"
                            title="Personalized Ads"
                            description="Show ads based on your interests"
                            gradient={personalizedAds ? ['#F59E0B', '#D97706'] : undefined}
                            rightComponent={
                                <Switch
                                    value={personalizedAds}
                                    onValueChange={setPersonalizedAds}
                                    color="#667EEA"
                                />
                            }
                        />
                    </Surface>
                </Animated.View>

                {/* Security Settings */}
                <Animated.View entering={FadeInDown.delay(200).duration(600)}>
                    <Text variant="titleSmall" style={styles.sectionTitle}>SECURITY</Text>
                    <Surface style={styles.section} elevation={2}>
                        <SettingItem
                            icon="two-factor-authentication"
                            title="Two-Factor Authentication"
                            description="Add an extra layer of security"
                            gradient={twoFactorAuth ? ['#10B981', '#059669'] : undefined}
                            rightComponent={
                                <Switch
                                    value={twoFactorAuth}
                                    onValueChange={setTwoFactorAuth}
                                    color="#667EEA"
                                />
                            }
                        />
                        <View style={styles.divider} />
                        <SettingItem
                            icon="fingerprint"
                            title="Biometric Login"
                            description="Use fingerprint or face recognition"
                            gradient={biometricLogin ? ['#667EEA', '#764BA2'] : undefined}
                            rightComponent={
                                <Switch
                                    value={biometricLogin}
                                    onValueChange={setBiometricLogin}
                                    color="#667EEA"
                                />
                            }
                        />
                        <View style={styles.divider} />
                        <SettingItem
                            icon="timer-sand"
                            title="Session Timeout"
                            description="Auto logout after inactivity"
                            gradient={sessionTimeout ? ['#F59E0B', '#D97706'] : undefined}
                            rightComponent={
                                <Switch
                                    value={sessionTimeout}
                                    onValueChange={setSessionTimeout}
                                    color="#667EEA"
                                />
                            }
                        />
                        <View style={styles.divider} />
                        <SettingItem
                            icon="lock-reset"
                            title="Change Password"
                            description="Update your account password"
                            onPress={handleChangePassword}
                            gradient={['#EF4444', '#DC2626']}
                        />
                    </Surface>
                </Animated.View>

                {/* Data Management */}
                <Animated.View entering={FadeInDown.delay(300).duration(600)}>
                    <Text variant="titleSmall" style={styles.sectionTitle}>DATA MANAGEMENT</Text>
                    <Surface style={styles.section} elevation={2}>
                        <SettingItem
                            icon="download"
                            title="Export Data"
                            description="Download a copy of your data"
                            onPress={handleExportData}
                            gradient={['#3B82F6', '#2563EB']}
                        />
                        <View style={styles.divider} />
                        <SettingItem
                            icon="delete-forever"
                            title="Delete Account"
                            description="Permanently delete your account"
                            onPress={handleDeleteAccount}
                            gradient={['#EF4444', '#DC2626']}
                        />
                    </Surface>
                </Animated.View>

                {/* Blocked Users */}
                <Animated.View entering={FadeInDown.delay(400).duration(600)}>
                    <Text variant="titleSmall" style={styles.sectionTitle}>BLOCKED USERS</Text>
                    <Surface style={styles.section} elevation={2}>
                        <SettingItem
                            icon="account-cancel"
                            title="Manage Blocked Users"
                            description="View and manage blocked accounts"
                            onPress={() => Alert.alert('Blocked Users', 'You have no blocked users.')}
                        />
                    </Surface>
                </Animated.View>

                {/* Info Card */}
                <Animated.View entering={FadeInDown.delay(500).duration(600)} style={styles.infoCard}>
                    <LinearGradient
                        colors={['#EFF6FF', '#DBEAFE']}
                        style={styles.infoCardGradient}
                    >
                        <MaterialCommunityIcons name="shield-check" size={32} color="#3B82F6" />
                        <Text variant="titleMedium" style={styles.infoTitle}>Your Privacy Matters</Text>
                        <Text variant="bodySmall" style={styles.infoText}>
                            We are committed to protecting your privacy and keeping your data secure.
                            You have full control over your information.
                        </Text>
                    </LinearGradient>
                </Animated.View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    headerBackground: {
        paddingBottom: spacing.xxl,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        shadowColor: '#764BA2',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
        overflow: 'hidden',
    },
    decorativeCircle: {
        position: 'absolute',
        borderRadius: 999,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
        paddingBottom: spacing.lg,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    headerTitle: {
        color: '#fff',
        fontWeight: '800',
        fontSize: 22,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: spacing.lg,
        paddingBottom: 100,
    },
    sectionTitle: {
        fontWeight: '800',
        color: '#999',
        marginBottom: spacing.md,
        marginTop: spacing.lg,
        letterSpacing: 0.5,
        paddingHorizontal: spacing.xs,
    },
    section: {
        borderRadius: 20,
        backgroundColor: '#fff',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.lg,
        gap: spacing.md,
    },
    settingIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    settingContent: {
        flex: 1,
    },
    settingTitle: {
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 2,
    },
    settingDescription: {
        color: '#666',
        fontSize: 12,
    },
    divider: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginLeft: spacing.lg + 48 + spacing.md,
    },
    infoCard: {
        marginTop: spacing.xl,
        marginBottom: spacing.lg,
    },
    infoCardGradient: {
        borderRadius: 20,
        padding: spacing.xl,
        alignItems: 'center',
    },
    infoTitle: {
        fontWeight: '700',
        color: '#1A1A1A',
        marginTop: spacing.md,
        marginBottom: spacing.sm,
    },
    infoText: {
        color: '#666',
        textAlign: 'center',
        lineHeight: 20,
    },
});

export default PrivacySecurityScreen;
