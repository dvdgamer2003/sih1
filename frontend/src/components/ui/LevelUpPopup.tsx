import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text, Portal, Modal, Button } from 'react-native-paper';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withSequence, withDelay, withTiming, Easing } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const LevelUpPopup = () => {
    const { showLevelUp, closeLevelUp, level } = useAuth();
    const scale = useSharedValue(0);
    const opacity = useSharedValue(0);

    useEffect(() => {
        if (showLevelUp) {
            scale.value = withSequence(
                withSpring(1.2),
                withSpring(1)
            );
            opacity.value = withTiming(1, { duration: 500 });

            const timer = setTimeout(() => {
                handleClose();
            }, 4000);

            return () => clearTimeout(timer);
        } else {
            scale.value = 0;
            opacity.value = 0;
        }
    }, [showLevelUp]);

    const handleClose = () => {
        opacity.value = withTiming(0, { duration: 300 });
        scale.value = withTiming(0, { duration: 300 }, () => {
            // runOnJS(closeLevelUp)(); // If needed, but closeLevelUp is state update
        });
        setTimeout(closeLevelUp, 300);
    };

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
            opacity: opacity.value,
        };
    });

    if (!showLevelUp) return null;

    return (
        <Portal>
            <View style={styles.overlay} pointerEvents="box-none">
                <Animated.View style={[styles.container, animatedStyle]}>
                    <LinearGradient
                        colors={['#6A5AE0', '#8B7AFF']}
                        style={styles.gradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <View style={styles.iconContainer}>
                            <MaterialCommunityIcons name="trophy" size={60} color="#FFD700" />
                        </View>

                        <Text style={styles.title}>LEVEL UP!</Text>

                        <View style={styles.levelBadge}>
                            <Text style={styles.levelText}>{level}</Text>
                        </View>

                        <Text style={styles.subtitle}>You've reached Level {level}!</Text>
                        <Text style={styles.description}>Keep learning to unlock more rewards.</Text>
                    </LinearGradient>
                </Animated.View>
            </View>
        </Portal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 1000,
    },
    container: {
        width: width * 0.85,
        maxWidth: 350,
        borderRadius: 30,
        overflow: 'hidden',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
    },
    gradient: {
        padding: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainer: {
        marginBottom: 20,
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: '#fff',
        marginBottom: 20,
        letterSpacing: 2,
        textShadowColor: 'rgba(0,0,0,0.2)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    levelBadge: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 6,
        borderColor: 'rgba(255,255,255,0.3)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    levelText: {
        fontSize: 48,
        fontWeight: '900',
        color: '#6A5AE0',
    },
    subtitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 8,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.9)',
        textAlign: 'center',
    },
});

export default LevelUpPopup;
