import React, { useEffect } from 'react';
import { View, StyleSheet, Text, Platform } from 'react-native';
import Animated, { FadeInUp, FadeOutUp, useSharedValue, useAnimatedStyle, withSpring, withSequence, withDelay } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface XPToastProps {
    visible: boolean;
    xp: number;
    message?: string;
    onHide: () => void;
}

const XPToast: React.FC<XPToastProps> = ({ visible, xp, message = 'XP Gained!', onHide }) => {
    if (!visible) return null;

    useEffect(() => {
        const timer = setTimeout(() => {
            onHide();
        }, 2000);
        return () => clearTimeout(timer);
    }, [visible]);

    return (
        <Animated.View
            entering={FadeInUp.springify()}
            exiting={FadeOutUp}
            style={styles.container}
        >
            <View style={styles.content}>
                <MaterialCommunityIcons name="star" size={24} color="#FFD700" />
                <View style={styles.textContainer}>
                    <Text style={styles.xpText}>+{xp} XP</Text>
                    <Text style={styles.messageText}>{message}</Text>
                </View>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 60,
        alignSelf: 'center',
        zIndex: 1000,
        backgroundColor: '#333',
        borderRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 10,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
            },
            android: {
                elevation: 10,
            },
            web: {
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
            },
        }),
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    textContainer: {
        flexDirection: 'column',
    },
    xpText: {
        color: '#FFD700',
        fontWeight: 'bold',
        fontSize: 16,
    },
    messageText: {
        color: '#fff',
        fontSize: 12,
    },
});

export default XPToast;
