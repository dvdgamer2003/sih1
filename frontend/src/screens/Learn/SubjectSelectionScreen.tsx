import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { Text, useTheme, ActivityIndicator, ProgressBar, Surface } from 'react-native-paper';
import { learnService } from '../../services/learnService';
import GradientBackground from '../../components/ui/GradientBackground';
import { spacing, gradients, borderRadius } from '../../theme';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const SubjectSelectionScreen = ({ route, navigation }: any) => {
    const { classId, classNumber } = route.params;
    const theme = useTheme();
    const [subjects, setSubjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSubjects();
    }, []);

    const loadSubjects = async () => {
        try {
            const data = await learnService.getSubjects(classId);
            setSubjects(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item, index }: any) => (
        <Animated.View entering={FadeInDown.delay(index * 100).duration(500)} style={styles.cardContainer}>
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.navigate('ChapterList', { subjectId: item._id, subjectName: item.name })}
            >
                <Surface style={styles.card} elevation={4}>
                    <View style={[styles.iconContainer, { backgroundColor: item.color || theme.colors.primaryContainer }]}>
                        <MaterialCommunityIcons name={item.icon || 'book-open-variant'} size={40} color={theme.colors.primary} />
                    </View>

                    <View style={styles.cardContent}>
                        <Text variant="titleMedium" style={styles.subjectName}>{item.name}</Text>
                        <View style={styles.progressContainer}>
                            <Text variant="bodySmall" style={styles.progressLabel}>Progress</Text>
                            <ProgressBar progress={0.2} color={theme.colors.primary} style={styles.progressBar} />
                            <Text variant="bodySmall" style={styles.progressValue}>20%</Text>
                        </View>
                        <View style={styles.actionRow}>
                            <Text variant="labelMedium" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>START LEARNING</Text>
                            <MaterialCommunityIcons name="arrow-right" size={16} color={theme.colors.primary} />
                        </View>
                    </View>
                </Surface>
            </TouchableOpacity>
        </Animated.View>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <GradientBackground colors={gradients.warm}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text variant="headlineMedium" style={styles.headerTitle}>
                        Class {classNumber} Subjects
                    </Text>
                    <View style={{ width: 24 }} />
                </View>

                <FlatList
                    data={subjects}
                    renderItem={renderItem}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </GradientBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: spacing.xl,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.lg,
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        color: '#fff',
        fontWeight: 'bold',
    },
    listContent: {
        padding: spacing.lg,
        gap: spacing.lg,
    },
    cardContainer: {
        marginBottom: spacing.sm,
    },
    card: {
        flexDirection: 'row',
        borderRadius: borderRadius.xl,
        backgroundColor: '#fff',
        overflow: 'hidden',
        minHeight: 120,
    },
    iconContainer: {
        width: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardContent: {
        flex: 1,
        padding: spacing.md,
        justifyContent: 'space-between',
    },
    subjectName: {
        fontWeight: 'bold',
        marginBottom: spacing.xs,
    },
    progressContainer: {
        marginBottom: spacing.sm,
    },
    progressLabel: {
        color: '#666',
        marginBottom: 4,
    },
    progressBar: {
        height: 6,
        borderRadius: 3,
        backgroundColor: '#E0E0E0',
        marginBottom: 4,
    },
    progressValue: {
        alignSelf: 'flex-end',
        color: '#666',
        fontSize: 10,
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
});

export default SubjectSelectionScreen;
