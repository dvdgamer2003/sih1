import React, { useEffect } from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { Surface, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    interpolate,
    withSpring,
} from 'react-native-reanimated';

interface CardFlipProps {
    icon: string;
    color: string;
    isFlipped: boolean;
    isMatched: boolean;
    onPress: () => void;
    disabled?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const CardFlip: React.FC<CardFlipProps> = ({
    icon,
    color,
    isFlipped,
    isMatched,
    onPress,
    disabled = false,
}) => {
    const theme = useTheme();
    const rotation = useSharedValue(0);
    const scale = useSharedValue(1);

    useEffect(() => {
        rotation.value = withTiming(isFlipped ? 180 : 0, { duration: 300 });
    }, [isFlipped]);

    useEffect(() => {
        if (isMatched) {
            scale.value = withSpring(1.1, {}, () => {
                scale.value = withSpring(1);
            });
        }
    }, [isMatched]);

    const frontAnimatedStyle = useAnimatedStyle(() => {
        const rotateY = interpolate(rotation.value, [0, 180], [0, 180]);
        const opacity = interpolate(rotation.value, [0, 90, 180], [1, 0, 0]);

        return {
            transform: [{ rotateY: `${rotateY}deg` }, { scale: scale.value }],
            opacity,
            backfaceVisibility: 'hidden',
        };
    });

    const backAnimatedStyle = useAnimatedStyle(() => {
        const rotateY = interpolate(rotation.value, [0, 180], [180, 360]);
        const opacity = interpolate(rotation.value, [0, 90, 180], [0, 0, 1]);

        return {
            transform: [{ rotateY: `${rotateY}deg` }, { scale: scale.value }],
            opacity,
            backfaceVisibility: 'hidden',
        };
    });

    return (
        <AnimatedPressable
            onPress={onPress}
            disabled={disabled || isFlipped || isMatched}
            style={styles.container}
        >
            {/* Back (Hidden) */}
            <Animated.View style={[styles.cardFace, backAnimatedStyle]}>
                <Surface
                    style={[
                        styles.card,
                        { backgroundColor: color },
                        isMatched && styles.matchedCard,
                    ]}
                    elevation={isMatched ? 5 : 4}
                >
                    <MaterialCommunityIcons name={icon as any} size={40} color="#fff" />
                </Surface>
            </Animated.View>

            {/* Front (Visible by default) */}
            <Animated.View style={[styles.cardFace, frontAnimatedStyle]}>
                <Surface
                    style={[styles.card, { backgroundColor: theme.colors.primary }]}
                    elevation={4}
                >
                    <MaterialCommunityIcons name="help-circle-outline" size={40} color="#fff" />
                </Surface>
            </Animated.View>
        </AnimatedPressable>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        aspectRatio: 0.75,
        padding: 4,
    },
    cardFace: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        padding: 4,
    },
    card: {
        flex: 1,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    matchedCard: {
        opacity: 0.7,
    },
});

export default CardFlip;
