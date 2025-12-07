import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button, Surface } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import GradientBackground from '../../components/ui/GradientBackground';
import api from '../../services/api';

const TeacherContentManagerScreen = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);

    // Chapter Details
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [selectedClass, setSelectedClass] = useState('6');
    const [subject, setSubject] = useState('Math');

    const handleSubmit = async () => {
        if (!title || !content || !subject || !selectedClass) {
            Alert.alert('Error', 'Please fill in all details');
            return;
        }

        setLoading(true);
        try {
            await api.post('/teacher/chapter', {
                title,
                content,
                classNumber: selectedClass,
                subject
            });
            Alert.alert('Success', 'Chapter created successfully!', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            console.error('Failed to create chapter:', error);
            Alert.alert('Error', 'Failed to create chapter');
        } finally {
            setLoading(false);
        }
    };

    return (
        <GradientBackground>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Create Chapter</Text>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView contentContainerStyle={styles.content}>
                    <Surface style={styles.card} elevation={2}>
                        <Text variant="titleLarge" style={styles.sectionTitle}>Chapter Details</Text>

                        <TextInput
                            label="Chapter Title"
                            value={title}
                            onChangeText={setTitle}
                            mode="outlined"
                            style={styles.input}
                        />

                        <View style={styles.row}>
                            <View style={styles.halfInput}>
                                <Text style={styles.label}>Class</Text>
                                <View style={styles.radioGroup}>
                                    {['6', '7', '8', '9', '10'].map(c => (
                                        <TouchableOpacity
                                            key={c}
                                            style={[styles.radioBtn, selectedClass === c && styles.radioBtnActive]}
                                            onPress={() => setSelectedClass(c)}
                                        >
                                            <Text style={[styles.radioText, selectedClass === c && styles.radioTextActive]}>{c}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Subject</Text>
                            <View style={styles.radioGroup}>
                                {['Math', 'Science', 'English', 'Social'].map(s => (
                                    <TouchableOpacity
                                        key={s}
                                        style={[styles.radioBtn, subject === s && styles.radioBtnActive]}
                                        onPress={() => setSubject(s)}
                                    >
                                        <Text style={[styles.radioText, subject === s && styles.radioTextActive]}>{s}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        <TextInput
                            label="Content (Markdown supported)"
                            value={content}
                            onChangeText={setContent}
                            mode="outlined"
                            multiline
                            numberOfLines={10}
                            style={[styles.input, { minHeight: 200 }]}
                        />
                    </Surface>

                    <Button
                        mode="contained"
                        onPress={handleSubmit}
                        loading={loading}
                        style={styles.submitButton}
                        contentStyle={{ height: 50 }}
                    >
                        Create Chapter
                    </Button>
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
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    content: {
        padding: 20,
        paddingBottom: 100,
    },
    card: {
        padding: 20,
        borderRadius: 16,
        backgroundColor: '#fff',
        marginBottom: 20,
    },
    sectionTitle: {
        fontWeight: 'bold',
        marginBottom: 16,
    },
    input: {
        marginBottom: 16,
        backgroundColor: '#fff',
    },
    row: {
        flexDirection: 'row',
        gap: 16,
    },
    halfInput: {
        flex: 1,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        color: '#666',
    },
    radioGroup: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 16,
    },
    radioBtn: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    radioBtnActive: {
        backgroundColor: '#6366F1',
        borderColor: '#6366F1',
    },
    radioText: {
        color: '#666',
    },
    radioTextActive: {
        color: '#fff',
        fontWeight: 'bold',
    },
    inputContainer: {
        marginBottom: 16,
    },
    submitButton: {
        backgroundColor: '#4F46E5',
        borderRadius: 12,
    },
});

export default TeacherContentManagerScreen;
