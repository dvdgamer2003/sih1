import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { Text, Surface, useTheme, ActivityIndicator, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import GradientBackground from '../components/ui/GradientBackground';
import { spacing, borderRadius, gradients } from '../theme';
import Animated, { FadeInDown } from 'react-native-reanimated';

// Mock data for search - in a real app this would come from an API or local database
const SEARCH_DATA = [
    { id: '1', type: 'lesson', title: 'Number Systems', subtitle: 'Mathematics • Class 9', route: 'Subchapter', params: { subchapterId: 'math_9_1' } },
    { id: '2', type: 'lesson', title: 'Polynomials', subtitle: 'Mathematics • Class 9', route: 'Subchapter', params: { subchapterId: 'math_9_2' } },
    { id: '3', type: 'lesson', title: 'Atoms and Molecules', subtitle: 'Science • Class 9', route: 'Subchapter', params: { subchapterId: 'sci_9_3' } },
    { id: '4', type: 'simulation', title: 'Force Simulator', subtitle: 'Physics Simulation', route: 'ForcePlayGame', params: {} },
    { id: '5', type: 'simulation', title: 'Cell Structure', subtitle: 'Biology Quiz', route: 'CellStructureQuiz', params: {} },
    { id: '6', type: 'game', title: 'Quick Math', subtitle: 'Math Game', route: 'QuickMathGame', params: {} },
    { id: '7', type: 'game', title: 'Label the Organ', subtitle: 'Biology Game', route: 'LabelOrganGame', params: {} },
];

import { useResponsive } from '../hooks/useResponsive';

const SearchScreen = () => {
    const theme = useTheme();
    const navigation = useNavigation<any>();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const { containerStyle } = useResponsive();

    useEffect(() => {
        if (query.trim().length > 0) {
            setLoading(true);
            // Simulate search delay
            const timer = setTimeout(() => {
                const filtered = SEARCH_DATA.filter(item =>
                    item.title.toLowerCase().includes(query.toLowerCase()) ||
                    item.subtitle.toLowerCase().includes(query.toLowerCase())
                );
                setResults(filtered);
                setLoading(false);
            }, 300);
            return () => clearTimeout(timer);
        } else {
            setResults([]);
        }
    }, [query]);

    const getIconForType = (type: string) => {
        switch (type) {
            case 'lesson': return 'book-open-variant';
            case 'simulation': return 'flask';
            case 'game': return 'gamepad-variant';
            default: return 'magnify';
        }
    };

    const getColorForType = (type: string) => {
        switch (type) {
            case 'lesson': return '#4F46E5'; // Indigo
            case 'simulation': return '#0EA5E9'; // Sky
            case 'game': return '#F59E0B'; // Amber
            default: return '#666';
        }
    };

    const renderItem = ({ item, index }: any) => (
        <Animated.View entering={FadeInDown.delay(index * 50).duration(300)}>
            <TouchableOpacity onPress={() => navigation.navigate(item.route, item.params)}>
                <Surface style={styles.resultCard} elevation={1}>
                    <View style={[styles.iconBox, { backgroundColor: getColorForType(item.type) + '20' }]}>
                        <MaterialCommunityIcons name={getIconForType(item.type) as any} size={24} color={getColorForType(item.type)} />
                    </View>
                    <View style={styles.resultContent}>
                        <Text variant="titleMedium" style={styles.resultTitle}>{item.title}</Text>
                        <Text variant="bodySmall" style={styles.resultSubtitle}>{item.subtitle}</Text>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={24} color="#ccc" />
                </Surface>
            </TouchableOpacity>
        </Animated.View>
    );

    return (
        <GradientBackground colors={gradients.onboarding}>
            <View style={[styles.container, containerStyle]}>
                <View style={styles.header}>
                    <IconButton icon="arrow-left" onPress={() => navigation.goBack()} />
                    <Surface style={styles.searchBar} elevation={2}>
                        <MaterialCommunityIcons name="magnify" size={24} color="#666" style={styles.searchIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Search lessons, games, topics..."
                            value={query}
                            onChangeText={setQuery}
                            autoFocus
                            placeholderTextColor="#999"
                        />
                        {query.length > 0 && (
                            <TouchableOpacity onPress={() => setQuery('')}>
                                <MaterialCommunityIcons name="close-circle" size={20} color="#999" />
                            </TouchableOpacity>
                        )}
                    </Surface>
                </View>

                {loading ? (
                    <View style={styles.centerContainer}>
                        <ActivityIndicator size="large" color={theme.colors.primary} />
                    </View>
                ) : (
                    <FlatList
                        data={results}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                        contentContainerStyle={styles.listContent}
                        ListEmptyComponent={
                            query.length > 0 ? (
                                <View style={styles.centerContainer}>
                                    <MaterialCommunityIcons name="file-search-outline" size={64} color="#ccc" />
                                    <Text style={styles.emptyText}>No results found for "{query}"</Text>
                                </View>
                            ) : (
                                <View style={styles.centerContainer}>
                                    <MaterialCommunityIcons name="magnify-scan" size={64} color="#ddd" />
                                    <Text style={styles.emptyText}>Type to start searching</Text>
                                    <Text style={styles.emptySubText}>Find lessons, simulations, and games</Text>
                                </View>
                            )
                        }
                    />
                )}
            </View>
        </GradientBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: spacing.xl,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.sm,
        marginBottom: spacing.md,
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: borderRadius.full,
        paddingHorizontal: spacing.md,
        height: 48,
        marginRight: spacing.md,
    },
    searchIcon: {
        marginRight: spacing.sm,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    listContent: {
        padding: spacing.md,
        paddingBottom: spacing.xxl,
    },
    resultCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        backgroundColor: '#fff',
        borderRadius: borderRadius.lg,
        marginBottom: spacing.sm,
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    resultContent: {
        flex: 1,
    },
    resultTitle: {
        fontWeight: 'bold',
        color: '#333',
    },
    resultSubtitle: {
        color: '#666',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 100,
    },
    emptyText: {
        marginTop: spacing.md,
        fontSize: 18,
        color: '#999',
        fontWeight: '500',
    },
    emptySubText: {
        marginTop: spacing.xs,
        color: '#bbb',
    },
});

export default SearchScreen;
