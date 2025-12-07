import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button, RadioButton, IconButton, useTheme, Surface, HelperText } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import GradientBackground from '../../components/ui/GradientBackground';
import api from '../../services/api';

const TeacherQuizCreatorScreen = () => {
    const navigation = useNavigation();
    const theme = useTheme();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const routes = navigation.getState()?.routes;
    const quizCreatorRoute = routes?.find((r: any) => r.name === 'TeacherQuizCreator');
    const { quizToEdit } = (quizCreatorRoute?.params as any) || {};
    const isEditing = !!quizToEdit;

    // Quiz Details
    const [title, setTitle] = useState(quizToEdit?.title || '');
    const [description, setDescription] = useState(quizToEdit?.description || '');
    const [selectedClass, setSelectedClass] = useState(quizToEdit?.classNumber || '6');
    const [subject, setSubject] = useState(quizToEdit?.subject || 'Math');

    // Questions
    const [questions, setQuestions] = useState(quizToEdit?.questions || [
        { question: '', options: ['', '', '', ''], correctIndex: 0 }
    ]);

    const handleAddQuestion = () => {
        setQuestions([...questions, { question: '', options: ['', '', '', ''], correctIndex: 0 }]);
    };

    const handleRemoveQuestion = (index: number) => {
        const newQuestions = [...questions];
        newQuestions.splice(index, 1);
        setQuestions(newQuestions);
    };

    const updateQuestion = (index: number, field: string, value: any) => {
        const newQuestions = [...questions];
        // @ts-ignore
        newQuestions[index][field] = value;
        setQuestions(newQuestions);
    };

    const updateOption = (qIndex: number, oIndex: number, value: string) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options[oIndex] = value;
        setQuestions(newQuestions);
    };

    const handleSubmit = async () => {
        if (!title || !subject || !selectedClass) {
            Alert.alert('Error', 'Please fill in all quiz details');
            return;
        }

        // Validate questions
        for (let i = 0; i < questions.length; i++) {
            if (!questions[i].question) {
                Alert.alert('Error', `Question ${i + 1} is missing text`);
                return;
            }
            if (questions[i].options.some((opt: string) => !opt)) {
                Alert.alert('Error', `Question ${i + 1} has empty options`);
                return;
            }
        }

        setLoading(true);
        try {
            if (isEditing) {
                await api.put(`/teacher/quiz/${quizToEdit._id}`, {
                    title,
                    description,
                    classNumber: selectedClass,
                    subject,
                    questions
                });
                Alert.alert('Success', 'Quiz updated successfully!', [
                    { text: 'OK', onPress: () => navigation.goBack() }
                ]);
            } else {
                await api.post('/teacher/quiz', {
                    title,
                    description,
                    classNumber: selectedClass,
                    subject,
                    questions
                });
                Alert.alert('Success', 'Quiz created successfully!', [
                    { text: 'OK', onPress: () => navigation.goBack() }
                ]);
            }
        } catch (error) {
            console.error('Failed to save quiz:', error);
            Alert.alert('Error', 'Failed to save quiz');
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
                    <Text style={styles.headerTitle}>{isEditing ? 'Edit Quiz' : 'Create Quiz'}</Text>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView contentContainerStyle={styles.content}>
                    <Surface style={styles.card} elevation={2}>
                        <Text variant="titleLarge" style={styles.sectionTitle}>Quiz Details</Text>

                        <TextInput
                            label="Quiz Title"
                            value={title}
                            onChangeText={setTitle}
                            mode="outlined"
                            style={styles.input}
                        />

                        <TextInput
                            label="Description (Optional)"
                            value={description}
                            onChangeText={setDescription}
                            mode="outlined"
                            multiline
                            numberOfLines={3}
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
                    </Surface>

                    <Text variant="titleLarge" style={[styles.sectionTitle, { color: '#fff', marginTop: 20 }]}>Questions</Text>

                    {questions.map((q: any, qIndex: number) => (
                        <Surface key={qIndex} style={styles.questionCard} elevation={2}>
                            <View style={styles.questionHeader}>
                                <Text variant="titleMedium">Question {qIndex + 1}</Text>
                                {questions.length > 1 && (
                                    <IconButton icon="delete" iconColor="red" onPress={() => handleRemoveQuestion(qIndex)} />
                                )}
                            </View>

                            <TextInput
                                label="Question Text"
                                value={q.question}
                                onChangeText={(text) => updateQuestion(qIndex, 'question', text)}
                                mode="outlined"
                                style={styles.input}
                            />

                            <Text style={styles.label}>Options</Text>
                            {q.options.map((opt: string, oIndex: number) => (
                                <View key={oIndex} style={styles.optionRow}>
                                    <RadioButton
                                        value={oIndex.toString()}
                                        status={q.correctIndex === oIndex ? 'checked' : 'unchecked'}
                                        onPress={() => updateQuestion(qIndex, 'correctIndex', oIndex)}
                                    />
                                    <TextInput
                                        label={`Option ${oIndex + 1}`}
                                        value={opt}
                                        onChangeText={(text) => updateOption(qIndex, oIndex, text)}
                                        mode="outlined"
                                        style={[styles.input, { flex: 1, marginBottom: 0 }]}
                                    />
                                </View>
                            ))}
                        </Surface>
                    ))}

                    <Button
                        mode="outlined"
                        onPress={handleAddQuestion}
                        style={styles.addButton}
                        icon="plus"
                        textColor="#fff"
                    >
                        Add Question
                    </Button>

                    <Button
                        mode="contained"
                        onPress={handleSubmit}
                        loading={loading}
                        style={styles.submitButton}
                        contentStyle={{ height: 50 }}
                    >
                        {isEditing ? 'Update Quiz' : 'Create Quiz'}
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
        marginBottom: 10,
    },
    questionCard: {
        padding: 20,
        borderRadius: 16,
        backgroundColor: '#fff',
        marginBottom: 16,
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
    questionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    addButton: {
        borderColor: '#fff',
        borderWidth: 1,
        marginBottom: 20,
    },
    submitButton: {
        backgroundColor: '#4F46E5',
        borderRadius: 12,
    },
});

export default TeacherQuizCreatorScreen;
