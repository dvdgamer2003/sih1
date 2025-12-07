import React from 'react';
import { StyleSheet, Pressable, View, ImageBackground } from 'react-native';
import { Surface, Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import { useResponsive } from '../hooks/useResponsive';
import { borderRadius, spacing, gradients } from '../theme';
import { LinearGradient } from 'expo-linear-gradient';

interface GameTileProps {
    title: string;
    description: string;
    color: string;
    icon: string;
    onPress: () => void;
    disabled?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const GameTile: React.FC<GameTileProps> = ({ title, description, color, icon, onPress, disabled = false }) => {
    const theme = useTheme();
    const { responsiveValue } = useResponsive();
    const scale = useSharedValue(1);
    const elevation = useSharedValue(4);

    const handlePressIn = () => {
        scale.value = withSpring(0.98);
        elevation.value = withTiming(2);
    };

    const handlePressOut = () => {
        scale.value = withSpring(1);
        elevation.value = withTiming(4);
    };

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <AnimatedPressable
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={onPress}
            disabled={disabled}
            style={[styles.container, animatedStyle]}
        >
            <Surface style={[styles.card, { borderRadius: 24, backgroundColor: color }]} elevation={4}>
                <LinearGradient
                    colors={['rgba(255,255,255,0.15)', 'rgba(0,0,0,0.1)']}
                    style={styles.gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <View style={styles.iconContainer}>
                        <MaterialCommunityIcons name={icon as any} size={140} color="#fff" />
                    </View>

                    <View style={styles.contentRow}>
                        <View style={styles.textContainer}>
                            <Text variant="headlineMedium" style={styles.title}>
                                {title}
                            </Text>
                            <Text variant="bodyLarge" style={styles.description}>
                                {description}
                            </Text>
                        </View>

                        <View style={styles.playButton}>
                            <Text style={[styles.playText, { color: color }]}>PLAY NOW</Text>
                            <MaterialCommunityIcons name="arrow-right" size={20} color={color} />
                        </View>
                    </View>
                </LinearGradient>
            </Surface>
        </AnimatedPressable>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.md,
        flex: 1,
        minHeight: 240,
    },
    card: {
        flex: 1,
        overflow: 'hidden',
    },
    gradient: {
        flex: 1,
        padding: spacing.xl,
        justifyContent: 'space-between',
    },
    contentRow: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
    },
    textContainer: {
        width: '100%',
        marginBottom: spacing.lg,
    },
    title: {
        color: '#fff',
        fontWeight: 'bold',
        marginBottom: spacing.xs,
        fontSize: 24,
    },
    description: {
        color: 'rgba(255,255,255,0.9)',
        marginBottom: spacing.lg,
        fontSize: 16,
    },
    playButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 25,
        alignSelf: 'flex-start',
    },
    playText: {
        fontWeight: 'bold',
        marginRight: 8,
        fontSize: 14,
    },
    iconContainer: {
        position: 'absolute',
        right: -20,
        bottom: -20,
        opacity: 0.2,
        transform: [{ rotate: '-15deg' }],
    },
});

export default GameTile;
