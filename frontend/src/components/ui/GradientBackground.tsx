import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { gradients } from '../../theme';

interface GradientBackgroundProps {
    children: React.ReactNode;
    colors?: readonly [string, string, ...string[]];
    style?: ViewStyle;
}

const GradientBackground: React.FC<GradientBackgroundProps> = ({
    children,
    colors = gradients.premium_bg,
    style,
}) => {
    return (
        <LinearGradient
            colors={colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.gradient, style]}
        >
            {children}
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
    },
});

export default GradientBackground;
