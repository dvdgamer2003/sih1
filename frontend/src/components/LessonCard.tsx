import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { Card, Text, useTheme, Surface, Button } from 'react-native-paper';
import { Lesson } from '../services/lessonsService';
import { spacing, borderRadius } from '../theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { useResponsive } from '../hooks/useResponsive';

interface LessonCardProps {
    lesson: Lesson;
    onPress: () => void;
    index: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const LessonCard: React.FC<LessonCardProps> = ({ lesson, onPress, index }) => {
    const theme = useTheme();
    const { isMobile } = useResponsive();
    const scale = useSharedValue(1);
    const elevation = useSharedValue(2);

    const handlePressIn = () => {
        scale.value = withSpring(0.98);
        elevation.value = withTiming(1);
    };

    const handlePressOut = () => {
        scale.value = withSpring(1);
        elevation.value = withTiming(2);
    };

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    // Map topics to icons and colors
    const getTopicTheme = (title: string) => {
        const lowerTitle = title.toLowerCase();
        if (lowerTitle.includes('farm') || lowerTitle.includes('agriculture')) {
            return { icon: 'sprout', color: '#4CAF50', bg: '#E8F5E9' };
        }
        if (lowerTitle.includes('health') || lowerTitle.includes('hygiene')) {
            return { icon: 'heart-pulse', color: '#EF5350', bg: '#FFEBEE' };
        }
        if (lowerTitle.includes('money') || lowerTitle.includes('finance')) {
            return { icon: 'piggy-bank', color: '#FF9800', bg: '#FFF3E0' };
        }
        return { icon: 'book-open-variant', color: '#5C6BC0', bg: '#E8EAF6' };
    };

    const topicTheme = getTopicTheme(lesson.title);

    return (
        <AnimatedPressable
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={[styles.container, animatedStyle]}
        >
            <View style={[styles.card, { shadowColor: topicTheme.color }]}>
                <View style={styles.imageContainer}>
                    <Card.Cover source={{ uri: lesson.imageUrl }} style={styles.cover} />
                    <View style={[styles.iconBadge, { backgroundColor: topicTheme.bg }]}>
                        <MaterialCommunityIcons name={topicTheme.icon as any} size={20} color={topicTheme.color} />
                    </View>
                </View>

                <View style={styles.content}>
                    <View style={styles.textContainer}>
                        <Text variant="labelSmall" style={{ color: topicTheme.color, fontWeight: '700', marginBottom: 4 }}>
                            {lesson.subject?.toUpperCase() || 'LESSON'}
                        </Text>
                        <Text variant="titleMedium" style={styles.title} numberOfLines={2}>
                            {lesson.title}
                        </Text>
                        <View style={styles.metaRow}>
                            <MaterialCommunityIcons name="clock-outline" size={14} color={theme.colors.outline} />
                            <Text variant="labelSmall" style={{ color: theme.colors.outline, marginLeft: 4 }}>
                                {lesson.duration}
                            </Text>
                        </View>
                    </View>

                    <View style={[styles.actionButton, { backgroundColor: topicTheme.bg }]}>
                        <MaterialCommunityIcons name="play" size={24} color={topicTheme.color} />
                    </View>
                </View>
            </View>
        </AnimatedPressable>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.md,
        marginHorizontal: spacing.sm,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: borderRadius.xl,
        padding: spacing.sm,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 3,
        alignItems: 'center',
    },
    imageContainer: {
        position: 'relative',
        marginRight: spacing.md,
    },
    cover: {
        width: 80,
        height: 80,
        borderRadius: borderRadius.lg,
        backgroundColor: '#f0f0f0',
    },
    iconBadge: {
        position: 'absolute',
        bottom: -4,
        right: -4,
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    textContainer: {
        flex: 1,
        marginRight: spacing.sm,
    },
    title: {
        fontWeight: '700',
        marginBottom: spacing.xs,
        lineHeight: 20,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default LessonCard;
