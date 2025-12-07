import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';
import { spacing } from '../theme';

const { width } = Dimensions.get('window');
const isWeb = width > 768;

const FEATURES = [
    {
        id: 1,
        icon: 'lightning-bolt',
        title: 'Track Your Streaks',
        description: 'Build daily habits and maintain your learning streak. Consistency is the key to success!',
        gradient: ['#667eea', '#764ba2'] as readonly [string, string],
    },
    {
        id: 2,
        icon: 'trophy-variant',
        title: 'Earn Rewards',
        description: 'Unlock badges, collect XP, and level up as you progress through your learning journey.',
        gradient: ['#f093fb', '#f5576c'] as readonly [string, string],
    },
    {
        id: 3,
        icon: 'rocket-launch',
        title: 'Learn Anywhere',
        description: 'Access your lessons offline. Learn at your own pace, anytime, anywhere.',
        gradient: ['#4facfe', '#00f2fe'] as readonly [string, string],
    },
];

const WebLandingPage = ({ navigation }: any) => {
    const [currentFeature, setCurrentFeature] = useState(0);

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Hero Section */}
            <LinearGradient
                colors={['#667eea', '#764ba2']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.hero}
            >
                {/* Decorative circles */}
                <View style={[styles.decorativeCircle, { top: -100, right: -100, width: 300, height: 300 }]} />
                <View style={[styles.decorativeCircle, { bottom: -80, left: -80, width: 250, height: 250 }]} />

                <View style={styles.heroContent}>
                    <Animated.View entering={FadeInDown.duration(800)} style={styles.logoContainer}>
                        <MaterialCommunityIcons name="school" size={120} color="#fff" />
                    </Animated.View>

                    <Animated.View entering={FadeInUp.delay(200).duration(800)}>
                        <Text style={styles.heroTitle}>Welcome to StreakWise</Text>
                        <Text style={styles.heroSubtitle}>
                            Your Personal Learning Companion
                        </Text>
                        <Text style={styles.heroDescription}>
                            Track streaks, earn rewards, and master subjects from Class 6 to 12.
                            Learn offline, anytime, anywhere.
                        </Text>
                    </Animated.View>

                    <Animated.View entering={FadeInUp.delay(400).duration(800)} style={styles.ctaContainer}>
                        <TouchableOpacity
                            style={styles.primaryButton}
                            onPress={() => navigation.navigate('Register')}
                        >
                            <LinearGradient
                                colors={['#fff', '#f0f0f0']}
                                style={styles.buttonGradient}
                            >
                                <Text style={styles.primaryButtonText}>Get Started Free</Text>
                                <MaterialCommunityIcons name="arrow-right" size={24} color="#667eea" />
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.secondaryButton}
                            onPress={() => navigation.navigate('Login')}
                        >
                            <Text style={styles.secondaryButtonText}>Sign In</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </LinearGradient>

            {/* Features Section */}
            <View style={styles.featuresSection}>
                <Animated.View entering={FadeInUp.delay(600).duration(800)}>
                    <Text style={styles.sectionTitle}>Why Choose StreakWise?</Text>
                    <Text style={styles.sectionSubtitle}>
                        Everything you need to excel in your studies
                    </Text>
                </Animated.View>

                <View style={styles.featuresGrid}>
                    {FEATURES.map((feature, index) => (
                        <Animated.View
                            key={feature.id}
                            entering={ZoomIn.delay(800 + index * 150).duration(600)}
                            style={styles.featureCard}
                        >
                            <LinearGradient
                                colors={feature.gradient}
                                style={styles.featureIconContainer}
                            >
                                <MaterialCommunityIcons
                                    name={feature.icon as any}
                                    size={48}
                                    color="#fff"
                                />
                            </LinearGradient>
                            <Text style={styles.featureTitle}>{feature.title}</Text>
                            <Text style={styles.featureDescription}>{feature.description}</Text>
                        </Animated.View>
                    ))}
                </View>
            </View>

            {/* Stats Section */}
            <LinearGradient
                colors={['#f093fb', '#f5576c']}
                style={styles.statsSection}
            >
                <View style={styles.statsGrid}>
                    <Animated.View entering={FadeInUp.delay(1200).duration(600)} style={styles.statCard}>
                        <Text style={styles.statNumber}>7</Text>
                        <Text style={styles.statLabel}>Classes</Text>
                        <Text style={styles.statSubtext}>6th to 12th</Text>
                    </Animated.View>

                    <Animated.View entering={FadeInUp.delay(1350).duration(600)} style={styles.statCard}>
                        <Text style={styles.statNumber}>100+</Text>
                        <Text style={styles.statLabel}>Chapters</Text>
                        <Text style={styles.statSubtext}>Across subjects</Text>
                    </Animated.View>

                    <Animated.View entering={FadeInUp.delay(1500).duration(600)} style={styles.statCard}>
                        <Text style={styles.statNumber}>∞</Text>
                        <Text style={styles.statLabel}>Practice</Text>
                        <Text style={styles.statSubtext}>Unlimited quizzes</Text>
                    </Animated.View>
                </View>
            </LinearGradient>

            {/* CTA Section */}
            <View style={styles.ctaSection}>
                <Animated.View entering={FadeInUp.delay(1650).duration(800)}>
                    <Text style={styles.ctaTitle}>Ready to Start Learning?</Text>
                    <Text style={styles.ctaSubtitle}>
                        Join thousands of students improving their grades
                    </Text>

                    <TouchableOpacity
                        style={styles.finalCta}
                        onPress={() => navigation.navigate('Register')}
                    >
                        <LinearGradient
                            colors={['#667eea', '#764ba2']}
                            style={styles.finalCtaGradient}
                        >
                            <Text style={styles.finalCtaText}>Create Free Account</Text>
                            <MaterialCommunityIcons name="rocket-launch" size={24} color="#fff" />
                        </LinearGradient>
                    </TouchableOpacity>
                </Animated.View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <Text style={styles.footerText}>© 2024 StreakWise. All rights reserved.</Text>
                <Text style={styles.footerSubtext}>Learn smarter, not harder.</Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    hero: {
        minHeight: isWeb ? 600 : 500,
        paddingTop: 80,
        paddingBottom: 60,
        paddingHorizontal: spacing.xl,
        overflow: 'hidden',
        position: 'relative',
    },
    decorativeCircle: {
        position: 'absolute',
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 1000,
    },
    heroContent: {
        alignItems: 'center',
        zIndex: 1,
    },
    logoContainer: {
        marginBottom: spacing.xl,
    },
    heroTitle: {
        fontSize: isWeb ? 56 : 40,
        fontWeight: '900',
        color: '#fff',
        textAlign: 'center',
        marginBottom: spacing.md,
        letterSpacing: -1,
    },
    heroSubtitle: {
        fontSize: isWeb ? 28 : 22,
        fontWeight: '700',
        color: 'rgba(255,255,255,0.95)',
        textAlign: 'center',
        marginBottom: spacing.md,
    },
    heroDescription: {
        fontSize: isWeb ? 18 : 16,
        color: 'rgba(255,255,255,0.9)',
        textAlign: 'center',
        lineHeight: 26,
        maxWidth: 600,
        marginBottom: spacing.xxl,
    },
    ctaContainer: {
        flexDirection: isWeb ? 'row' : 'column',
        gap: spacing.md,
        alignItems: 'center',
    },
    primaryButton: {
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 10,
    },
    buttonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 18,
        paddingHorizontal: 32,
        gap: spacing.sm,
    },
    primaryButtonText: {
        fontSize: 18,
        fontWeight: '800',
        color: '#667eea',
    },
    secondaryButton: {
        paddingVertical: 18,
        paddingHorizontal: 32,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.5)',
    },
    secondaryButtonText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
    },
    featuresSection: {
        padding: spacing.xxl,
        backgroundColor: '#F5F7FA',
    },
    sectionTitle: {
        fontSize: isWeb ? 42 : 32,
        fontWeight: '900',
        color: '#1A1A1A',
        textAlign: 'center',
        marginBottom: spacing.sm,
    },
    sectionSubtitle: {
        fontSize: isWeb ? 20 : 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: spacing.xxl,
    },
    featuresGrid: {
        flexDirection: isWeb ? 'row' : 'column',
        flexWrap: 'wrap',
        gap: spacing.xl,
        justifyContent: 'center',
        maxWidth: 1200,
        alignSelf: 'center',
    },
    featureCard: {
        flex: isWeb ? 1 : undefined,
        minWidth: isWeb ? 300 : undefined,
        backgroundColor: '#fff',
        padding: spacing.xl,
        borderRadius: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    featureIconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    featureTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#1A1A1A',
        marginBottom: spacing.sm,
        textAlign: 'center',
    },
    featureDescription: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 24,
    },
    statsSection: {
        padding: spacing.xxl,
    },
    statsGrid: {
        flexDirection: isWeb ? 'row' : 'column',
        gap: spacing.xl,
        justifyContent: 'center',
        maxWidth: 1000,
        alignSelf: 'center',
    },
    statCard: {
        flex: 1,
        alignItems: 'center',
        padding: spacing.xl,
    },
    statNumber: {
        fontSize: isWeb ? 64 : 48,
        fontWeight: '900',
        color: '#fff',
        marginBottom: spacing.sm,
    },
    statLabel: {
        fontSize: 24,
        fontWeight: '700',
        color: '#fff',
        marginBottom: spacing.xs,
    },
    statSubtext: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.9)',
    },
    ctaSection: {
        padding: spacing.xxl,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    ctaTitle: {
        fontSize: isWeb ? 42 : 32,
        fontWeight: '900',
        color: '#1A1A1A',
        textAlign: 'center',
        marginBottom: spacing.sm,
    },
    ctaSubtitle: {
        fontSize: isWeb ? 20 : 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: spacing.xxl,
    },
    finalCta: {
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#667eea',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 10,
    },
    finalCtaGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 40,
        gap: spacing.sm,
    },
    finalCtaText: {
        fontSize: 20,
        fontWeight: '800',
        color: '#fff',
    },
    footer: {
        padding: spacing.xxl,
        backgroundColor: '#1A1A1A',
        alignItems: 'center',
    },
    footerText: {
        fontSize: 14,
        color: '#fff',
        marginBottom: spacing.xs,
    },
    footerSubtext: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.6)',
    },
});

export default WebLandingPage;
