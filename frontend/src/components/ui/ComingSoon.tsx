import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');

interface ComingSoonProps {
    title: string;
    subtitle?: string;
    backButton?: boolean;
}

const ComingSoon: React.FC<ComingSoonProps> = ({
    title,
    subtitle = "We're working hard to bring you this feature. Stay tuned!",
    backButton = true
}) => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            {/* Background Gradient */}
            <LinearGradient
                colors={['#4F46E5', '#0EA5E9', '#10B981']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
            />

            {/* Decorative Circles */}
            <View style={styles.circle1} />
            <View style={styles.circle2} />

            {/* Header */}
            {backButton && (
                <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.header}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.backButton}
                        activeOpacity={0.8}
                    >
                        <BlurView intensity={30} tint="light" style={styles.backButtonBlur}>
                            <Ionicons name="arrow-back" size={24} color="#fff" />
                        </BlurView>
                    </TouchableOpacity>
                </Animated.View>
            )}

            {/* Content */}
            <View style={styles.content}>
                <Animated.View entering={FadeInUp.delay(300).duration(600)} style={styles.iconContainer}>
                    <BlurView intensity={40} tint="light" style={styles.iconBlur}>
                        <Ionicons name="rocket-outline" size={60} color="#fff" />
                    </BlurView>
                </Animated.View>

                <Animated.Text entering={FadeInUp.delay(500).duration(600)} style={styles.title}>
                    {title}
                </Animated.Text>

                <Animated.View entering={FadeInUp.delay(700).duration(600)} style={styles.badgeContainer}>
                    <LinearGradient
                        colors={['#F59E0B', '#F97316']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.badge}
                    >
                        <Text style={styles.badgeText}>COMING SOON</Text>
                    </LinearGradient>
                </Animated.View>

                <Animated.Text entering={FadeInUp.delay(900).duration(600)} style={styles.subtitle}>
                    {subtitle}
                </Animated.Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#4F46E5',
    },
    circle1: {
        position: 'absolute',
        top: -100,
        right: -100,
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    circle2: {
        position: 'absolute',
        bottom: -50,
        left: -50,
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    header: {
        position: 'absolute',
        top: 50,
        left: 20,
        zIndex: 10,
    },
    backButton: {
        borderRadius: 20,
        overflow: 'hidden',
    },
    backButtonBlur: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
    },
    iconContainer: {
        marginBottom: 30,
        borderRadius: 50,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    iconBlur: {
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 15,
        textShadowColor: 'rgba(0,0,0,0.2)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    badgeContainer: {
        marginBottom: 20,
        shadowColor: '#F59E0B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        elevation: 5,
    },
    badge: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
    },
    badgeText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
        letterSpacing: 1,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'center',
        lineHeight: 24,
        maxWidth: '80%',
    },
});

export default ComingSoon;
