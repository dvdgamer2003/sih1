import React from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit';
import { GameDifficulty, calculateDelta } from '../utils/deltaAssessment';

interface DeltaVisualizationProps {
    timeTaken: number;
    difficulty: GameDifficulty;
    earnedDelta: number;
}

const DeltaVisualization: React.FC<DeltaVisualizationProps> = ({ timeTaken, difficulty, earnedDelta }) => {
    const screenWidth = Dimensions.get('window').width;
    const chartWidth = Math.min(screenWidth - 40, 400);

    // Calculate Configuration constants again for plotting
    // We could import DIFFICULTY_CONFIG but recalculating ensures sync with logic if passed props differ
    // Note: In a real app, importing constant is better. assuming importing logic used in calculateDelta.
    // For visualization, we need to generate data points.

    // We'll generate a curve from 0 to 3x Threshold
    const config = calculateDelta(0, difficulty).config; // Get config specific to difficulty
    const threshold = config.threshold;
    const endX = threshold * 3;

    const dataPoints: number[] = [];
    const labels: string[] = [];

    // Generate ~10 points for the curve
    const step = endX / 9;
    for (let i = 0; i <= 9; i++) {
        const time = i * step;
        const result = calculateDelta(time, difficulty);
        dataPoints.push(result.delta);

        // Add minimal labels
        if (i === 0) labels.push("0s");
        else if (Math.abs(time - threshold) < step / 2) labels.push(`${Math.round(threshold / 60)}m`); // Mark Threshold roughly
        else if (i === 9) labels.push(`${Math.round(endX / 60)}m`);
        else labels.push("");
    }

    // Determine user's position
    const userXIndex = Math.min(9, (timeTaken / endX) * 9);

    return (
        <View style={styles.container}>
            <Text variant="titleMedium" style={styles.title}>Performance Curve</Text>
            <View style={styles.chartWrapper}>
                <LineChart
                    data={{
                        labels: labels,
                        datasets: [
                            {
                                data: dataPoints,
                                color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // Curve color
                                strokeWidth: 2
                            },
                            {
                                // User point (hacky way to overlay a point by making a single-point dataset? 
                                // ChartKit is restrictive. Better to use decorator or just the curve.)
                                // Let's simplify: Plot the curve, and overlay a marker view absolutely positioned?
                                // Actually, let's just show the curve. The specific point is hard to inject exactly in ChartKit without complex data structure.
                                // Alternative: Add the user's result to the dataset? No, that warps the X-axis.
                                data: [config.minDelta], // Dummy
                                withDots: false,
                                color: () => 'transparent'
                            }
                        ],
                        legend: ["Delta Decay"]
                    }}
                    width={chartWidth}
                    height={180}
                    yAxisLabel=""
                    yAxisSuffix=" pts"
                    chartConfig={{
                        backgroundColor: "#ffffff",
                        backgroundGradientFrom: "#ffffff",
                        backgroundGradientTo: "#ffffff",
                        decimalPlaces: 0,
                        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        style: {
                            borderRadius: 16
                        },
                        propsForDots: {
                            r: "4",
                            strokeWidth: "2",
                            stroke: "#ffa726"
                        }
                    }}
                    bezier
                    style={styles.chart}
                    withVerticalLines={false}
                />

                {/* Visual Marker for Threshold (Vertical Line approximation) */}
                {/* This requires precise pixel calculation which is brittle in ChartKit. 
                    Instead, we simply display the user's metrics below clearly. */}
            </View>

            <View style={styles.legendContainer}>
                <View style={[styles.legendItem, { backgroundColor: 'rgba(134, 65, 244, 0.2)' }]}>
                    <Text style={styles.legendText}>Decay Zone (&gt; {config.threshold}s)</Text>
                </View>
                <View style={styles.legendItem}>
                    <Text style={{ fontWeight: 'bold' }}>You: {formatTime(timeTaken)} ({earnedDelta} pts)</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginVertical: 10,
    },
    title: {
        marginBottom: 8,
        fontWeight: 'bold',
        opacity: 0.7
    },
    chartWrapper: {
        alignItems: 'center'
    },
    chart: {
        marginVertical: 8,
        borderRadius: 16
    },
    legendContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 20,
        marginTop: 5
    },
    legendItem: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4
    },
    legendText: {
        fontSize: 12,
        color: '#666'
    }
});

function formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

export default DeltaVisualization;
