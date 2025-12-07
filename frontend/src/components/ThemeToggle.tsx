import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, withSpring, withSequence } from 'react-native-reanimated';
import { useAppTheme } from '../context/ThemeContext';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const ThemeToggle = () => {
    const { isDark, toggleTheme } = useAppTheme();

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    rotate: withSequence(
                        withSpring('0deg'),
                        withSpring('360deg')
                    ),
                },
            ],
        };
    });

    return (
        <AnimatedTouchable
            onPress={toggleTheme}
            style={styles.toggleButton}
            activeOpacity={0.7}
        >
            <MaterialCommunityIcons
                name={isDark ? 'weather-sunny' : 'weather-night'}
                size={24}
                color="#fff"
            />
        </AnimatedTouchable>
    );
};

const styles = StyleSheet.create({
    toggleButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
});

export default ThemeToggle;
