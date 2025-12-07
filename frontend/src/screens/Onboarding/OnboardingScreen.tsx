import React, { useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, StatusBar, Dimensions, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp, ZoomIn, FadeIn } from 'react-native-reanimated';
import { spacing } from '../../theme';

const { width, height } = Dimensions.get('window');

const SLIDES = [
    {
        id: 1,
        icon: 'lightning-bolt',
        title: 'Track Your Streaks',
        description: 'Build daily habits and maintain your learning streak. Consistency is the key to success!',
        gradient: ['#667eea', '#764ba2'] as readonly [string, string],
        iconBg: 'rgba(255,255,255,0.2)',
    },
    {
        id: 2,
        icon: 'trophy-variant',
        title: 'Earn Rewards',
        description: 'Unlock badges, collect XP, and level up as you progress through your learning journey.',
        gradient: ['#f093fb', '#f5576c'] as readonly [string, string],
        iconBg: 'rgba(255,255,255,0.2)',
    },
    {
        id: 3,
        icon: 'rocket-launch',
        title: 'Learn Anywhere',
        description: 'Access your lessons offline. Learn at your own pace, anytime, anywhere.',
        gradient: ['#4facfe', '#00f2fe'] as readonly [string, string],
        iconBg: 'rgba(255,255,255,0.2)',
    },
];

const OnboardingScreen = ({ navigation }: any) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const scrollViewRef = useRef<ScrollView>(null);

    const handleScroll = (event: any) => {
        const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
        setCurrentSlide(slideIndex);
    };

    const goToNextSlide = () => {
        if (currentSlide < SLIDES.length - 1) {
            scrollViewRef.current?.scrollTo({
                x: width * (currentSlide + 1),
                animated: true,
            });
        } else {
            navigation.replace('Login');
        }
    };

    const skipToLogin = () => {
        navigation.replace('Login');
    };

    const currentGradient = SLIDES[currentSlide].gradient;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={currentGradient[0]} />

            {/* Skip Button */}
            <Animated.View entering={FadeIn.delay(300)} style={styles.skipContainer}>
                <TouchableOpacity onPress={skipToLogin} style={styles.skipButton}>
                    <Text style={styles.skipText}>Skip</Text>
                </TouchableOpacity>
            </Animated.View>

            {/* Slides */}
            <ScrollView
                ref={scrollViewRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                bounces={false}
            >
                {SLIDES.map((slide, index) => (
                    <View key={slide.id} style={styles.slide}>
                        <LinearGradient
                            colors={slide.gradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.slideGradient}
                        >
                            {/* Decorative Elements */}
                            <View style={[styles.decorativeCircle, { top: -100, right: -80, width: 200, height: 200 }]} />
                            <View style={[styles.decorativeCircle, { bottom: -60, left: -60, width: 150, height: 150 }]} />
                            <View style={[styles.decorativeCircle, { top: 150, left: 30, width: 80, height: 80, opacity: 0.1 }]} />

                            {/* Icon */}
                            <Animated.View
                                entering={currentSlide === index ? ZoomIn.delay(200).duration(600) : undefined}
                                style={styles.iconContainer}
                            >
                                <View style={[styles.iconCircle, { backgroundColor: slide.iconBg }]}>
                                    <View style={styles.iconInnerCircle}>
                                        <MaterialCommunityIcons
                                            name={slide.icon as any}
                                            size={100}
                                            color="#fff"
                                        />
                                    </View>
                                </View>
                            </Animated.View>

                            {/* Content */}
                            <Animated.View
                                entering={currentSlide === index ? FadeInUp.delay(400).duration(600) : undefined}
                                style={styles.contentContainer}
                            >
                                <Text style={styles.title}>{slide.title}</Text>
                                <Text style={styles.description}>{slide.description}</Text>
                            </Animated.View>
                        </LinearGradient>
                    </View>
                ))}
            </ScrollView>

            {/* Bottom Section */}
            <LinearGradient
                colors={currentGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.bottomSection}
            >
                {/* Page Indicators */}
                <View style={styles.pagination}>
                    {SLIDES.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.paginationDot,
                                currentSlide === index && styles.paginationDotActive,
                            ]}
                        />
                    ))}
                </View>

                {/* Action Buttons */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.nextButton}
                        onPress={goToNextSlide}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.85)']}
                            style={styles.nextButtonGradient}
                        >
                            <Text style={[styles.nextButtonText, { color: currentGradient[0] }]}>
                                {currentSlide === SLIDES.length - 1 ? 'Get Started' : 'Next'}
                            </Text>
                            <MaterialCommunityIcons
                                name={currentSlide === SLIDES.length - 1 ? 'rocket-launch' : 'arrow-right'}
                                size={24}
                                color={currentGradient[0]}
                            />
                        </LinearGradient>
                    </TouchableOpacity>

                    {currentSlide === SLIDES.length - 1 && (
                        <Animated.View entering={FadeInDown.duration(400)} style={styles.signupContainer}>
                            <Text style={styles.signupText}>Don't have an account?</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                                <Text style={styles.signupLink}>Sign Up</Text>
                            </TouchableOpacity>
                        </Animated.View>
                    )}
                </View>
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    skipContainer: {
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 10,
    },
    skipButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    skipText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    slide: {
        width,
        height: height * 0.7,
    },
    slideGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        position: 'relative',
    },
    decorativeCircle: {
        position: 'absolute',
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 1000,
    },
    iconContainer: {
        marginBottom: spacing.xxl,
    },
    iconCircle: {
        width: 220,
        height: 220,
        borderRadius: 110,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    iconInnerCircle: {
        width: 180,
        height: 180,
        borderRadius: 90,
        backgroundColor: 'rgba(255,255,255,0.15)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        paddingHorizontal: spacing.xxl,
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: '#fff',
        textAlign: 'center',
        marginBottom: spacing.md,
        letterSpacing: 0.5,
        textShadowColor: 'rgba(0,0,0,0.2)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    description: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.95)',
        textAlign: 'center',
        lineHeight: 24,
        fontWeight: '500',
        paddingHorizontal: spacing.md,
    },
    bottomSection: {
        height: height * 0.3,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        paddingTop: spacing.xl,
        paddingHorizontal: spacing.xl,
        paddingBottom: spacing.xxl,
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 10,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255,255,255,0.4)',
    },
    paginationDotActive: {
        width: 32,
        backgroundColor: '#fff',
    },
    buttonContainer: {
        gap: spacing.md,
    },
    nextButton: {
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 8,
    },
    nextButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        paddingHorizontal: spacing.xl,
        gap: spacing.sm,
    },
    nextButtonText: {
        fontSize: 18,
        fontWeight: '700',
    },
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 6,
    },
    signupText: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 15,
        fontWeight: '500',
    },
    signupLink: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '800',
        textDecorationLine: 'underline',
    },
});

export default OnboardingScreen;
