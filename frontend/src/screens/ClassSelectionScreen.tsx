import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { classService, ClassLevel } from '../services/classService';
import { useAuth } from '../context/AuthContext';
import { spacing, borderRadius } from '../theme';

interface ClassSelectionScreenProps {
    navigation: any;
    route?: any;
}

const ClassSelectionScreen: React.FC<ClassSelectionScreenProps> = ({ navigation, route }) => {
    const { token, updateUser } = useAuth();
    const [selectedClass, setSelectedClass] = useState<ClassLevel | null>(null);
    const [loading, setLoading] = useState(false);
    const isFromSettings = route?.params?.fromSettings || false;

    const classes = classService.getAvailableClasses();

    useEffect(() => {
        loadCurrentClass();
    }, []);

    const loadCurrentClass = async () => {
        const currentClass = await classService.getSelectedClass();
        if (currentClass) {
            setSelectedClass(currentClass);
        }
    };

    const handleClassSelect = async (classId: ClassLevel) => {
        setSelectedClass(classId);
        setLoading(true);

        try {
            await classService.selectClass(classId, token || undefined);

            // Update context immediately to reflect changes
            const classNumber = parseInt(classId.replace('class-', ''));
            await updateUser({ selectedClass: classNumber });

            // Navigate based on context
            if (isFromSettings) {
                navigation.goBack();
            } else {
                // First time selection - go to home
                navigation.replace('Main');
            }
        } catch (error) {
            console.error('Error selecting class:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#667eea', '#764ba2']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.header}
            >
                {isFromSettings && (
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
                    </TouchableOpacity>
                )}

                <Animated.View entering={FadeInDown.duration(600)} style={styles.headerContent}>
                    <MaterialCommunityIcons name="school" size={80} color="#fff" />
                    <Text style={styles.title}>Select Your Class</Text>
                    <Text style={styles.subtitle}>
                        Choose your current class to get personalized content
                    </Text>
                </Animated.View>
            </LinearGradient>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.classGrid}>
                    {classes.map((classItem, index) => (
                        <Animated.View
                            key={classItem.id}
                            entering={ZoomIn.delay(index * 100).duration(500)}
                            style={styles.classCardWrapper}
                        >
                            <TouchableOpacity
                                onPress={() => handleClassSelect(classItem.id)}
                                activeOpacity={0.8}
                                disabled={loading}
                            >
                                <LinearGradient
                                    colors={
                                        selectedClass === classItem.id
                                            ? ['#667eea', '#764ba2']
                                            : ['#f5f5f5', '#e0e0e0']
                                    }
                                    style={[
                                        styles.classCard,
                                        selectedClass === classItem.id && styles.classCardSelected
                                    ]}
                                >
                                    <Text style={styles.classIcon}>{classItem.icon}</Text>
                                    <Text style={[
                                        styles.classLabel,
                                        selectedClass === classItem.id && styles.classLabelSelected
                                    ]}>
                                        {classItem.label}
                                    </Text>

                                    {selectedClass === classItem.id && (
                                        <View style={styles.checkmark}>
                                            <MaterialCommunityIcons
                                                name="check-circle"
                                                size={28}
                                                color="#4CAF50"
                                            />
                                        </View>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>
                        </Animated.View>
                    ))}
                </View>

                {loading && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#667eea" />
                        <Text style={styles.loadingText}>Saving your selection...</Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    header: {
        paddingTop: 60,
        paddingBottom: 40,
        paddingHorizontal: spacing.xl,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 8,
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerContent: {
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: '900',
        color: '#fff',
        marginTop: spacing.md,
        marginBottom: spacing.sm,
    },
    subtitle: {
        fontSize: 15,
        color: 'rgba(255,255,255,0.9)',
        textAlign: 'center',
        paddingHorizontal: spacing.lg,
    },
    scrollContent: {
        padding: spacing.xl,
    },
    classGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.md,
        justifyContent: 'center',
    },
    classCardWrapper: {
        width: '45%',
        minWidth: 150,
    },
    classCard: {
        padding: spacing.xl,
        borderRadius: borderRadius.xl,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 140,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        position: 'relative',
    },
    classCardSelected: {
        shadowColor: '#667eea',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    classIcon: {
        fontSize: 48,
        marginBottom: spacing.sm,
    },
    classLabel: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
    },
    classLabelSelected: {
        color: '#fff',
    },
    checkmark: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: '#fff',
        borderRadius: 14,
    },
    loadingContainer: {
        marginTop: spacing.xxl,
        alignItems: 'center',
    },
    loadingText: {
        marginTop: spacing.md,
        fontSize: 16,
        color: '#666',
        fontWeight: '600',
    },
});

export default ClassSelectionScreen;
