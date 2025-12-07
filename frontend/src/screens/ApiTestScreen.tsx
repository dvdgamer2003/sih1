import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-paper';
import api from '../services/api';

// Simple test screen to verify API connection
export default function ApiTestScreen({ navigation }: any) {
    const [logs, setLogs] = useState<string[]>([]);
    const [testing, setTesting] = useState(false);

    const addLog = (message: string) => {
        setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    };

    const testConnection = async () => {
        setTesting(true);
        setLogs([]);

        try {
            addLog('🔍 Testing backend connection...');

            // Test root endpoint
            addLog('📡 Testing: GET /')
            const rootResponse = await fetch('http://localhost:5000/');
            const rootText = await rootResponse.text();
            addLog(`✅ Root endpoint: ${rootResponse.status} - ${rootText}`);

            // Test registration endpoint
            addLog('📡 Testing: POST /api/auth/register');
            const testData = {
                name: 'Test User',
                email: `test${Date.now()}@example.com`,
                password: 'test123',
                language: 'en'
            };

            const regResponse = await api.post('/auth/register', testData);
            addLog(`✅ Registration: ${regResponse.status} - Success!`);
            addLog(`Token received: ${regResponse.data.token ? 'YES' : 'NO'}`);

        } catch (error: any) {
            addLog(`❌ Error: ${error.message}`);
            addLog(`Error type: ${error.isNetworkError ? 'Network Error' : 'Other'}`);
            if (error.response) {
                addLog(`Status: ${error.response.status}`);
                addLog(`Data: ${JSON.stringify(error.response.data)}`);
            }
        } finally {
            setTesting(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>API Connection Test</Text>
                <Text style={styles.subtitle}>Use this to verify backend connectivity</Text>
            </View>

            <Button
                mode="contained"
                onPress={testConnection}
                loading={testing}
                disabled={testing}
                style={styles.button}
            >
                Test Backend Connection
            </Button>

            <ScrollView style={styles.logContainer}>
                {logs.length === 0 ? (
                    <Text style={styles.emptyText}>
                        Click "Test Backend Connection" to verify your API is working
                    </Text>
                ) : (
                    logs.map((log, index) => (
                        <Text key={index} style={styles.logText}>{log}</Text>
                    ))
                )}
            </ScrollView>

            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
            >
                <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 20,
    },
    header: {
        marginTop: 40,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
    },
    button: {
        marginBottom: 20,
    },
    logContainer: {
        flex: 1,
        backgroundColor: '#1e1e1e',
        borderRadius: 8,
        padding: 12,
    },
    emptyText: {
        color: '#888',
        textAlign: 'center',
        marginTop: 40,
    },
    logText: {
        color: '#fff',
        fontFamily: 'monospace',
        fontSize: 12,
        marginBottom: 4,
    },
    backButton: {
        marginTop: 16,
        padding: 12,
        backgroundColor: '#3b5998',
        borderRadius: 8,
        alignItems: 'center',
    },
    backButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
