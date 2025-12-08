import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, RefreshControl, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../../services/api';

const TeacherClassroomScreen = () => {
    const navigation = useNavigation();
    const [content, setContent] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        setLoading(true);
        try {
            const response = await api.get('/teacher/content');
            setContent(response.data);
        } catch (error) {
            console.error('Failed to fetch content', error);
            Alert.alert('Error', 'Failed to load content');
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchContent();
        setRefreshing(false);
    };

    const getTypeGradient = (type: string): [string, string] => {
        return type === 'quiz' ? ['#EC4899', '#F472B6'] : ['#059669', '#34D399'];
    };

    return (
        <View style={styles.container}>
            {/* Gradient Header */}
            <LinearGradient
                colors={['#6200EA', '#7C4DFF']}
                style={styles.header}
            >
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
                </TouchableOpacity>
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>Classroom Preview</Text>
                    <Text style={styles.headerSubtitle}>Your created content</Text>
                </View>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => {
                        Alert.alert(
                            'Create Content',
                            'What would you like to create?',
                            [
                                { text: 'Cancel', style: 'cancel' },
                                {
                                    text: 'New Quiz',
                                    onPress: () => (navigation as any).navigate('TeacherQuizCreator')
                                },
                                {
                                    text: 'New Chapter',
                                    onPress: () => (navigation as any).navigate('TeacherContentManager')
                                }
                            ]
                        );
                    }}
                >
                    <MaterialCommunityIcons name="plus" size={24} color="#6200EA" />
                </TouchableOpacity>
            </LinearGradient>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#6200EA" />
                </View>
            ) : (
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6200EA" />
                    }
                >
                    {content.length > 0 ? (
                        <>
                            <View style={styles.statsRow}>
                                <View style={styles.statCard}>
                                    <MaterialCommunityIcons name="clipboard-text" size={24} color="#EC4899" />
                                    <Text style={styles.statValue}>{content.filter(c => c.type === 'quiz').length}</Text>
                                    <Text style={styles.statLabel}>Quizzes</Text>
                                </View>
                                <View style={styles.statCard}>
                                    <MaterialCommunityIcons name="book-open-page-variant" size={24} color="#059669" />
                                    <Text style={styles.statValue}>{content.filter(c => c.type === 'chapter').length}</Text>
                                    <Text style={styles.statLabel}>Chapters</Text>
                                </View>
                            </View>

                            <View style={styles.contentList}>
                                {content.map((item, index) => (
                                    <View key={index} style={styles.contentCard}>
                                        {/* Type Badge */}
                                        <LinearGradient
                                            colors={getTypeGradient(item.type)}
                                            style={styles.typeStripe}
                                        />

                                        <View style={styles.cardContent}>
                                            <View style={styles.cardHeader}>
                                                <View style={[styles.iconContainer, {
                                                    backgroundColor: item.type === 'quiz' ? '#FCE7F3' : '#D1FAE5'
                                                }]}>
                                                    <MaterialCommunityIcons
                                                        name={item.type === 'quiz' ? 'clipboard-text' : 'book-open-page-variant'}
                                                        size={24}
                                                        color={item.type === 'quiz' ? '#EC4899' : '#059669'}
                                                    />
                                                </View>
                                                <View style={styles.cardInfo}>
                                                    <Text style={styles.cardTitle}>{item.title}</Text>
                                                    <Text style={styles.cardSubtitle}>
                                                        {item.subject} • Class {item.classNumber}
                                                    </Text>
                                                </View>
                                            </View>

                                            <View style={styles.metadata}>
                                                <View style={styles.metaItem}>
                                                    <MaterialCommunityIcons name="calendar" size={14} color="#999" />
                                                    <Text style={styles.metaText}>
                                                        {new Date(item.createdAt).toLocaleDateString()}
                                                    </Text>
                                                </View>
                                                <LinearGradient
                                                    colors={getTypeGradient(item.type)}
                                                    style={styles.typeBadge}
                                                >
                                                    <Text style={styles.typeBadgeText}>
                                                        {item.type === 'quiz' ? 'Quiz' : 'Chapter'}
                                                    </Text>
                                                </LinearGradient>
                                            </View>

                                            {/* Actions */}
                                            <View style={styles.actionRow}>
                                                <TouchableOpacity
                                                    style={[styles.actionButton, styles.previewButton]}
                                                    onPress={() => {
                                                        if (item.type === 'quiz') {
                                                            (navigation as any).navigate('Quiz', { quizData: item, previewMode: true });
                                                        } else {
                                                            (navigation as any).navigate('TeacherChapterViewer', { chapter: item });
                                                        }
                                                    }}
                                                >
                                                    <MaterialCommunityIcons name="eye" size={18} color="#fff" />
                                                    <Text style={styles.actionButtonText}>
                                                        {item.type === 'quiz' ? 'Preview' : 'Read'}
                                                    </Text>
                                                </TouchableOpacity>

                                                {item.type === 'quiz' && (
                                                    <TouchableOpacity
                                                        style={[styles.actionButton, styles.editButton]}
                                                        onPress={() => (navigation as any).navigate('TeacherQuizCreator', { quizToEdit: item })}
                                                    >
                                                        <MaterialCommunityIcons name="pencil" size={18} color="#fff" />
                                                    </TouchableOpacity>
                                                )}

                                                <TouchableOpacity
                                                    style={[styles.actionButton, styles.deleteButton]}
                                                    onPress={() => {
                                                        Alert.alert(
                                                            'Delete Content',
                                                            'Are you sure you want to delete this?',
                                                            [
                                                                { text: 'Cancel', style: 'cancel' },
                                                                {
                                                                    text: 'Delete',
                                                                    style: 'destructive',
                                                                    onPress: async () => {
                                                                        try {
                                                                            if (item.type === 'quiz') {
                                                                                await api.delete(`/teacher/quiz/${item._id}`);
                                                                            } else {
                                                                                await api.delete(`/teacher/chapter/${item._id}`);
                                                                            }
                                                                            fetchContent();
                                                                        } catch (error) {
                                                                            Alert.alert('Error', 'Failed to delete content');
                                                                        }
                                                                    }
                                                                }
                                                            ]
                                                        );
                                                    }}
                                                >
                                                    <MaterialCommunityIcons name="delete" size={18} color="#fff" />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </>
                    ) : (
                        <View style={styles.emptyState}>
                            <LinearGradient
                                colors={['rgba(98, 0, 234, 0.1)', 'rgba(124, 77, 255, 0.1)']}
                                style={styles.emptyIconContainer}
                            >
                                <MaterialCommunityIcons name="notebook-check-outline" size={64} color="#6200EA" />
                            </LinearGradient>
                            <Text style={styles.emptyTitle}>No content yet!</Text>
                            <Text style={styles.emptyText}>
                                Create engaging quizzes and chapters for your students to learn from.
                            </Text>

                            {/* CTA Buttons */}
                            <View style={styles.ctaButtons}>
                                <TouchableOpacity
                                    style={styles.ctaButton}
                                    onPress={() => (navigation as any).navigate('TeacherQuizCreator')}
                                >
                                    <LinearGradient
                                        colors={['#EC4899', '#F472B6']}
                                        style={styles.ctaGradient}
                                    >
                                        <MaterialCommunityIcons name="clipboard-text" size={20} color="#fff" />
                                        <Text style={styles.ctaText}>Create Quiz</Text>
                                    </LinearGradient>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.ctaButton}
                                    onPress={() => (navigation as any).navigate('TeacherContentManager')}
                                >
                                    <LinearGradient
                                        colors={['#059669', '#34D399']}
                                        style={styles.ctaGradient}
                                    >
                                        <MaterialCommunityIcons name="book-open-page-variant" size={20} color="#fff" />
                                        <Text style={styles.ctaText}>Create Chapter</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </ScrollView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F7',
    },
    header: {
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        elevation: 8,
        shadowColor: '#6200EA',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    backButton: {
        padding: 8,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 12,
    },
    headerContent: {
        flex: 1,
        marginLeft: 16,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    headerSubtitle: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        marginTop: 2,
    },
    addButton: {
        backgroundColor: '#fff',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        padding: 16,
    },
    statsRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        elevation: 2,
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 8,
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
    contentList: {
        gap: 12,
    },
    contentCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    typeStripe: {
        height: 4,
    },
    cardContent: {
        padding: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    cardInfo: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    cardSubtitle: {
        fontSize: 12,
        color: '#666',
    },
    metadata: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    metaText: {
        fontSize: 12,
        color: '#999',
    },
    typeBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    typeBadgeText: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#fff',
    },
    actionRow: {
        flexDirection: 'row',
        gap: 8,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        borderRadius: 8,
        gap: 4,
    },
    previewButton: {
        backgroundColor: '#6200EA',
        flex: 1,
    },
    editButton: {
        backgroundColor: '#3B82F6',
        paddingHorizontal: 12,
    },
    deleteButton: {
        backgroundColor: '#EF4444',
        paddingHorizontal: 12,
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 60,
        paddingHorizontal: 20,
    },
    emptyIconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    emptyTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },
    emptyText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 32,
    },
    ctaButtons: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    ctaButton: {
        flex: 1,
        borderRadius: 12,
        overflow: 'hidden',
        elevation: 4,
    },
    ctaGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        gap: 8,
    },
    ctaText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default TeacherClassroomScreen;
