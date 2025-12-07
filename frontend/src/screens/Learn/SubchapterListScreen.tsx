import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, useTheme, ActivityIndicator, IconButton } from 'react-native-paper';
import { learnService } from '../../services/learnService';
import GradientBackground from '../../components/ui/GradientBackground';
import CustomCard from '../../components/ui/CustomCard';
import { spacing, gradients, borderRadius } from '../../theme';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const SubchapterListScreen = ({ route, navigation }: any) => {
    const { chapterId, chapterName } = route.params;
    const theme = useTheme();
    const [subchapters, setSubchapters] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSubchapters();
    }, []);

    const loadSubchapters = async () => {
        try {
            const data = await learnService.getSubchapters(chapterId);
            setSubchapters(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item, index }: any) => (
        <Animated.View entering={FadeInDown.delay(index * 100).duration(500)}>
            <CustomCard
                style={styles.card}
                onPress={() => navigation.navigate('Subchapter', { subchapterId: item._id, title: item.name })}
            >
                <View style={styles.cardContent}>
                    <View style={[styles.iconContainer, { backgroundColor: theme.colors.tertiaryContainer }]}>
                        <MaterialCommunityIcons name="school" size={24} color={theme.colors.tertiary} />
                    </View>
                    <View style={styles.info}>
                        <Text variant="titleMedium" style={styles.cardTitle}>
                            {item.name}
                        </Text>
                        <Text variant="bodySmall" style={styles.cardSubtitle}>
                            Tap to start learning
                        </Text>
                    </View>
                    <MaterialCommunityIcons name="arrow-right-circle" size={32} color={theme.colors.primary} />
                </View>
            </CustomCard>
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
        <View style={styles.container}>
            <View style={styles.headerBackground}>
                <View style={styles.headerContent}>
                    <View style={styles.headerRow}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                            <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
                        </TouchableOpacity>
                        <Text variant="headlineSmall" style={styles.headerTitle} numberOfLines={1}>
                            {chapterName}
                        </Text>
                        <View style={{ width: 40 }} />
                    </View>
                </View>
            </View>

            <View style={styles.contentContainer}>
                <FlatList
                    data={subchapters}
                    renderItem={renderItem}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
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
        paddingHorizontal: spacing.md,
        paddingTop: spacing.md,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    contentContainer: {
        flex: 1,
        marginTop: -spacing.lg,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#EFEEFC',
    },
    backButton: {
        padding: 8,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 12,
    },
    headerTitle: {
        color: '#fff',
        fontWeight: '700',
        textAlign: 'center',
        flex: 1,
    },
    listContent: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.lg,
        paddingBottom: 40,
        gap: spacing.md,
    },
    card: {
        marginBottom: spacing.sm,
        borderRadius: borderRadius.xl,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        overflow: 'hidden',
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    info: {
        flex: 1,
    },
    cardTitle: {
        fontWeight: '700',
        marginBottom: 2,
        fontSize: 16,
    },
    cardSubtitle: {
        color: '#888',
    },
});

export default SubchapterListScreen;
