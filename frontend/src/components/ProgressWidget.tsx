import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Surface, ProgressBar, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { spacing, borderRadius, gradients } from '../theme';
import { LinearGradient } from 'expo-linear-gradient';

interface ProgressWidgetProps {
    completed: number;
    total: number;
}

const ProgressWidget: React.FC<ProgressWidgetProps> = ({ completed, total }) => {
    const theme = useTheme();
    const progress = total > 0 ? completed / total : 0;
    const percentage = Math.round(progress * 100);

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={[styles.iconContainer, { backgroundColor: theme.colors.primaryContainer }]}>
                    <MaterialCommunityIcons name="school" size={24} color={theme.colors.primary} />
                </View>

                <View style={styles.textContainer}>
                    <Text variant="titleSmall" style={styles.title}>Your Progress</Text>
                    <Text variant="bodySmall" style={styles.subtitle}>
                        {completed} of {total} lessons completed
                    </Text>
                </View>

                <View style={styles.percentageContainer}>
                    <Text variant="titleLarge" style={{ color: theme.colors.primary, fontWeight: '700' }}>
                        {percentage}%
                    </Text>
                </View>
            </View>

            <View style={styles.progressContainer}>
                <ProgressBar
                    progress={progress}
                    color={theme.colors.primary}
                    style={styles.progressBar}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: borderRadius.xl,
        marginBottom: spacing.xl,
        backgroundColor: '#fff',
        padding: spacing.md,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 2,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontWeight: '700',
        marginBottom: 2,
    },
    subtitle: {
        color: '#888',
    },
    percentageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressContainer: {
        height: 8,
        backgroundColor: '#F0F0F0',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBar: {
        height: 8,
        borderRadius: 4,
    }
});

export default ProgressWidget;
