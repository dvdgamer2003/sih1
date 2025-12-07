import React from 'react';
import { StyleSheet, View, Pressable, Platform } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import { useResponsive } from '../hooks/useResponsive';
import { useAppTheme } from '../context/ThemeContext';
import { spacing, borderRadius } from '../theme';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface HomeCardProps {
    title: string;
    icon: string;
    color: string;
    onPress: () => void;
    delay?: number;
    gradient?: string[];
}

const HomeCard: React.FC<HomeCardProps> = ({ title, icon, color, onPress, gradient }) => {
    const theme = useTheme();
    const { isDark } = useAppTheme();
    const { responsiveValue } = useResponsive();

    const scale = useSharedValue(1);

    const handlePressIn = () => {
        scale.value = withSpring(0.95);
    };

    const handlePressOut = () => {
        scale.value = withSpring(1);
    };

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const cardHeight = responsiveValue(150, 170, 190);
    const iconSize = responsiveValue(32, 40, 48);
    const titleSize = responsiveValue(16, 18, 20);

    // Generate gradient if not provided based on base color
    const bgGradient = (gradient || [color, color]) as [string, string, ...string[]];

    // Determine if we should use dark text (light background) or white text (dark/gradient background)
    // For this premium design, we'll assume gradient cards should have white text
    const isGradient = !!gradient;
    const textColor = isGradient ? '#fff' : theme.colors.onSurface;
    const iconColor = isGradient ? '#fff' : color;

    return (
        <AnimatedPressable
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={[
                styles.container,
                animatedStyle,
                { height: cardHeight },
                {
                    shadowColor: color,
                    shadowOpacity: 0.25,
                    shadowOffset: { width: 0, height: 8 },
                    shadowRadius: 16,
                    elevation: 8
                }
            ]}
        >
            {isGradient ? (
                <LinearGradient
                    colors={bgGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradientBg}
                >
                    <BlurView intensity={Platform.OS === 'web' ? 10 : 20} tint="light" style={styles.content}>
                        <View style={[styles.iconContainer, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                            <MaterialCommunityIcons name={icon as any} size={iconSize} color="#fff" />
                        </View>

                        <Text
                            variant="titleMedium"
                            style={[styles.title, { fontSize: titleSize, color: '#fff' }]}
                        >
                            {title}
                        </Text>

                        <View style={styles.arrowContainer}>
                            <MaterialCommunityIcons name="chevron-right" size={24} color="rgba(255,255,255,0.8)" />
                        </View>
                    </BlurView>
                </LinearGradient>
            ) : (
                <View style={[styles.content, { backgroundColor: isDark ? '#1E293B' : '#fff', borderRadius: borderRadius.xl }]}>
                    <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
                        <MaterialCommunityIcons name={icon as any} size={iconSize} color={color} />
                    </View>

                    <Text
                        variant="titleMedium"
                        style={[styles.title, { fontSize: titleSize, color: isDark ? '#F1F5F9' : theme.colors.onSurface }]}
                    >
                        {title}
                    </Text>

                    <View style={styles.arrowContainer}>
                        <MaterialCommunityIcons name="chevron-right" size={24} color={color} />
                    </View>
                </View>
            )}
        </AnimatedPressable>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderRadius: borderRadius.xl,
        backgroundColor: '#fff',
    },
    gradientBg: {
        flex: 1,
        borderRadius: borderRadius.xl,
        overflow: 'hidden',
    },
    content: {
        flex: 1,
        padding: spacing.lg,
        justifyContent: 'space-between',
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: borderRadius.lg,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontWeight: '800',
        marginTop: spacing.md,
        letterSpacing: 0.3,
    },
    arrowContainer: {
        position: 'absolute',
        bottom: spacing.lg,
        right: spacing.lg,
    },
});

export default HomeCard;
