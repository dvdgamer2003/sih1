import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { useAuth } from '../context/AuthContext';
import { spacing, borderRadius, theme } from '../theme';

const PendingApprovalScreen = () => {
    const { logout, user } = useAuth();

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#f6d365', '#fda085']} // Warm orange/yellow gradient for "pending" state
                style={styles.background}
            />

            <View style={styles.content}>
                <Animated.View
                    entering={ZoomIn.duration(800)}
                    style={styles.iconContainer}
                >
                    <MaterialCommunityIcons name="clock-time-four-outline" size={100} color="#fff" />
                </Animated.View>

                <Animated.View
                    entering={FadeInDown.delay(300).duration(800)}
                    style={styles.textContainer}
                >
                    <Text style={styles.title}>Account Pending</Text>
                    <Text style={styles.subtitle}>
                        Hello, {user?.name}! Your account is currently under review.
                    </Text>
                    <Text style={styles.description}>
                        You will receive full access once your account is approved by an administrator or your institute.
                    </Text>
                </Animated.View>

                <Animated.View
                    entering={FadeInDown.delay(600).duration(800)}
                    style={styles.buttonContainer}
                >
                    <TouchableOpacity
                        style={styles.button}
                        onPress={logout}
                    >
                        <Text style={styles.buttonText}>Log Out</Text>
                        <MaterialCommunityIcons name="logout" size={20} color="#fda085" />
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    content: {
        width: '85%',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        padding: spacing.xl,
        borderRadius: borderRadius.xl,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    iconContainer: {
        marginBottom: spacing.xl,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        padding: spacing.lg,
        borderRadius: 100,
    },
    textContainer: {
        alignItems: 'center',
        marginBottom: spacing.xxl,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: spacing.md,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
        marginBottom: spacing.md,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
        lineHeight: 24,
    },
    buttonContainer: {
        width: '100%',
    },
    button: {
        backgroundColor: '#fff',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.xl,
        borderRadius: borderRadius.lg,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    buttonText: {
        color: '#fda085',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default PendingApprovalScreen;
