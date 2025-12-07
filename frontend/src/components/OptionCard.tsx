import React, { useEffect } from 'react';
import { StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Text, Surface, useTheme } from 'react-native-paper';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';

interface OptionCardProps {
    text: string;
    isSelected: boolean;
    onPress: () => void;
    disabled?: boolean;
    isCorrect?: boolean; // For showing result immediately if needed (optional)
}

const OptionCard: React.FC<OptionCardProps> = ({ text, isSelected, onPress, disabled, isCorrect }) => {
    const theme = useTheme();
    const scale = useSharedValue(1);
    const backgroundColor = useSharedValue(theme.colors.surface);

    useEffect(() => {
        if (isSelected) {
            backgroundColor.value = withTiming(theme.colors.primaryContainer, { duration: 200 });
            scale.value = withSpring(1.02);
        } else {
            backgroundColor.value = withTiming(theme.colors.surface, { duration: 200 });
            scale.value = withSpring(1);
        }
    }, [isSelected]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
            backgroundColor: backgroundColor.value,
            borderColor: isSelected ? theme.colors.primary : theme.colors.outline,
        };
    });

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.8}
            disabled={disabled}
            style={{ marginBottom: 12 }}
        >
            <Animated.View style={[styles.container, animatedStyle]}>
                <Text variant="bodyLarge" style={{ color: isSelected ? theme.colors.primary : theme.colors.onSurface }}>
                    {text}
                </Text>
            </Animated.View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        elevation: 1, // Shadow for Android
        shadowColor: '#000', // Shadow for iOS
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
});

export default OptionCard;
