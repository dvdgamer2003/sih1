import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Image, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';

import { useAuth } from '../../context/AuthContext';
import { learnService } from '../../services/learnService';
import { progressService } from '../../services/progressService';
import { spacing } from '../../theme';
import { AVATAR_OPTIONS } from '../../data/avatars';
import ThemeToggle from '../../components/ThemeToggle';
import { useAppTheme } from '../../context/ThemeContext';

const { width: screenWidth } = Dimensions.get('window');
const cardWidth = (screenWidth - spacing.lg * 2 - spacing.sm) / 2;

const MobileLearnDashboard = ({ navigation }: any) => {
    const { user, xp, streak } = useAuth();
    const insets = useSafeAreaInsets();
    const { isDark } = useAppTheme();

    const [subjects, setSubjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedClass, setSelectedClass] = useState<number | null>(user?.class || 6);

    // Use real XP from context, capping daily goal at 50 for visual consistency
    const currentXP = xp % 100;
    const targetXP = 50;

    useEffect(() => {
        loadSubjects();
    }, [selectedClass]);

    const loadSubjects = async () => {
        setLoading(true);
        try {
            const classesData = await learnService.getClasses();
            if (!classesData || !Array.isArray(classesData)) {
                console.error('classesData is not an array:', classesData);
                setSubjects([]);
                return;
            }
            const currentClassData = classesData.find((c: any) => c.classNumber === selectedClass);

            if (currentClassData) {
                const subjectsData = await learnService.getSubjects(currentClassData._id);
                const subjectsWithProgress = await Promise.all(subjectsData.map(async (subject: any) => {
                    try {
                        const chapters = await learnService.getChapters(subject._id);
                        const chapterIds = chapters.map((ch: any) => ch._id);
                        // Fix: Use getSubjectProgress which matches the method in LearnDashboardScreen
                        const progressData = await progressService.getSubjectProgress(
                            subject._id,
                            `class-${selectedClass}`,
                            chapterIds.length
                        );
                        const progress = progressData.progress;
                        return { ...subject, progress };
                    } catch (e) {
                        return { ...subject, progress: 0 };
                    }
                }));
                setSubjects(subjectsWithProgress);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getSubjectIcon = (name: string) => {
        const icons: Record<string, string> = {
            'Mathematics': 'calculator',
            'Science': 'flask',
            'English': 'book-alphabet',
            'Social Studies': 'earth',
            'Hindi': 'translate',
            'Computer': 'laptop',
        };
        return icons[name] || 'book';
    };

    const getSubjectGradient = (name: string) => {
        // Unified vibrant gradients for both modes for a premium feel
        const gradients: Record<string, string[]> = {
            'Mathematics': ['#f12711', '#f5af19'],      // Red-Orange
            'Science': ['#11998e', '#38ef7d'],          // Teal-Green
            'English': ['#4A00E0', '#8E2DE2'],          // Deep Purple
            'Social Studies': ['#4e4376', '#2b5876'],   // Tech Blue
            'Hindi': ['#ec008c', '#fc6767'],            // Pink-Red
            'Computer': ['#00d2ff', '#3a7bd5'],         // Cyan-Blue
            'Computer Science': ['#00d2ff', '#3a7bd5'], // Cyan-Blue (Alternate name)
        };
        return gradients[name] || ['#607D8B', '#90A4AE']; // Default Grey-Blue
    };

    const bgColor = isDark ? '#121212' : '#F5F7FA';
    const textColor = isDark ? '#FFFFFF' : '#1A1A1A';
    const secondaryTextColor = isDark ? '#B0B0B0' : '#666666';
    const cardBgColor = isDark ? '#1E1E1E' : '#FFFFFF';
    const sectionIconColor = isDark ? '#8B7AFF' : '#6A5AE0';

    return (
        <View style={[styles.container, { backgroundColor: bgColor }]}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                {/* Premium Header */}
                <LinearGradient
                    colors={['#4A00E0', '#8E2DE2']} // Deep, vibrant Purple
                    style={[styles.header, { paddingTop: insets.top + 8 }]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    {/* Decorative Circles */}
                    <View style={[styles.decorativeCircle, { top: -40, right: -30, width: 120, height: 120 }]} />
                    <View style={[styles.decorativeCircle, { bottom: -20, left: -20, width: 80, height: 80 }]} />

                    {/* User Row */}
                    <View style={styles.userRow}>
                        <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.avatarButton}>
                            <View style={styles.avatarGlow}>
                                <Image
                                    source={(AVATAR_OPTIONS.find(a => a.id === parseInt(user?.avatar || '1')) || AVATAR_OPTIONS[0]).source}
                                    style={styles.avatar}
                                />
                            </View>
                        </TouchableOpacity>
                        <View style={styles.greeting}>
                            <Text style={styles.welcomeText}>Welcome back,</Text>
                            <Text style={styles.nameText}>{user?.name || 'Student'}</Text>
                        </View>
                        <View style={styles.headerActions}>
                            <ThemeToggle />
                            <View style={styles.streakBadge}>
                                <MaterialCommunityIcons name="fire" size={18} color="#FFD700" />
                                <Text style={styles.streakText}>{streak}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Enhanced Daily Goal with Glass Border */}
                    <View style={[styles.goalCard, { borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' }]}>
                        <LinearGradient
                            colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
                            style={styles.goalGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            <View style={styles.goalHeader}>
                                <View style={styles.goalIconBg}>
                                    <MaterialCommunityIcons name="target" size={20} color="#6A5AE0" />
                                </View>
                                <Text style={styles.goalTitle}>Daily Goal</Text>
                                <Text style={styles.goalXP}>{currentXP}/{targetXP} XP</Text>
                            </View>
                            <View style={styles.progressBarContainer}>
                                <LinearGradient
                                    colors={['#00C48C', '#64FFDA']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={[styles.progressFill, { width: `${Math.min((currentXP / targetXP) * 100, 100)}%` }]}
                                />
                            </View>
                            <Text style={styles.goalMotivation}>
                                {currentXP >= targetXP ? '🎉 Goal achieved!' : '💪 Keep going!'}
                            </Text>
                        </LinearGradient>
                    </View>
                </LinearGradient>

                {/* Content */}
                <View style={styles.content}>
                    {/* Explore Section */}
                    <Animated.View entering={FadeInDown.delay(100)} style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={[styles.sectionTitle, { color: textColor }]}>Explore</Text>
                            <MaterialCommunityIcons name="compass-outline" size={20} color={sectionIconColor} />
                        </View>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('ModelList')}
                            activeOpacity={0.9}
                            style={styles.exploreCard}
                        >
                            <LinearGradient
                                colors={['#00d2ff', '#3a7bd5']} // Vibrant Cyan-Blue
                                style={styles.exploreGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <View style={styles.exploreContent}>
                                    <View style={styles.exploreTextContainer}>
                                        <Text style={[styles.exploreTitle, { color: '#fff' }]}>Science Interactive</Text>
                                        <Text style={[styles.exploreSubtitle, { color: 'rgba(255,255,255,0.9)' }]}>Explore 3D Models</Text>
                                        <View style={[styles.exploreBadge, { backgroundColor: '#FF6B6B' }]}>
                                            <Text style={styles.exploreBadgeText}>NEW</Text>
                                        </View>
                                    </View>
                                    <View style={[styles.exploreIcon, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                                        <MaterialCommunityIcons name="cube-outline" size={36} color="#fff" />
                                    </View>
                                </View>
                            </LinearGradient>
                        </TouchableOpacity>
                    </Animated.View>

                    {/* Subjects */}
                    <Animated.View entering={FadeInDown.delay(150)} style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={[styles.sectionTitle, { color: textColor }]}>Your Subjects</Text>
                            <MaterialCommunityIcons name="school-outline" size={20} color={sectionIconColor} />
                        </View>
                        {loading ? (
                            <View style={styles.loadingContainer}>
                                <MaterialCommunityIcons name="loading" size={32} color={sectionIconColor} />
                                <Text style={[styles.loadingText, { color: secondaryTextColor }]}>Loading subjects...</Text>
                            </View>
                        ) : (
                            <View style={styles.subjectsGrid}>
                                {subjects.map((subject, index) => (
                                    <View key={subject._id} style={styles.subjectCardWrapper}>
                                        <TouchableOpacity
                                            activeOpacity={0.9}
                                            onPress={() => navigation.navigate('ChapterList', {
                                                subjectId: subject._id,
                                                subjectName: subject.name
                                            })}
                                        >
                                            <Animated.View entering={FadeInRight.delay(index * 100)}>
                                                <LinearGradient
                                                    colors={[...getSubjectGradient(subject.name), getSubjectGradient(subject.name)[1] + 'CC'] as any}
                                                    style={styles.subjectGradient}
                                                    start={{ x: 0, y: 0 }}
                                                    end={{ x: 1, y: 1 }}
                                                >
                                                    <View style={styles.subjectIconContainer}>
                                                        <View style={styles.subjectIconBg}>
                                                            <MaterialCommunityIcons
                                                                name={getSubjectIcon(subject.name) as any}
                                                                size={32}
                                                                color="#fff"
                                                            />
                                                        </View>
                                                    </View>
                                                    <Text style={styles.subjectName}>{subject.name}</Text>
                                                    <View style={styles.progressContainer}>
                                                        <View style={styles.progressBg}>
                                                            <View
                                                                style={[
                                                                    styles.progressBar,
                                                                    { width: `${subject.progress || 0}%` }
                                                                ]}
                                                            />
                                                        </View>
                                                        <Text style={styles.progressText}>
                                                            {Math.round(subject.progress || 0)}% Complete
                                                        </Text>
                                                    </View>
                                                </LinearGradient>
                                            </Animated.View>
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </View>
                        )}
                    </Animated.View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    header: {
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.lg,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        overflow: 'hidden',
        shadowColor: '#6A5AE0',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
    },
    decorativeCircle: {
        position: 'absolute',
        borderRadius: 999,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    userRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    avatarButton: {
        marginRight: spacing.sm,
    },
    avatarGlow: {
        padding: 2,
        borderRadius: 24,
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 3,
        borderColor: '#fff',
    },
    greeting: {
        flex: 1,
    },
    welcomeText: {
        color: 'rgba(255,255,255,0.95)',
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: 0.3,
    },
    nameText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 0.2,
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    streakBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.25)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 4,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    streakText: {
        color: '#FFD700',
        fontWeight: 'bold',
        fontSize: 14,
    },
    goalCard: {
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    goalGradient: {
        padding: spacing.md,
        borderRadius: 16,
    },
    goalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    goalIconBg: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    goalTitle: {
        flex: 1,
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    goalXP: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '700',
    },
    progressBarContainer: {
        height: 8,
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 6,
    },
    progressFill: {
        height: '100%',
        borderRadius: 4,
    },
    goalMotivation: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '600',
        textAlign: 'center',
    },
    content: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.lg,
    },
    section: {
        marginBottom: spacing.xl,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '500',
    },
    exploreCard: {
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#00838F',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    exploreGradient: {
        padding: spacing.lg,
    },
    exploreContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    exploreTextContainer: {
        flex: 1,
    },
    exploreTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#00838F',
        marginBottom: 4,
    },
    exploreSubtitle: {
        fontSize: 13,
        color: '#00ACC1',
        fontWeight: '600',
        marginBottom: 6,
    },
    exploreBadge: {
        backgroundColor: '#FF6B6B',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    exploreBadgeText: {
        color: '#fff',
        fontSize: 9,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    exploreIcon: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(255,255,255,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#00838F',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
    },
    loadingContainer: {
        padding: spacing.xl,
        alignItems: 'center',
        gap: spacing.sm,
    },
    loadingText: {
        fontSize: 14,
        fontWeight: '600',
    },
    subjectsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    subjectCardWrapper: {
        width: cardWidth,
        marginBottom: spacing.md,
    },
    subjectGradient: {
        padding: spacing.md,
        minHeight: 160,
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
    },
    subjectIconContainer: {
        marginBottom: spacing.sm,
    },
    subjectIconBg: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'rgba(255,255,255,0.35)',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    subjectName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: spacing.sm,
        textShadowColor: 'rgba(0,0,0,0.2)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    progressContainer: {
        marginTop: 'auto',
    },
    progressBg: {
        height: 5,
        backgroundColor: 'rgba(255,255,255,0.35)',
        borderRadius: 3,
        overflow: 'hidden',
        marginBottom: 6,
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#fff',
        borderRadius: 3,
        shadowColor: '#fff',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
    },
    progressText: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'right',
        textShadowColor: 'rgba(0,0,0,0.2)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
});

export default MobileLearnDashboard;
