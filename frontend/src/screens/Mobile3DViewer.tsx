import React, { useState } from 'react';
import { View, StyleSheet, Platform, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { Text } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { spacing } from '../theme';

// Helper function to get model source
const getModelSource = (modelName: string): any => {
    const modelMap: Record<string, any> = {
        'Thorax and Abdomen': require('../../assets/models/thorax.glb'),
        'Human Brain': require('../../assets/models/3d-allen-f-brain.glb'),
        'Blood Vasculature': require('../../assets/models/3d-vh-f-blood-vasculature.glb'),
        'Human Heart': require('../../assets/models/3d-vh-f-heart.glb'),
        'Human Kidney': require('../../assets/models/3d-vh-f-kidney-l.glb'),
        'Human Liver': require('../../assets/models/3d-vh-f-liver.glb'),
        'Human Lung': require('../../assets/models/3d-vh-f-lung.glb'),
        'Human Eye': require('../../assets/models/3d-vh-m-eye-l.glb'),
        'Whole Heart': require('../../assets/models/heart-_whole.glb'),
        'Brain Model': require('../../assets/models/brain1.glb'),
        'Digestive System': require('../../assets/models/digestivesystem.glb'),
        'Lungs Model': require('../../assets/models/lungs1.glb'),
    };
    return modelMap[modelName] || require('../../assets/models/thorax.glb');
};

const getHtmlContent = (modelUrl: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.3.0/model-viewer.min.js"></script>
    <style>
        * { margin: 0; padding: 0; }
        body { margin: 0; overflow: hidden; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        model-viewer { width: 100vw; height: 100vh; }
    </style>
</head>
<body>
    <model-viewer
        src="${modelUrl}"
        camera-controls
        auto-rotate
        shadow-intensity="1"
    ></model-viewer>
</body>
</html>
`;

const Mobile3DViewer = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { model } = route.params as { model?: string } || {};
    const insets = useSafeAreaInsets();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const modelName = model || 'Thorax and Abdomen';

    // Resolve asset URI
    const source = getModelSource(modelName);
    const modelUri = Image.resolveAssetSource(source).uri;
    const htmlContent = getHtmlContent(modelUri);

    return (
        <View style={styles.container}>
            {/* Header */}
            <LinearGradient
                colors={['#667EEA', '#764BA2', '#5B4B8A']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.header, { paddingTop: insets.top + spacing.md }]}
            >
                <View style={styles.headerContent}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.backButton}
                        activeOpacity={0.7}
                    >
                        <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
                    </TouchableOpacity>
                    <View style={styles.titleContainer}>
                        <Text variant="headlineSmall" style={styles.title}>
                            3D Model Viewer
                        </Text>
                        <Text style={styles.subtitle}>
                            {modelName}
                        </Text>
                    </View>
                    <View style={{ width: 48 }} />
                </View>
            </LinearGradient>

            {/* WebView Content */}
            {error ? (
                <View style={styles.errorContainer}>
                    <MaterialCommunityIcons name="alert-circle" size={64} color="#EF4444" />
                    <Text style={styles.errorText}>{error}</Text>
                    <Text style={styles.errorSubText}>Please check your connection and try again.</Text>
                    <TouchableOpacity
                        style={styles.retryButton}
                        onPress={() => {
                            setError(null);
                            setLoading(true);
                        }}
                    >
                        <Text style={styles.retryButtonText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.webviewContainer}>
                    <WebView
                        source={{ html: htmlContent, baseUrl: 'http://192.168.1.7:8081/' }}
                        style={styles.webview}
                        onLoadStart={() => setLoading(true)}
                        onLoadEnd={() => setLoading(false)}
                        onError={(syntheticEvent) => {
                            const { nativeEvent } = syntheticEvent;
                            console.warn('WebView error: ', nativeEvent);
                            setError('Failed to load model');
                            setLoading(false);
                        }}
                        androidLayerType="software"
                        opacity={0.99}
                    />
                    {loading && (
                        <View style={styles.loadingOverlay}>
                            <ActivityIndicator size="large" color="#667EEA" />
                            <Text style={styles.loadingText}>Loading 3D Model...</Text>
                        </View>
                    )}
                </View>
            )}

            {/* Instructions */}
            <View style={styles.instructionsBar}>
                <Text style={styles.instructionsText}>
                    💡 Drag to rotate • Pinch to zoom • Tap controls to pause rotation
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    header: {
        paddingBottom: spacing.xl,
        paddingHorizontal: spacing.lg,
        shadowColor: '#764BA2',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 12,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    titleContainer: {
        flex: 1,
        alignItems: 'center',
    },
    title: {
        color: '#fff',
        fontWeight: '800',
        fontSize: 22,
        letterSpacing: 0.5,
    },
    subtitle: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 13,
        marginTop: 2,
        fontWeight: '500',
    },
    webviewContainer: {
        flex: 1,
        position: 'relative',
    },
    webview: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.9)',
    },
    loadingText: {
        color: '#667EEA',
        marginTop: spacing.md,
        fontSize: 16,
        fontWeight: '600',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
    },
    errorText: {
        color: '#EF4444',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: spacing.lg,
        marginBottom: spacing.sm,
        textAlign: 'center',
    },
    errorSubText: {
        color: '#666',
        textAlign: 'center',
        marginBottom: spacing.xl,
    },
    retryButton: {
        backgroundColor: '#667EEA',
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.md,
        borderRadius: 24,
        elevation: 4,
        shadowColor: '#667EEA',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    retryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    instructionsBar: {
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        borderTopWidth: 1,
        borderTopColor: 'rgba(102, 126, 234, 0.2)',
    },
    instructionsText: {
        color: '#667EEA',
        fontSize: 12,
        fontWeight: '600',
        textAlign: 'center',
        letterSpacing: 0.2,
    },
});

export default Mobile3DViewer;
