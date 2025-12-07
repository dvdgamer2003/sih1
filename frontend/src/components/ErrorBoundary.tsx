import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null
        };
    }

    static getDerivedStateFromError(error: Error): State {
        return {
            hasError: true,
            error
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Error Boundary caught an error:', error, errorInfo);
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null
        });
    };

    render() {
        if (this.state.hasError) {
            return (
                <View style={styles.container}>
                    <Surface style={styles.errorCard} elevation={4}>
                        <MaterialCommunityIcons
                            name="alert-circle-outline"
                            size={64}
                            color="#F44336"
                            style={styles.icon}
                        />
                        <Text variant="headlineSmall" style={styles.title}>
                            Oops! Something went wrong
                        </Text>
                        <Text variant="bodyMedium" style={styles.message}>
                            We're sorry for the inconvenience. The app encountered an unexpected error.
                        </Text>
                        {__DEV__ && this.state.error && (
                            <Text variant="bodySmall" style={styles.errorDetails}>
                                {this.state.error.toString()}
                            </Text>
                        )}
                        <Button
                            mode="contained"
                            onPress={this.handleReset}
                            style={styles.button}
                        >
                            Try Again
                        </Button>
                    </Surface>
                </View>
            );
        }

        return this.props.children;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    errorCard: {
        padding: 24,
        borderRadius: 16,
        maxWidth: 400,
        width: '100%',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    icon: {
        marginBottom: 16,
    },
    title: {
        marginBottom: 12,
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#333',
    },
    message: {
        marginBottom: 16,
        textAlign: 'center',
        color: '#666',
    },
    errorDetails: {
        marginBottom: 16,
        padding: 12,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        fontFamily: 'monospace',
        color: '#d32f2f',
    },
    button: {
        marginTop: 8,
    },
});

export default ErrorBoundary;
