import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, useTheme, ActivityIndicator } from 'react-native-paper';
import { learnService } from '../../services/learnService';
import GradientBackground from '../../components/ui/GradientBackground';
import CustomCard from '../../components/ui/CustomCard';
import { spacing, gradients } from '../../theme';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ClassSelectionScreen = ({ navigation }: any) => {
    const theme = useTheme();
    const [classes, setClasses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadClasses();
    }, []);

    const loadClasses = async () => {
        try {
            const data = await learnService.getClasses();
            setClasses(data);
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
                onPress={() => navigation.navigate('SubjectSelection', { classId: item._id, classNumber: item.classNumber })}
            >
                <View style={styles.cardContent}>
                    <View style={[styles.iconContainer, { backgroundColor: theme.colors.primaryContainer }]}>
                        <Text variant="displayMedium" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
                            {item.classNumber}
                        </Text>
                    </View>
                    <Text variant="titleLarge" style={styles.cardTitle}>
                        Class {item.classNumber}
                    </Text>
                    <Text variant="bodyMedium" style={styles.cardSubtitle}>
                        {item.subjects?.length || 0} Subjects
                    </Text>
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
        <GradientBackground colors={gradients.primary}>
            <View style={styles.container}>
                <Text variant="headlineMedium" style={styles.headerTitle}>
                    Select Your Class
                </Text>
                <FlatList
                    data={classes}
                    renderItem={renderItem}
                    keyExtractor={(item) => item._id}
                    numColumns={2}
                    contentContainerStyle={styles.listContent}
                    columnWrapperStyle={styles.columnWrapper}
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
    headerTitle: {
        textAlign: 'center',
        color: '#fff',
        fontWeight: 'bold',
        marginBottom: spacing.lg,
    },
    listContent: {
        padding: spacing.md,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    card: {
        width: '48%',
        marginBottom: spacing.md,
        aspectRatio: 0.8,
    },
    cardContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.md,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    cardTitle: {
        fontWeight: 'bold',
        textAlign: 'center',
    },
    cardSubtitle: {
        opacity: 0.7,
        marginTop: spacing.xs,
    },
});

export default ClassSelectionScreen;
