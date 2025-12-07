import React from 'react';
import { StyleSheet, ViewStyle, Pressable, StyleProp } from 'react-native';
import { Surface, useTheme } from 'react-native-paper';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { shadows, borderRadius } from '../../theme';
import { useAppTheme } from '../../context/ThemeContext';
import { scaleValues } from '../../utils/animations';

const AnimatedSurface = Animated.createAnimatedComponent(Surface);
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface CustomCardProps {
    children: React.ReactNode;
    onPress?: () => void;
    elevation?: 1 | 2 | 3 | 4 | 5;
    gradient?: boolean;
    gradientColors?: readonly [string, string, ...string[]];
    style?: StyleProp<ViewStyle>;
}

const CustomCard: React.FC<CustomCardProps> = ({
    children,
    onPress,
    elevation = 2,
    gradient = false,
    gradientColors = ['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.85)'] as const,
    style,
}) => {
    const theme = useTheme();
    const { isDark } = useAppTheme();
    const scale = useSharedValue(1);

    const handlePressIn = () => {
        if (onPress) {
            scale.value = withSpring(scaleValues.pressed);
        }
    };

    const handlePressOut = () => {
        if (onPress) {
            scale.value = withSpring(scaleValues.normal);
        }
    };

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const shadowStyle = shadows[`elevation${elevation}`];

    const cardStyle = [
        styles.card,
        shadowStyle,
        style,
    ];

    if (onPress) {
        return (
            <AnimatedPressable
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={[animatedStyle, cardStyle]}
            >
                <AnimatedSurface
                    style={[styles.surface, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }]}
                    elevation={elevation as any}
                >
                    {gradient && (
                        <LinearGradient
                            colors={gradientColors}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={[StyleSheet.absoluteFill, { borderRadius: borderRadius.xl }]}
                        />
                    )}
                    {children}
                </AnimatedSurface>
            </AnimatedPressable>
        );
    }

    return (
        <AnimatedSurface
            style={[cardStyle, styles.surface, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }]}
            elevation={elevation as any}
        >
            {gradient && (
                <LinearGradient
                    colors={gradientColors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[StyleSheet.absoluteFill, { borderRadius: borderRadius.xl }]}
                />
            )}
            {children}
        </AnimatedSurface>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: borderRadius.xl,
        overflow: 'hidden',
    },
    surface: {
        borderRadius: borderRadius.xl,
        backgroundColor: '#FFFFFF',
    },
});

export default CustomCard;
