import React, { useState, useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { View, StyleSheet, ScrollView, TouchableOpacity, FlatList, Dimensions, StatusBar } from 'react-native';
import { Text, useTheme, Avatar, ProgressBar, Surface, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInRight, FadeIn } from 'react-native-reanimated';
import UserGreetingCard from '../../components/UserGreetingCard';
import { useAuth } from '../../context/AuthContext';
import { useAppTheme } from '../../context/ThemeContext';
import { learnService } from '../../services/learnService';
import { progressService } from '../../services/progressService';
import { spacing, gradients, borderRadius } from '../../theme';
import { useResponsive } from '../../hooks/useResponsive';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MobileLearnDashboard from './MobileLearnDashboard'; // Mobile optimized dashboard

const { width } = Dimensions.get('window');

const LearnDashboardScreen = ({ navigation }: any) => {
    const theme = useTheme();
    const { isDark } = useAppTheme();
    const insets = useSafeAreaInsets();
    const { user, xp, streak } = useAuth();
    const { isMobile } = useResponsive();

    // Render mobile version if on mobile
    if (isMobile) {
        return <MobileLearnDashboard navigation={navigation} />;
    }

    // Desktop version continues below
    const [subjects, setSubjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedClass, setSelectedClass] = useState<number | null>(user?.selectedClass || null);
    const [filter, setFilter] = useState('All');

    const styles = createStyles(isDark);

    const isFocused = useIsFocused();

    useEffect(() => {
        if (user?.selectedClass) {
            setSelectedClass(user.selectedClass);
        }
    }, [user?.selectedClass]);

    useEffect(() => {
        if (selectedClass && isFocused) {
            loadSubjects();
        }
    }, [selectedClass, isFocused]);

    const loadSubjects = async () => {
        if (!selectedClass) return;

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

                // Load progress for each subject
                const subjectsWithProgress = await Promise.all(subjectsData.map(async (subject: any) => {
                    try {
                        const chapters = await learnService.getChapters(subject._id);
                        const chapterIds = chapters.map((ch: any) => ch._id);
                        // Fix: Use getSubjectProgress instead of calculateSubjectProgress
                        const progressData = await progressService.getSubjectProgress(
                            subject._id,
                            `class-${selectedClass}`,
                            chapterIds.length
                        );
                        return { ...subject, progress: progressData.progress / 100 }; // Convert 0-100 to 0-1
                    } catch (e) {
                        return { ...subject, progress: 0 };
                    }
                }));

                setSubjects(subjectsWithProgress);
            } else {
                setSubjects([]);
            }
        } catch (error) {
            console.error(error);
            setSubjects([]);
        } finally {
            setLoading(false);
        }
    };

    const getSubjectGradient = (subjectName: string) => {
        const gradients: Record<string, string[]> = {
            'Mathematics': ['#f12711', '#f5af19'],      // Red-Orange
            'Science': ['#11998e', '#38ef7d'],          // Teal-Green
            'English': ['#4A00E0', '#8E2DE2'],          // Deep Purple
            'Social Studies': ['#4e4376', '#2b5876'],   // Tech Blue
            'Hindi': ['#ec008c', '#fc6767'],            // Pink-Red
            'Computer Science': ['#00d2ff', '#3a7bd5'], // Cyan-Blue
        };
        // Default gradient for unknown subjects
        return gradients[subjectName] || ['#607D8B', '#90A4AE'];
    };

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            <UserGreetingCard
                userName={user?.name || 'Student'}
                streak={streak}
                avatarId={parseInt(user?.avatar || '1')}
                variant="light"
            />
        </View>
    );

    const renderDailyGoal = () => {
        const currentXP = 30;
        const targetXP = 50;
        const progress = currentXP / targetXP;

        return (
            <Animated.View entering={FadeIn.duration(600).delay(200)}>
                <Surface style={styles.dailyGoalCard} elevation={4}>
                    <View style={styles.goalHeader}>
                        <View style={styles.goalTitleRow}>
                            <View style={styles.goalIconContainer}>
                                <MaterialCommunityIcons name="target" size={22} color="#6A5AE0" />
                            </View>
                            <Text variant="titleSmall" style={styles.goalTitle}>Daily Goal</Text>
                        </View>
                        <Text variant="bodyMedium" style={styles.goalXP}>{currentXP}/{targetXP} XP</Text>
                    </View>
                    <View style={styles.progressContainer}>
                        <ProgressBar
                            progress={progress}
                            color="#6A5AE0"
                            style={styles.progressBar}
                        />
                    </View>
                    <Text variant="bodySmall" style={styles.goalMotivation}>
                        {progress >= 1 ? '🎉 Goal completed! Great job!' : '💪 Keep it up! You\'re almost there.'}
                    </Text>
                </Surface>
            </Animated.View>
        );
    };

    const renderSubjectItem = ({ item, index }: any) => {
        const displayTitle = item.name;
        const displayIcon = item.icon || 'book-open-variant';
        const displayColor = item.color || '#EDE7FF';
        const iconColor = '#6A5AE0';
        const progress = item.progress || 0;

        const handlePress = () => {
            navigation.navigate('ChapterList', { subjectId: item._id, subjectName: item.name });
        };

        return (
            <Animated.View
                entering={FadeInDown.delay(index * 80).duration(600).springify()}
                style={styles.subjectCardWrapper}
            >
                <TouchableOpacity
                    onPress={handlePress}
                    activeOpacity={0.85}
                    style={styles.subjectCard}
                >
                    <Surface style={styles.subjectCardContent} elevation={2}>
                        <LinearGradient
                            colors={getSubjectGradient(item.name) as any}
                            style={styles.iconBox}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            <MaterialCommunityIcons name={displayIcon} size={28} color="#fff" />
                        </LinearGradient>

                        <View style={styles.subjectInfo}>
                            <Text variant="titleMedium" style={styles.subjectName}>{displayTitle}</Text>
                            <View style={styles.progressRow}>
                                <View style={styles.progressBarContainer}>
                                    <ProgressBar
                                        progress={progress}
                                        color={iconColor}
                                        style={styles.miniProgressBar}
                                    />
                                </View>
                                <Text variant="bodySmall" style={styles.progressText}>{Math.round(progress * 100)}%</Text>
                            </View>
                        </View>

                        <View style={styles.chevronContainer}>
                            <MaterialCommunityIcons name="chevron-right" size={24} color="#999" />
                        </View>
                    </Surface>
                </TouchableOpacity>
            </Animated.View>
        );
    };

    // If no class selected, show prompt
    if (!selectedClass) {
        return (
            <View style={styles.container}>
                <StatusBar barStyle="light-content" backgroundColor="#6A5AE0" />
                <LinearGradient
                    colors={['#6A5AE0', '#8B7AFF']}
                    style={[styles.headerBackground, { paddingTop: insets.top + spacing.md, paddingBottom: 40 }]}
                >
                    {renderHeader()}
                </LinearGradient>

                <View style={[styles.contentContainer, { justifyContent: 'center', alignItems: 'center', padding: spacing.xl }]}>
                    <MaterialCommunityIcons name="school-outline" size={80} color={isDark ? '#475569' : '#CBD5E1'} />
                    <Text variant="headlineSmall" style={{ marginTop: spacing.lg, textAlign: 'center', fontWeight: 'bold', color: isDark ? '#F1F5F9' : '#1A1A1A' }}>
                        Select Your Class
                    </Text>
                    <Text variant="bodyLarge" style={{ marginTop: spacing.sm, textAlign: 'center', color: isDark ? '#94A3B8' : '#64748B', marginBottom: spacing.xl }}>
                        Please select your class in your profile to see relevant subjects and content.
                    </Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Profile')}
                        style={{
                            backgroundColor: '#6A5AE0',
                            paddingHorizontal: spacing.xl,
                            paddingVertical: spacing.md,
                            borderRadius: 12,
                            elevation: 4,
                            shadowColor: '#6A5AE0',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.3,
                            shadowRadius: 8,
                        }}
                    >
                        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Go to Profile</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#6A5AE0" />

            {/* Content Area */}
            <View style={styles.contentContainer}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Header Background */}
                    <LinearGradient
                        colors={['#6A5AE0', '#8B7AFF']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={[styles.headerBackground, { paddingTop: insets.top + spacing.md }]}
                    >
                        {renderHeader()}
                        <View style={styles.headerContent}>
                            {renderDailyGoal()}
                        </View>
                    </LinearGradient>

                    {/* Explore Section */}
                    <View style={styles.sectionHeader}>
                        <Text variant="titleLarge" style={styles.sectionTitle}>Explore</Text>
                    </View>

                    <View style={styles.exploreContainer}>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('ModelList')}
                            activeOpacity={0.9}
                        >
                            <Surface style={styles.exploreCard} elevation={2}>
                                <LinearGradient
                                    colors={['#E0F7FA', '#B2EBF2']}
                                    style={styles.exploreGradient}
                                >
                                    <View style={styles.exploreContent}>
                                        <View style={styles.exploreTextContainer}>
                                            <Text variant="titleMedium" style={styles.exploreTitle}>Science Interactive</Text>
                                            <Text variant="bodySmall" style={styles.exploreSubtitle}>Explore 3D Models</Text>
                                        </View>
                                        <View style={styles.exploreIconContainer}>
                                            <MaterialCommunityIcons name="cube-outline" size={32} color="#00BCD4" />
                                        </View>
                                    </View>
                                </LinearGradient>
                            </Surface>
                        </TouchableOpacity>
                    </View>

                    {/* My Subjects Section */}
                    <View style={styles.sectionHeader}>
                        <Text variant="titleLarge" style={styles.sectionTitle}>Class {selectedClass} Subjects</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                            <Text variant="bodyMedium" style={styles.changeClassText}>Change Class</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.filtersContainer}>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingHorizontal: spacing.lg + 4 }}
                        >
                            {['All', 'Maths', 'Science', 'Languages'].map((f) => (
                                <TouchableOpacity
                                    key={f}
                                    onPress={() => setFilter(f)}
                                    activeOpacity={0.8}
                                    style={[
                                        styles.filterChip,
                                        filter === f && styles.filterChipActive
                                    ]}
                                >
                                    <Text style={[
                                        styles.filterChipText,
                                        filter === f && styles.filterChipTextActive
                                    ]}>
                                        {f}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Recommended Section */}
                    <View style={styles.highlightsContainer}>
                        <Text variant="titleMedium" style={styles.sectionSubtitle}>Recommended for You</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingHorizontal: spacing.lg + 4, paddingTop: spacing.sm + 2 }}
                        >
                            {[1, 2, 3].map((i) => (
                                <Animated.View key={i} entering={FadeInRight.delay(i * 100).duration(400)}>
                                    <Surface style={styles.highlightCard} elevation={2}>
                                        <View style={styles.highlightIcon}>
                                            <MaterialCommunityIcons name="star-face" size={24} color="#FF9A62" />
                                        </View>
                                        <View style={styles.highlightContent}>
                                            <Text variant="labelLarge" style={styles.highlightTitle}>Daily Challenge</Text>
                                            <Text variant="bodySmall" style={styles.highlightSubtitle}>Earn 50 XP</Text>
                                        </View>
                                    </Surface>
                                </Animated.View>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Subjects List */}
                    <FlatList
                        data={subjects}
                        renderItem={renderSubjectItem}
                        keyExtractor={(item) => item._id}
                        scrollEnabled={false}
                        contentContainerStyle={styles.listContent}
                    />
                </ScrollView>
            </View>
        </View>
    );
};

