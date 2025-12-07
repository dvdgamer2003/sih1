import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { borderRadius, shadows } from '../../theme';

interface GlassCardProps {
    children: React.ReactNode;
    intensity?: number;
    tint?: 'light' | 'dark' | 'default';
    style?: ViewStyle;
}

const GlassCard: React.FC<GlassCardProps> = ({
    children,
    intensity = 80,
    tint = 'light',
    style,
}) => {
    return (
        <View style={[styles.container, shadows.elevation3, style]}>
            <BlurView intensity={intensity} tint={tint} style={styles.blurView}>
                <LinearGradient
                    colors={['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.1)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={StyleSheet.absoluteFill}
                />
                <View style={styles.content}>{children}</View>
            </BlurView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: borderRadius.xl,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    blurView: {
        borderRadius: borderRadius.xl,
    },
    content: {
        padding: 16,
    },
});

export default GlassCard;
