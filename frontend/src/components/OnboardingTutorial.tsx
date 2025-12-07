import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Modal, ScrollView } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from './ui/CustomButton';
import CustomCard from './ui/CustomCard';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { spacing } from '../theme';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

interface OnboardingSlide {
    icon: string;
    title: string;
    description: string;
}

const slides: OnboardingSlide[] = [
    {
        icon: 'book-open-page-variant',
        title: 'Learn at Your Pace',
        description: 'Explore subjects like Math and Science with interactive lessons designed for rural learners.',
    },
    {
        icon: 'gamepad-variant',
        title: 'Play & Learn',
        description: 'Engage with fun educational games that make learning enjoyable and memorable.',
    },
    {
        icon: 'trophy',
        title: 'Track Your Progress',
        description: 'Earn XP, level up, and maintain streaks to stay motivated on your learning journey.',
    },
];

interface OnboardingTutorialProps {
    onComplete: () => void;
}

const OnboardingTutorial: React.FC<OnboardingTutorialProps> = ({ onComplete }) => {
    const theme = useTheme();
    const [currentSlide, setCurrentSlide] = useState(0);

    const handleNext = () => {
        if (currentSlide < slides.length - 1) {
            setCurrentSlide(currentSlide + 1);
        } else {
            handleComplete();
        }
    };

    const handleSkip = () => {
        handleComplete();
    };

    const handleComplete = async () => {
        await AsyncStorage.setItem('onboardingCompleted', 'true');
        onComplete();
    };

    const slide = slides[currentSlide];

    return (
        <Modal visible={true} animationType="fade" transparent={true}>
            <View style={styles.overlay}>
                <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.container}>
                    <CustomCard elevation={5} style={styles.card}>
                        <ScrollView contentContainerStyle={styles.scrollContent}>
                            <View style={styles.iconContainer}>
                                <MaterialCommunityIcons
                                    name={slide.icon as any}
                                    size={80}
                                    color={theme.colors.primary}
                                />
                            </View>
                            <Text variant="headlineMedium" style={styles.title}>
                                {slide.title}
                            </Text>
                            <Text variant="bodyLarge" style={styles.description}>
                                {slide.description}
                            </Text>

                            {/* Progress Indicators */}
                            <View style={styles.indicatorContainer}>
                                {slides.map((_, index) => (
                                    <View
                                        key={index}
                                        style={[
                                            styles.indicator,
                                            {
                                                backgroundColor:
                                                    index === currentSlide
                                                        ? theme.colors.primary
                                                        : 'rgba(0, 0, 0, 0.2)',
                                            },
                                        ]}
                                    />
                                ))}
                            </View>

                            {/* Buttons */}
                            <View style={styles.buttonContainer}>
                                {currentSlide < slides.length - 1 ? (
                                    <>
                                        <CustomButton
                                            variant="text"
                                            size="medium"
                                            onPress={handleSkip}
                                            style={styles.skipButton}
                                        >
                                            Skip
                                        </CustomButton>
                                        <CustomButton
                                            variant="primary"
                                            size="medium"
                                            onPress={handleNext}
                                            icon="arrow-right"
                                            iconPosition="right"
                                        >
                                            Next
                                        </CustomButton>
                                    </>
                                ) : (
                                    <CustomButton
                                        variant="primary"
                                        size="large"
                                        onPress={handleComplete}
                                        fullWidth
                                        icon="check"
                                    >
                                        Get Started
                                    </CustomButton>
                                )}
                            </View>
                        </ScrollView>
                    </CustomCard>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
    },
    container: {
        width: '100%',
        maxWidth: 500,
    },
    card: {
        padding: spacing.xl,
    },
    scrollContent: {
        alignItems: 'center',
    },
    iconContainer: {
        marginBottom: spacing.xl,
    },
    title: {
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: spacing.md,
    },
    description: {
        textAlign: 'center',
        opacity: 0.8,
        marginBottom: spacing.xxxl,
    },
    indicatorContainer: {
        flexDirection: 'row',
        gap: spacing.sm,
        marginBottom: spacing.xl,
    },
    indicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: spacing.md,
        width: '100%',
        justifyContent: 'space-between',
    },
    skipButton: {
        flex: 1,
    },
});

export default OnboardingTutorial;
