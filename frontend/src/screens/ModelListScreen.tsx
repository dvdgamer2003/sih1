import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Platform } from 'react-native';
import { Text, useTheme, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MODEL_REGISTRY } from '../data/modelRegistry';
import { spacing, borderRadius } from '../theme';
import GradientBackground from '../components/ui/GradientBackground';
import { gradients } from '../theme';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';

import { useResponsive } from '../hooks/useResponsive';

const ModelListScreen = () => {
    const navigation = useNavigation();
    const theme = useTheme();
    const { containerStyle, isDesktop, isTablet } = useResponsive();

    const cols = isDesktop ? 3 : isTablet ? 2 : 1;

    const models = Object.keys(MODEL_REGISTRY).map((key, index) => ({
        name: key,
        id: key,
        gradientColors: getGradientForIndex(index),
    }));

    function getGradientForIndex(index: number): string[] {
        const gradients = [
            ['#9C27B0', '#BA68C8'], // Purple
            ['#2196F3', '#42A5F5'], // Blue
            ['#00BCD4', '#26C6DA'], // Cyan
            ['#4CAF50', '#66BB6A'], // Green
            ['#FF9800', '#FFB74D'], // Orange
            ['#E91E63', '#F06292'], // Pink
        ];
        return gradients[index % gradients.length];
    }

    const renderItem = ({ item, index }: { item: { name: string; id: string; gradientColors: string[] }, index: number }) => (
        <Animated.View entering={FadeInRight.delay(index * 80).duration(500)} style={styles.cardWrapper}>
            <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => (navigation as any).navigate('ThreeDModel', { model: item.id })}
                style={styles.cardTouchable}
            >
                <LinearGradient
                    colors={item.gradientColors as [string, string, ...string[]]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.card}
                >
                    <BlurView intensity={Platform.OS === 'web' ? 20 : 30} tint="light" style={styles.cardBlur}>
                        <View style={styles.cardContent}>
                            <LinearGradient
                                colors={['rgba(255,255,255,0.4)', 'rgba(255,255,255,0.2)']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.iconContainer}
                            >
                                <MaterialCommunityIcons name="cube-outline" size={32} color="#fff" />
                            </LinearGradient>
                            <View style={styles.textContainer}>
                                <Text variant="titleMedium" style={styles.modelName}>{item.name}</Text>
                                <Text variant="bodySmall" style={styles.modelDescription}>Tap to view 3D model</Text>
                            </View>
                            <MaterialCommunityIcons name="chevron-right" size={24} color="rgba(255,255,255,0.8)" />
                        </View>
                    </BlurView>
                </LinearGradient>
            </TouchableOpacity>
        </Animated.View>
    );

    return (
        <GradientBackground colors={gradients.cool}>
            <View style={styles.container}>
                <View style={[styles.header, containerStyle]}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text variant="titleLarge" style={styles.headerTitle}>3D Models Library</Text>
                    <View style={{ width: 40 }} />
                </View>

                <FlatList
                    key={cols}
                    data={models}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={[styles.listContent, containerStyle]}
                    showsVerticalScrollIndicator={false}
                    numColumns={cols}
                    columnWrapperStyle={cols > 1 ? { gap: spacing.lg } : undefined}
                />
            </View>
        </GradientBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: spacing.xl,
        paddingHorizontal: spacing.md,
        marginBottom: spacing.md,
    },
    backButton: {
        padding: 8,
        backgroundColor: 'rgba(255,255,255,0.25)',
        borderRadius: 12,
    },
    headerTitle: {
        color: '#fff',
        fontWeight: '800',
        fontSize: 20,
    },
    listContent: {
        padding: spacing.lg,
        paddingBottom: spacing.xxl,
        gap: spacing.lg,
    },
    cardWrapper: {
        marginBottom: spacing.sm,
        flex: 1,
    },
    cardTouchable: {
        borderRadius: borderRadius.xl,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
        elevation: 10,
    },
    card: {
        borderRadius: borderRadius.xl,
        overflow: 'hidden',
        minHeight: 100,
    },
    cardBlur: {
        flex: 1,
        borderRadius: borderRadius.xl,
        overflow: 'hidden',
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.xl,
        gap: spacing.md,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    textContainer: {
        flex: 1,
    },
    modelName: {
        fontWeight: '900',
        fontSize: 18,
        color: '#fff',
        letterSpacing: 0.3,
        textShadowColor: 'rgba(0, 0, 0, 0.4)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
        marginBottom: 4,
    },
    modelDescription: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 13,
        fontWeight: '600',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
});

export default ModelListScreen;
