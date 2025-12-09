import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Text, ActivityIndicator, useTheme } from 'react-native-paper';
import { getLessons, Lesson } from '../services/lessonsService';
import { useResponsive } from '../hooks/useResponsive';
import LessonCard from '../components/LessonCard';
import ProgressWidget from '../components/ProgressWidget';
import GradientBackground from '../components/ui/GradientBackground';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { spacing, gradients, colors, borderRadius } from '../theme';
import { getStaggerDelay } from '../utils/animations';

const LessonsScreen = () => {
    const theme = useTheme();
    const { containerStyle, isMobile, getGridColumns } = useResponsive();
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadLessons = async () => {
        try {
            const data = await getLessons();
            setLessons(data);
        } catch (error) {
            console.error('Failed to load lessons:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadLessons();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        loadLessons();
    };

    const numColumns = getGridColumns();

    const renderLesson = ({ item, index }: { item: Lesson; index: number }) => (
        <Animated.View
            entering={FadeInDown.delay(getStaggerDelay(index, 80)).duration(500)}
            style={{ flex: 1 / numColumns, maxWidth: isMobile ? '100%' : `${100 / numColumns}%` }}
        >
            <LessonCard
                lesson={item}
                onPress={() => console.log('Lesson pressed:', item.id)}
                index={index}
            />
        </Animated.View>
    );

    if (loading) {
        return (
            <GradientBackground colors={gradients.onboarding}>
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                    <Text variant="titleMedium" style={styles.loadingText}>
                        Loading lessons...
                    </Text>
                </View>
            </GradientBackground>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerBackground}>
                <View style={styles.headerContent}>
                    <Animated.View entering={FadeInDown.duration(500)}>
                        <Text variant="displaySmall" style={styles.headerTitle}>
                            Lessons
                        </Text>
                        <Text variant="titleMedium" style={styles.headerSubtitle}>
                            Choose a topic to start learning 📚
                        </Text>
                        <ProgressWidget completed={3} total={lessons.length} />
                    </Animated.View>
                </View>
            </View>

            <View style={styles.contentContainer}>
                <FlatList
                    data={lessons}
                    renderItem={renderLesson}
                    keyExtractor={(item) => item.id}
                    numColumns={numColumns}
                    key={numColumns}
                    contentContainerStyle={styles.listContent}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />}
                    showsVerticalScrollIndicator={false}
                    columnWrapperStyle={numColumns > 1 ? { gap: spacing.md } : undefined}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EFEEFC',
    },
    headerBackground: {
        backgroundColor: '#6A5AE0',
        paddingTop: spacing.xl,
        paddingBottom: spacing.xxl,
        borderBottomLeftRadius: borderRadius.xxl,
        borderBottomRightRadius: borderRadius.xxl,
    },
    headerContent: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
    },
    contentContainer: {
        flex: 1,
        marginTop: -spacing.lg, // Slight overlap if needed, or just standard spacing
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#EFEEFC',
    },
    loadingText: {
        marginTop: spacing.lg,
        color: colors.primary,
    },
    listContent: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.lg,
        paddingBottom: 120,
        gap: spacing.md,
    },
    headerTitle: {
        fontWeight: '700',
        color: '#fff',
        marginBottom: spacing.xs,
    },
    headerSubtitle: {
        color: 'rgba(255,255,255,0.8)',
        marginBottom: spacing.lg,
    },
});

export default LessonsScreen;
