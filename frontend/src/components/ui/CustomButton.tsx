import React from 'react';
import { Pressable, StyleSheet, ViewStyle, TextStyle, StyleProp } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { gradients, shadows, borderRadius } from '../../theme';
import { scaleValues } from '../../utils/animations';
import { useResponsive } from '../../hooks/useResponsive';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
// ...
interface CustomButtonProps {
    children: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outlined' | 'text';
    size?: 'small' | 'medium' | 'large';
    icon?: string;
    iconPosition?: 'left' | 'right';
    disabled?: boolean;
    loading?: boolean;
    fullWidth?: boolean;
    style?: StyleProp<ViewStyle>;
    labelStyle?: StyleProp<TextStyle>;
}

const CustomButton: React.FC<CustomButtonProps> = ({
    children,
    onPress,
    variant = 'primary',
    size = 'medium',
    icon,
    iconPosition = 'left',
    disabled = false,
    loading = false,
    fullWidth = false,
    style,
    labelStyle,
}) => {
    const theme = useTheme();
    const { responsiveValue, getResponsivePadding } = useResponsive();
    const scale = useSharedValue(1);

    const handlePressIn = () => {
        scale.value = withSpring(scaleValues.pressed);
    };

    const handlePressOut = () => {
        scale.value = withSpring(scaleValues.normal);
    };

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const getButtonStyle = (): ViewStyle => {
        const baseStyle: ViewStyle = {
            borderRadius: borderRadius.xl,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            ...shadows.sm,
        };

        const sizeStyles = {
            small: { paddingVertical: 8, paddingHorizontal: 16 },
            medium: { paddingVertical: 12, paddingHorizontal: 24 },
            large: { paddingVertical: 16, paddingHorizontal: 32 },
        };

        if (variant === 'outlined') {
            return {
                ...baseStyle,
                ...sizeStyles[size],
                backgroundColor: 'transparent',
                borderWidth: 2,
                borderColor: theme.colors.primary,
            };
        }

        if (variant === 'text') {
            return {
                ...baseStyle,
                ...sizeStyles[size],
                backgroundColor: 'transparent',
                shadowOpacity: 0,
                elevation: 0,
            };
        }

        return {
            ...baseStyle,
            ...sizeStyles[size],
        };
    };

    const getTextStyle = (): TextStyle => {
        const sizeStyles = {
            small: { fontSize: 14 },
            medium: { fontSize: 16 },
            large: { fontSize: 18 },
        };

        const colorStyles = {
            primary: { color: '#FFFFFF' },
            secondary: { color: '#FFFFFF' },
            outlined: { color: theme.colors.primary },
            text: { color: theme.colors.primary },
        };

        return {
            ...sizeStyles[size],
            ...colorStyles[variant],
            fontWeight: '600',
        };
    };

    const renderContent = () => {
        // Responsive icon sizes
        const iconSize = responsiveValue(
            size === 'small' ? 18 : size === 'large' ? 24 : 20,
            size === 'small' ? 20 : size === 'large' ? 26 : 22,
            size === 'small' ? 22 : size === 'large' ? 28 : 24
        );

        // Merge calculated text style with passed labelStyle
        // Note: We need to handle the color for the icon too if we want it to match
        const finalTextStyle = [getTextStyle(), labelStyle];
        const flattenedTextStyle = StyleSheet.flatten(finalTextStyle);
        const iconColor = flattenedTextStyle.color || getTextStyle().color;

        return (
            <>
                {icon && iconPosition === 'left' && (
                    <MaterialCommunityIcons
                        name={icon as any}
                        size={iconSize}
                        color={iconColor as string}
                        style={{ marginRight: 8 }}
                    />
                )}
                <Text style={finalTextStyle}>{children}</Text>
                {icon && iconPosition === 'right' && (
                    <MaterialCommunityIcons
                        name={icon as any}
                        size={iconSize}
                        color={iconColor as string}
                        style={{ marginLeft: 8 }}
                    />
                )}
            </>
        );
    };

    const buttonStyle = [
        getButtonStyle(),
        fullWidth && { width: '100%' },
        disabled && { opacity: 0.5 },
        style,
    ];

    if (variant === 'primary' || variant === 'secondary') {
        const gradient = variant === 'primary' ? gradients.primary : gradients.secondary;

        return (
            <AnimatedPressable
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                disabled={disabled || loading}
                style={[animatedStyle, buttonStyle]}
            >
                <LinearGradient
                    colors={gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[StyleSheet.absoluteFill, { borderRadius: borderRadius.xl }]}
                />
                {renderContent()}
            </AnimatedPressable>
        );
    }

    return (
        <AnimatedPressable
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={disabled || loading}
            style={[animatedStyle, buttonStyle]}
        >
            {renderContent()}
        </AnimatedPressable>
    );
};

export default CustomButton;
