import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button, Checkbox, Searchbar, Surface, Chip, ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import GradientBackground from '../../components/ui/GradientBackground';
import api from '../../services/api';

const ChapterAssignScreen = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [assignType, setAssignType] = useState<'chapter' | 'quiz' | 'customChapter'>('chapter');

    // Selection Data
    const [chapters, setChapters] = useState<any[]>([]);
    const [quizzes, setQuizzes] = useState<any[]>([]);
    const [customChapters, setCustomChapters] = useState<any[]>([]);
    const [students, setStudents] = useState<any[]>([]);

    // Selected Items
    const [selectedItem, setSelectedItem] = useState<string | null>(null);
    const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
    const [selectAllClass, setSelectAllClass] = useState<string | null>(null);

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [classFilter, setClassFilter] = useState('7');

    useEffect(() => {
        fetchData();
    }, [classFilter, assignType]);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch students for the class
            const studentsRes = await api.get(`/admin/users?role=student&class=${classFilter}`);
            setStudents(studentsRes.data);

            if (assignType === 'chapter') {
                const chaptersRes = await api.get(`/admin/chapters?class=${classFilter}`);
                setChapters(chaptersRes.data);
            } else if (assignType === 'quiz') {
                // Placeholder for quizzes
                setQuizzes([]);
            } else {
                // Placeholder for custom chapters (Need endpoint)
                // const customRes = await api.get('/teacher/chapters');
                setCustomChapters([]);
            }
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAssign = async () => {
        if (!selectedItem) {
            Alert.alert('Error', `Please select a ${assignType}`);
            return;
        }
        if (selectedStudents.length === 0 && !selectAllClass) {
            Alert.alert('Error', 'Please select students');
            return;
        }

        setLoading(true);
        try {
            let endpoint = '';
            let payload: any = {
                studentIds: selectAllClass ? [] : selectedStudents,
                classNumber: selectAllClass ? classFilter : undefined
            };

            if (assignType === 'chapter') {
                endpoint = '/teacher/assign-chapter';
                payload.chapterId = selectedItem;
            } else if (assignType === 'quiz') {
                endpoint = '/teacher/assign-quiz';
                payload.quizId = selectedItem;
            } else {
                endpoint = '/teacher/assign-custom-chapter';
                payload.chapterId = selectedItem;
            }

            await api.post(endpoint, payload);
            Alert.alert('Success', 'Assignment sent successfully!', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            console.error('Failed to assign:', error);
            Alert.alert('Error', 'Failed to assign');
        } finally {
            setLoading(false);
        }
    };

    const toggleStudent = (id: string) => {
        if (selectedStudents.includes(id)) {
            setSelectedStudents(selectedStudents.filter(s => s !== id));
        } else {
            setSelectedStudents([...selectedStudents, id]);
        }
        setSelectAllClass(null);
    };

    return (
        <GradientBackground>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Assign Work</Text>
                    <View style={{ width: 40 }} />
                </View>

                <View style={styles.typeSelector}>
                    <TouchableOpacity
                        style={[styles.typeBtn, assignType === 'chapter' && styles.typeBtnActive]}
                        onPress={() => setAssignType('chapter')}
                    >
                        <Text style={[styles.typeText, assignType === 'chapter' && styles.typeTextActive]}>Syllabus</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.typeBtn, assignType === 'customChapter' && styles.typeBtnActive]}
                        onPress={() => setAssignType('customChapter')}
                    >
                        <Text style={[styles.typeText, assignType === 'customChapter' && styles.typeTextActive]}>My Chapters</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.typeBtn, assignType === 'quiz' && styles.typeBtnActive]}
                        onPress={() => setAssignType('quiz')}
                    >
                        <Text style={[styles.typeText, assignType === 'quiz' && styles.typeTextActive]}>Quizzes</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.filterRow}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {['6', '7', '8', '9', '10'].map(c => (
                            <Chip
                                key={c}
                                selected={classFilter === c}
                                onPress={() => setClassFilter(c)}
                                style={styles.chip}
                                textStyle={{ color: classFilter === c ? '#fff' : '#000' }}
                                showSelectedOverlay
                            >
                                Class {c}
                            </Chip>
                        ))}
                    </ScrollView>
                </View>

                <ScrollView contentContainerStyle={styles.content}>
                    {loading ? (
                        <ActivityIndicator color="#fff" size="large" style={{ marginTop: 40 }} />
                    ) : (
                        <>
                            <Text style={styles.sectionTitle}>
                                Select {assignType === 'chapter' ? 'Syllabus Chapter' : assignType === 'quiz' ? 'Quiz' : 'Custom Chapter'}
                            </Text>
                            <ScrollView horizontal style={styles.itemScroll}>
                                {(assignType === 'chapter' ? chapters : assignType === 'quiz' ? quizzes : customChapters).map(item => (
                                    <TouchableOpacity
                                        key={item._id}
                                        style={[styles.itemCard, selectedItem === item._id && styles.itemCardActive]}
                                        onPress={() => setSelectedItem(item._id)}
                                    >
                                        <MaterialCommunityIcons
                                            name={assignType === 'quiz' ? 'clipboard-text' : 'book-open-variant'}
                                            size={32}
                                            color={selectedItem === item._id ? '#fff' : '#6366F1'}
                                        />
                                        <Text style={[styles.itemTitle, selectedItem === item._id && styles.itemTitleActive]} numberOfLines={2}>
                                            {item.title}
                                        </Text>
                                        <Text style={[styles.itemSub, selectedItem === item._id && styles.itemTitleActive]}>
                                            {item.subject}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                                {((assignType === 'quiz' && quizzes.length === 0) || (assignType === 'customChapter' && customChapters.length === 0)) && (
                                    <View style={styles.emptyItem}>
                                        <Text style={{ color: '#fff' }}>No items found. Create one first!</Text>
                                    </View>
                                )}
                            </ScrollView>

                            <View style={styles.studentHeader}>
                                <Text style={styles.sectionTitle}>Select Students</Text>
                                <TouchableOpacity onPress={() => setSelectAllClass(selectAllClass ? null : classFilter)}>
                                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                                        {selectAllClass ? 'Unselect All' : 'Select All Class'}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {students.map(student => (
                                <Surface key={student._id} style={styles.studentCard} elevation={1}>
                                    <Checkbox
                                        status={selectedStudents.includes(student._id) || selectAllClass ? 'checked' : 'unchecked'}
                                        onPress={() => toggleStudent(student._id)}
                                        color="#6366F1"
                                    />
                                    <View>
                                        <Text style={styles.studentName}>{student.name}</Text>
                                        <Text style={styles.studentEmail}>{student.email}</Text>
                                    </View>
                                </Surface>
                            ))}
                        </>
                    )}
                </ScrollView>

                <View style={styles.footer}>
                    <Button
                        mode="contained"
                        onPress={handleAssign}
                        style={styles.assignButton}
                        contentStyle={{ height: 50 }}
                    >
                        Assign to {selectAllClass ? 'Whole Class' : `${selectedStudents.length} Students`}
                    </Button>
                </View>
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
    typeSelector: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.2)',
        marginHorizontal: 20,
        borderRadius: 12,
        padding: 4,
        marginBottom: 16,
    },
    typeBtn: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 10,
    },
    typeBtnActive: {
        backgroundColor: '#fff',
    },
    typeText: {
        color: 'rgba(255,255,255,0.8)',
        fontWeight: '600',
    },
    typeTextActive: {
        color: '#6366F1',
        fontWeight: 'bold',
    },
    filterRow: {
        marginBottom: 16,
        paddingHorizontal: 20,
    },
    chip: {
        marginRight: 8,
        backgroundColor: 'rgba(255,255,255,0.9)',
    },
    content: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 12,
    },
    itemScroll: {
        marginBottom: 24,
    },
    itemCard: {
        width: 140,
        height: 140,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 12,
        marginRight: 12,
        justifyContent: 'space-between',
    },
    itemCardActive: {
        backgroundColor: '#6366F1',
        borderWidth: 2,
        borderColor: '#fff',
    },
    itemTitle: {
        fontWeight: 'bold',
        fontSize: 14,
        color: '#333',
    },
    itemTitleActive: {
        color: '#fff',
    },
    itemSub: {
        fontSize: 12,
        color: '#666',
    },
    emptyItem: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    studentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    studentCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 8,
    },
    studentName: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    studentEmail: {
        color: '#666',
        fontSize: 12,
    },
    footer: {
        padding: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    assignButton: {
        backgroundColor: '#4F46E5',
        borderRadius: 12,
    },
});

export default ChapterAssignScreen;
