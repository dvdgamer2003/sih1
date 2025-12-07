import React, { useEffect, useState } from 'react';
import { StyleSheet, Dimensions, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    withDelay,
    withSequence,
    Easing,
    runOnJS,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');
const NUM_CONFETTI = 25;
const COLORS = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#1A535C', '#FF9F1C'];

interface ConfettiPieceProps {
    index: number;
    onComplete: () => void;
}

const ConfettiPiece: React.FC<ConfettiPieceProps> = ({ index, onComplete }) => {
    const x = useSharedValue(width / 2);
    const y = useSharedValue(-50);
    const rotation = useSharedValue(0);
    const opacity = useSharedValue(1);

    useEffect(() => {
        const randomX = Math.random() * width;
        const randomRotation = Math.random() * 360 * 5;
        const duration = 2000 + Math.random() * 1000;
        const delay = Math.random() * 500;

        x.value = withDelay(delay, withTiming(randomX, { duration, easing: Easing.out(Easing.quad) }));
        y.value = withDelay(
            delay,
            withTiming(height + 50, { duration, easing: Easing.in(Easing.quad) }, (finished) => {
                if (finished && index === NUM_CONFETTI - 1) {
                    runOnJS(onComplete)();
                }
            })
        );
        rotation.value = withDelay(delay, withTiming(randomRotation, { duration }));
        opacity.value = withDelay(delay + duration * 0.8, withTiming(0, { duration: duration * 0.2 }));
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: x.value },
            { translateY: y.value },
            { rotate: `${rotation.value}deg` },
        ],
        opacity: opacity.value,
    }));

    const color = COLORS[index % COLORS.length];
    const size = 8 + Math.random() * 8;

    return (
        <Animated.View
            style={[
                styles.confetti,
                animatedStyle,
                {
                    backgroundColor: color,
                    width: size,
                    height: size * 0.6,
                },
            ]}
        />
    );
};

interface ConfettiAnimationProps {
    isVisible: boolean;
    onComplete: () => void;
}

const ConfettiAnimation: React.FC<ConfettiAnimationProps> = ({ isVisible, onComplete }) => {
    if (!isVisible) return null;

    return (
        <View style={styles.container} pointerEvents="none">
            {Array.from({ length: NUM_CONFETTI }).map((_, i) => (
                <ConfettiPiece key={i} index={i} onComplete={onComplete} />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 1000,
        elevation: 1000,
    },
    confetti: {
        position: 'absolute',
        borderRadius: 2,
    },
});

export default ConfettiAnimation;
