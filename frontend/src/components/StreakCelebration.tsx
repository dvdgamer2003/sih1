import React, { useEffect } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Text, Button, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withSequence,
    withTiming,
    withRepeat,
    FadeIn,
    FadeOut,
    ZoomIn,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { spacing, borderRadius, gradients } from '../theme';

interface StreakCelebrationProps {
    visible: boolean;
    streak: number;
    onClose: () => void;
}

const StreakCelebration: React.FC<StreakCelebrationProps> = ({ visible, streak, onClose }) => {
    const scale = useSharedValue(0);
    const rotate = useSharedValue(0);

    useEffect(() => {
        if (visible) {
            scale.value = withSequence(
                withSpring(1.2),
                withSpring(1)
            );
            rotate.value = withRepeat(
                withSequence(
                    withTiming(-10, { duration: 100 }),
                    withTiming(10, { duration: 100 }),
                    withTiming(0, { duration: 100 })
                ),
                3,
                true
            );
        } else {
            scale.value = 0;
        }
    }, [visible]);

    const animatedIconStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: scale.value },
            { rotate: `${rotate.value}deg` }
        ],
    }));

    if (!visible) return null;

    return (
        <Modal transparent visible={visible} animationType="fade">
            <View style={styles.overlay}>
                <Animated.View entering={ZoomIn} exiting={FadeOut} style={styles.container}>
                    <Surface style={styles.card} elevation={4}>
                        <LinearGradient
                            colors={['#FFF3E0', '#FFFFFF']}
                            style={styles.gradient}
                        >
                            <Animated.View style={[styles.iconContainer, animatedIconStyle]}>
                                <MaterialCommunityIcons name="fire" size={80} color="#FF5722" />
                            </Animated.View>

                            <Text variant="displaySmall" style={styles.title}>
                                {streak} Day Streak!
                            </Text>

                            <Text variant="bodyLarge" style={styles.subtitle}>
                                You're on fire! Keep learning to maintain your streak.
                            </Text>

                            <Button
                                mode="contained"
                                onPress={onClose}
                                style={styles.button}
                                buttonColor="#FF5722"
                            >
                                Awesome!
                            </Button>
                        </LinearGradient>
                    </Surface>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
    },
    container: {
        width: '100%',
        maxWidth: 400,
    },
    card: {
        borderRadius: borderRadius.xl,
        overflow: 'hidden',
    },
    gradient: {
        padding: spacing.xl,
        alignItems: 'center',
    },
    iconContainer: {
        marginBottom: spacing.lg,
        shadowColor: '#FF5722',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    title: {
        fontWeight: 'bold',
        color: '#E64A19',
        marginBottom: spacing.sm,
        textAlign: 'center',
    },
    subtitle: {
        textAlign: 'center',
        color: '#5D4037',
        marginBottom: spacing.xl,
    },
    button: {
        width: '100%',
        borderRadius: borderRadius.lg,
    },
});

export default StreakCelebration;
