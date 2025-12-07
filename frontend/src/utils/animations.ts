import { Easing } from 'react-native-reanimated';

// Reusable animation presets for Reanimated
export const animations = {
    // Fade animations
    fadeIn: {
        duration: 250,
        easing: Easing.out(Easing.ease),
    },
    fadeOut: {
        duration: 200,
        easing: Easing.in(Easing.ease),
    },

    // Scale animations
    scaleIn: {
        duration: 250,
        easing: Easing.out(Easing.back(1.5)),
    },
    scaleOut: {
        duration: 200,
        easing: Easing.in(Easing.ease),
    },

    // Slide animations
    slideInRight: {
        duration: 300,
        easing: Easing.out(Easing.exp),
    },
    slideInLeft: {
        duration: 300,
        easing: Easing.out(Easing.exp),
    },
    slideInUp: {
        duration: 300,
        easing: Easing.out(Easing.exp),
    },
    slideInDown: {
        duration: 300,
        easing: Easing.out(Easing.exp),
    },

    // Spring animations
    spring: {
        damping: 15,
        stiffness: 150,
        mass: 1,
    },
    springBouncy: {
        damping: 10,
        stiffness: 100,
        mass: 1,
    },

    // Button press
    buttonPress: {
        duration: 100,
        easing: Easing.inOut(Easing.ease),
    },

    // Card hover
    cardHover: {
        duration: 200,
        easing: Easing.out(Easing.ease),
    },
};

// Stagger delay calculator
export const getStaggerDelay = (index: number, baseDelay: number = 50): number => {
    return index * baseDelay;
};

// Scale values
export const scaleValues = {
    pressed: 0.97,
    normal: 1,
    hover: 1.02,
};
