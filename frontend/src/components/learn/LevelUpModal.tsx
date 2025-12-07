import React, { useEffect } from 'react';
import { View, StyleSheet, Modal, Dimensions } from 'react-native';
import { Text, Button, Surface, useTheme } from 'react-native-paper';
import Animated, { FadeIn, ZoomIn, FadeOut, ZoomOut } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { spacing, borderRadius } from '../../theme';

const { width, height } = Dimensions.get('window');

interface LevelUpModalProps {
    visible: boolean;
    level: number;
    onClose: () => void;
}

const LevelUpModal: React.FC<LevelUpModalProps> = ({ visible, level, onClose }) => {
    const theme = useTheme();

    if (!visible) return null;

    return (
        <Modal transparent visible={visible} animationType="none">
            <View style={styles.overlay}>
                <Animated.View
                    entering={ZoomIn.springify()}
                    exiting={ZoomOut}
                    style={styles.container}
                >
                    <Surface style={styles.card} elevation={5}>
                        <View style={styles.iconContainer}>
                            <MaterialCommunityIcons name="trophy" size={64} color="#FFD700" />
                        </View>

                        <Text variant="headlineMedium" style={styles.title}>Level Up!</Text>
                        <Text variant="titleLarge" style={styles.levelText}>You reached Level {level}</Text>

                        <Text variant="bodyMedium" style={styles.message}>
                            Amazing work! You're becoming a master learner. Keep it up!
                        </Text>

                        <Button
                            mode="contained"
                            onPress={onClose}
                            style={styles.button}
                            contentStyle={{ paddingVertical: 8 }}
                        >
                            Awesome!
                        </Button>
                    </Surface>
                </Animated.View>

                {/* Simple confetti simulation with dots */}
                {[...Array(20)].map((_, i) => (
                    <Animated.View
                        key={i}
                        entering={FadeIn.delay(i * 50).duration(1000)}
                        style={[
                            styles.confetti,
                            {
                                left: Math.random() * width,
                                top: Math.random() * height,
                                backgroundColor: ['#FFD700', '#FF5722', '#2196F3', '#4CAF50'][Math.floor(Math.random() * 4)],
                            }
                        ]}
                    />
                ))}
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: width * 0.85,
        maxWidth: 400,
    },
    card: {
        borderRadius: borderRadius.xl,
        padding: spacing.xl,
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    iconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#FFF8E1',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.lg,
        borderWidth: 4,
        borderColor: '#FFD700',
    },
    title: {
        fontWeight: 'bold',
        color: '#FFD700',
        marginBottom: spacing.xs,
    },
    levelText: {
        fontWeight: 'bold',
        marginBottom: spacing.md,
    },
    message: {
        textAlign: 'center',
        color: '#666',
        marginBottom: spacing.xl,
    },
    button: {
        width: '100%',
        borderRadius: borderRadius.lg,
    },
    confetti: {
        position: 'absolute',
        width: 10,
        height: 10,
        borderRadius: 5,
        zIndex: -1,
    }
});

export default LevelUpModal;