const createStyles = (isDark: boolean) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: isDark ? '#0F172A' : '#F5F5F7',
    },
    headerBackground: {
        paddingBottom: spacing.xxl + 12,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        shadowColor: '#6A5AE0',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 15,
        elevation: 10,
    },
    headerContainer: {
        paddingHorizontal: spacing.lg + 4,
        marginBottom: spacing.lg + 2,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerContent: {
        paddingHorizontal: spacing.lg + 4,
    },
    contentContainer: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: spacing.xxl + 30,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 4,
    },
    avatarGradient: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    avatarText: {
        fontSize: 24,
        fontWeight: '800',
        color: '#fff',
    },
    userStats: {
        marginLeft: 12,
    },
    userName: {
        fontWeight: '800',
        color: '#fff',
        fontSize: 22,
        lineHeight: 28,
    },
    xpContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.25)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 14,
        marginTop: 6,
        alignSelf: 'flex-start',
    },
    xpText: {
        color: '#FFD700',
        fontWeight: '800',
        fontSize: 13,
        marginLeft: 4,
    },
    streakContainer: {
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.25)',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 18,
        flexDirection: 'row',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    streakText: {
        fontWeight: '800',
        color: '#fff',
        fontSize: 20,
        marginLeft: 6,
    },
    dailyGoalCard: {
        padding: spacing.lg + 2,
        borderRadius: 22,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 6,
        marginBottom: 2,
    },
    goalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md + 2,
    },
    goalTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    goalIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#EDE7FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    goalTitle: {
        fontWeight: '800',
        fontSize: 17,
        color: '#1A1A1A',
        letterSpacing: 0.2,
    },
    goalXP: {
        fontWeight: '700',
        color: '#666',
        fontSize: 15,
    },
    progressContainer: {
        marginBottom: spacing.sm + 2,
    },
    progressBar: {
        height: 14,
        borderRadius: 7,
        backgroundColor: '#F0F0F0',
    },
    goalMotivation: {
        color: '#888',
        fontSize: 13,
        fontWeight: '500',
        lineHeight: 18,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg + 4,
        marginBottom: spacing.md + 4,
        marginTop: spacing.lg,
    },
    sectionTitle: {
        fontWeight: '800',
        color: '#1A1A1A',
        fontSize: 23,
        letterSpacing: 0.3,
    },
    sectionSubtitle: {
        fontWeight: '700',
        color: '#1A1A1A',
        fontSize: 19,
        letterSpacing: 0.2,
        marginBottom: spacing.md,
        paddingHorizontal: spacing.lg + 4,
    },
    changeClassText: {
        color: '#6A5AE0',
        fontWeight: '700',
        fontSize: 14,
    },
    filtersContainer: {
        marginBottom: spacing.lg + 4,
    },
    filterChip: {
        paddingHorizontal: 20,
        paddingVertical: 11,
        marginRight: spacing.sm + 2,
        backgroundColor: '#fff',
        borderRadius: 22,
        borderWidth: 1.5,
        borderColor: '#E0E0E0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 3,
        elevation: 2,
    },
    filterChipActive: {
        backgroundColor: '#6A5AE0',
        borderColor: '#6A5AE0',
        shadowColor: '#6A5AE0',
        shadowOpacity: 0.3,
    },
    filterChipText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
        letterSpacing: 0.2,
    },
    filterChipTextActive: {
        color: '#fff',
        fontWeight: '700',
    },
    highlightsContainer: {
        marginBottom: spacing.lg + 4,
    },
    horizontalScroll: {
        paddingLeft: spacing.lg + 4,
        paddingTop: spacing.sm + 2,
    },
    highlightCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md + 2,
        borderRadius: 18,
        backgroundColor: '#fff',
        marginRight: spacing.md + 2,
        width: 210,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
        marginBottom: 10,
    },
    highlightIcon: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: '#FFF5F0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    highlightContent: {
        flex: 1,
    },
    highlightTitle: {
        fontWeight: '700',
        color: '#1A1A1A',
        fontSize: 15,
        marginBottom: 2,
    },
    highlightSubtitle: {
        color: '#888',
        fontSize: 13,
    },
    subjectCardWrapper: {
        marginBottom: spacing.md + 2,
        paddingHorizontal: spacing.lg + 4,
    },
    subjectCard: {
        borderRadius: 20,
    },
    subjectCardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md + 4,
        borderRadius: 20,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.07,
        shadowRadius: 10,
        elevation: 2,
    },
    iconBox: {
        width: 60,
        height: 60,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    subjectInfo: {
        flex: 1,
    },
    subjectName: {
        fontWeight: '700',
        marginBottom: 8,
        fontSize: 17,
        color: '#1A1A1A',
    },
    progressRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    progressBarContainer: {
        flex: 1,
        marginRight: 12,
    },
    miniProgressBar: {
        height: 7,
        borderRadius: 4,
        backgroundColor: '#F0F0F0',
    },
    progressText: {
        fontSize: 13,
        color: '#666',
        fontWeight: '700',
        width: 35,
    },
    chevronContainer: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        paddingBottom: spacing.xl,
    },
    exploreContainer: {
        paddingHorizontal: spacing.lg + 4,
        marginBottom: spacing.lg + 4,
    },
    exploreCard: {
        borderRadius: 20,
        overflow: 'hidden',
    },
    exploreGradient: {
        padding: spacing.lg,
    },
    exploreContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    exploreTextContainer: {
        flex: 1,
    },
    exploreTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#006064',
        marginBottom: 4,
    },
    exploreSubtitle: {
        fontSize: 14,
        color: '#00838F',
        fontWeight: '600',
    },
    exploreIconContainer: {
        width: 56,
        height: 56,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 16,
    },
});

export default LearnDashboardScreen;
