import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import GradientBackground from '../components/ui/GradientBackground';

const TeacherChapterViewerScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { chapter } = route.params as any;

    return (
        <GradientBackground>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle} numberOfLines={1}>{chapter.title}</Text>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView contentContainerStyle={styles.content}>
                    <Surface style={styles.card} elevation={2}>
                        <Text style={styles.subject}>{chapter.subject} • Class {chapter.classNumber}</Text>
                        <Text style={styles.title}>{chapter.title}</Text>
                        <View style={styles.divider} />
                        <Text style={styles.body}>{chapter.content}</Text>
                    </Surface>
                </ScrollView>
            </View>
        </GradientBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 60,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    backButton: {
        padding: 8,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 12,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        flex: 1,
        textAlign: 'center',
        marginHorizontal: 10,
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    card: {
        padding: 24,
        borderRadius: 20,
        backgroundColor: '#fff',
        minHeight: 500,
    },
    subject: {
        fontSize: 14,
        color: '#666',
        fontWeight: '600',
        marginBottom: 8,
        textTransform: 'uppercase',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    divider: {
        height: 1,
        backgroundColor: '#eee',
        marginBottom: 20,
    },
    body: {
        fontSize: 16,
        lineHeight: 26,
        color: '#444',
    },
});

export default TeacherChapterViewerScreen;
