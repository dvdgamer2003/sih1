import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TextInputProps, TouchableOpacity } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { borderRadius, spacing } from '../../theme';
import { useResponsive } from '../../hooks/useResponsive';

interface CustomInputProps extends TextInputProps {
    label: string;
    error?: string;
    helperText?: string;
    icon?: React.ReactNode;
    rightIcon?: string;
    onRightIconPress?: () => void;
}

const CustomInput: React.FC<CustomInputProps> = ({
    label,
    error,
    helperText,
    icon,
    rightIcon,
    onRightIconPress,
    value,
    onFocus,
    onBlur,
    ...props
}) => {
    const theme = useTheme();
    const { getResponsiveFontSize, getResponsivePadding } = useResponsive();
    const [isFocused, setIsFocused] = useState(false);
    const labelPosition = useSharedValue(value ? 1 : 0);

    const handleFocus = (e: any) => {
        setIsFocused(true);
        labelPosition.value = withTiming(1, { duration: 200 });
        onFocus?.(e);
    };

    const handleBlur = (e: any) => {
        setIsFocused(false);
        if (!value) {
            labelPosition.value = withTiming(0, { duration: 200 });
        }
        onBlur?.(e);
    };

    const labelStyle = useAnimatedStyle(() => ({
        transform: [
            {
                translateY: labelPosition.value === 1 ? -24 : 0,
            },
            {
                scale: labelPosition.value === 1 ? 0.85 : 1,
            },
        ],
    }));

    const borderColor = error
        ? theme.colors.error
        : isFocused
            ? theme.colors.primary
            : theme.colors.outline;

    // Responsive values
    const inputFontSize = getResponsiveFontSize(16);
    const minHeight = getResponsivePadding(56);

    return (
        <View style={styles.container}>
            <View style={[styles.inputContainer, { borderColor, borderWidth: isFocused ? 2 : 1 }]}>
                {icon && <View style={styles.iconContainer}>{icon}</View>}
                <View style={styles.inputWrapper}>
                    <Animated.View style={[styles.labelContainer, labelStyle]}>
                        <Text
                            style={[
                                styles.label,
                                {
                                    color: error
                                        ? theme.colors.error
                                        : isFocused
                                            ? theme.colors.primary
                                            : theme.colors.onSurfaceVariant,
                                },
                            ]}
                        >
                            {label}
                        </Text>
                    </Animated.View>
                    <TextInput
                        value={value}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        style={[
                            styles.input,
                            {
                                color: theme.colors.onSurface,
                                paddingLeft: icon ? spacing.md : spacing.lg,
                                paddingRight: rightIcon ? spacing.xl : spacing.lg,
                                fontSize: inputFontSize,
                                minHeight: minHeight,
                            },
                        ]}
                        placeholderTextColor={theme.colors.onSurfaceVariant}
                        {...props}
                    />
                </View>
                {rightIcon && (
                    <TouchableOpacity onPress={onRightIconPress} style={styles.rightIconContainer}>
                        <MaterialCommunityIcons
                            name={rightIcon as any}
                            size={24}
                            color={theme.colors.onSurfaceVariant}
                        />
                    </TouchableOpacity>
                )}
            </View>
            {(error || helperText) && (
                <Text
                    style={[
                        styles.helperText,
                        { color: error ? theme.colors.error : theme.colors.onSurfaceVariant },
                    ]}
                >
                    {error || helperText}
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.lg,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: borderRadius.md,
        backgroundColor: '#FFFFFF',
        minHeight: 56,
    },
    iconContainer: {
        paddingLeft: spacing.lg,
    },
    rightIconContainer: {
        paddingRight: spacing.lg,
        paddingLeft: spacing.sm,
    },
    inputWrapper: {
        flex: 1,
        position: 'relative',
    },
    labelContainer: {
        position: 'absolute',
        left: spacing.lg,
        top: 18,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 4,
        zIndex: 1,
    },
    label: {
        fontSize: 16,
    },
    input: {
        fontSize: 16,
        paddingHorizontal: spacing.lg,
        paddingTop: 20,
        paddingBottom: 8,
        minHeight: 56,
    },
    helperText: {
        fontSize: 12,
        marginTop: 4,
        marginLeft: spacing.lg,
    },
});

export default CustomInput;
