import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, ProgressBar, useTheme } from 'react-native-paper';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface XPProgressBarProps {
    currentXP: number;
    level: number;
}

const XPProgressBar: React.FC<XPProgressBarProps> = ({ currentXP, level }) => {
    const theme = useTheme();

    const xpForCurrentLevel = (level - 1) * 100;
    const xpForNextLevel = level * 100;
    const xpInCurrentLevel = currentXP - xpForCurrentLevel;
    const xpNeededForLevel = xpForNextLevel - xpForCurrentLevel;
    const progress = xpInCurrentLevel / xpNeededForLevel;

    return (
        <Animated.View entering={FadeInDown.duration(500)} style={styles.container}>
            <View style={styles.header}>
                <View style={styles.levelBadge}>
                    <Text variant="headlineMedium" style={styles.levelText}>
                        {level}
                    </Text>
                </View>
                <View style={styles.xpInfo}>
                    <Text variant="titleLarge" style={{ fontWeight: 'bold' }}>
                        Level {level}
                    </Text>
                    <Text variant="bodyMedium" style={{ color: theme.colors.secondary }}>
                        {xpInCurrentLevel} / {xpNeededForLevel} XP
                    </Text>
                </View>
            </View>

            <View style={styles.progressContainer}>
                <ProgressBar
                    progress={progress}
                    color={theme.colors.primary}
                    style={styles.progressBar}
                />
                <Text variant="bodySmall" style={styles.nextLevelText}>
                    {xpNeededForLevel - xpInCurrentLevel} XP to Level {level + 1}
                </Text>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 16,
        marginBottom: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    levelBadge: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#6750A4',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    levelText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    xpInfo: {
        flex: 1,
    },
    progressContainer: {
        marginTop: 8,
    },
    progressBar: {
        height: 12,
        borderRadius: 6,
    },
    nextLevelText: {
        marginTop: 8,
        textAlign: 'center',
        opacity: 0.7,
    },
});

export default XPProgressBar;
