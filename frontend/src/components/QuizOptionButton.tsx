import React from 'react';
import { StyleSheet, Pressable, View } from 'react-native';
import { Text, useTheme, Surface } from 'react-native-paper';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import { spacing, borderRadius } from '../theme';

interface QuizOptionButtonProps {
    text: string;
    isSelected: boolean;
    onPress: () => void;
    index: number;
    status?: 'correct' | 'wrong' | 'none';
    disabled?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const QuizOptionButton: React.FC<QuizOptionButtonProps> = ({
    text,
    isSelected,
    onPress,
    index,
    status = 'none',
    disabled = false
}) => {
    const theme = useTheme();
    const scale = useSharedValue(1);

    const handlePressIn = () => {
        if (!disabled) scale.value = withSpring(0.98);
    };

    const handlePressOut = () => {
        if (!disabled) scale.value = withSpring(1);
    };

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    let backgroundColor = '#fff';
    let borderColor = theme.colors.outline;
    let textColor = theme.colors.onSurface;
    let badgeColor = '#F5F5F5';
    let badgeTextColor = '#666';

    if (status === 'correct') {
        backgroundColor = '#E8F5E9'; // Light Green
        borderColor = '#4CAF50';      // Green
        textColor = '#2E7D32';        // Dark Green
        badgeColor = '#4CAF50';
        badgeTextColor = '#fff';
    } else if (status === 'wrong') {
        backgroundColor = '#FFEBEE'; // Light Red
        borderColor = '#F44336';      // Red
        textColor = '#C62828';        // Dark Red
        badgeColor = '#F44336';
        badgeTextColor = '#fff';
    } else if (isSelected) {
        backgroundColor = theme.colors.primaryContainer;
        borderColor = theme.colors.primary;
        textColor = theme.colors.primary;
        badgeColor = theme.colors.primary;
        badgeTextColor = '#fff';
    }

    return (
        <AnimatedPressable
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={[styles.container, animatedStyle]}
            disabled={disabled}
        >
            <Surface style={[
                styles.button,
                {
                    backgroundColor,
                    borderColor,
                    borderWidth: (isSelected || status !== 'none') ? 2 : 1
                }
            ]} elevation={(isSelected || status !== 'none') ? 2 : 0}>
                <View style={[styles.indexBadge, { backgroundColor: badgeColor }]}>
                    <Text style={{ color: badgeTextColor, fontWeight: 'bold' }}>
                        {String.fromCharCode(65 + index)}
                    </Text>
                </View>
                <Text variant="bodyLarge" style={[styles.text, { color: textColor }]}>
                    {text}
                </Text>
            </Surface>
        </AnimatedPressable>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.md,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        borderRadius: 30, // Pill shape
        minHeight: 60,
    },
    indexBadge: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    text: {
        flex: 1,
        fontWeight: '500',
    }
});

export default QuizOptionButton;
