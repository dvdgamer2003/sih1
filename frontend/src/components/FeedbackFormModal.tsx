import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Modal, TouchableOpacity, TextInput } from 'react-native';
import { Text, Surface, Button, ActivityIndicator, HelperText } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '../context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../services/api';

interface FeedbackFormModalProps {
    visible: boolean;
    onClose: () => void;
    initialTargetType?: 'app' | 'teacher' | 'all_teachers' | 'content' | 'game' | 'lesson';
    initialTargetId?: string;
    initialTargetName?: string;
    onSuccess?: () => void;
}

const FeedbackFormModal: React.FC<FeedbackFormModalProps> = ({
    visible,
    onClose,
    initialTargetType = 'app',
    initialTargetId,
    initialTargetName,
    onSuccess
}) => {
    const { isDark } = useAppTheme();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [category, setCategory] = useState<'bug' | 'suggestion' | 'praise' | 'complaint' | 'other'>('suggestion');
    const [targetType, setTargetType] = useState(initialTargetType);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const categories = [
        { id: 'suggestion', label: 'Suggestion', icon: 'lightbulb-on-outline', color: '#F59E0B' },
        { id: 'bug', label: 'Report Bug', icon: 'bug-outline', color: '#EF4444' },
        { id: 'praise', label: 'Appreciation', icon: 'heart-outline', color: '#EC4899' },
        { id: 'complaint', label: 'Issue', icon: 'alert-circle-outline', color: '#F97316' },
        { id: 'other', label: 'Other', icon: 'dots-horizontal', color: '#6B7280' },
    ];

    const handleSubmit = async () => {
        if (rating === 0) {
            setError('Please select a rating');
            return;
        }
        if (comment.trim().length < 10) {
            setError('Please provide more details (at least 10 characters)');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await api.post('/feedback', {
                targetType,
                targetId: initialTargetId,
                targetName: initialTargetName,
                rating,
                comment,
                category
            });

            setRating(0);
            setComment('');
            setCategory('suggestion');
            if (onSuccess) onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to submit feedback');
        } finally {
            setLoading(false);
        }
    };

    const renderStar = (index: number) => (
        <TouchableOpacity
            key={index}
            onPress={() => setRating(index)}
            style={styles.starContainer}
        >
            <MaterialCommunityIcons
                name={rating >= index ? "star" : "star-outline"}
                size={36}
                color={rating >= index ? "#FFD700" : isDark ? "#4B5563" : "#D1D5DB"}
            />
        </TouchableOpacity>
    );

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <Surface style={[styles.modalContent, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }]}>
                    <View style={styles.header}>
                        <Text variant="headlineSmall" style={styles.title}>
                            {initialTargetName ? `Feedback for ${initialTargetName}` : 'Give Feedback'}
                        </Text>
                        <TouchableOpacity onPress={onClose}>
                            <MaterialCommunityIcons name="close" size={24} color={isDark ? '#FFF' : '#000'} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Text variant="titleMedium" style={styles.sectionTitle}>How was your experience?</Text>
                        <View style={styles.ratingContainer}>
                            {[1, 2, 3, 4, 5].map(renderStar)}
                        </View>

                        <Text variant="titleMedium" style={styles.sectionTitle}>Category</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
                            {categories.map((cat) => (
                                <TouchableOpacity
                                    key={cat.id}
                                    style={[
                                        styles.categoryChip,
                                        category === cat.id && { backgroundColor: cat.color + '20', borderColor: cat.color },
                                        { borderColor: isDark ? '#334155' : '#E2E8F0' }
                                    ]}
                                    onPress={() => setCategory(cat.id as any)}
                                >
                                    <MaterialCommunityIcons
                                        name={cat.icon as any}
                                        size={18}
                                        color={category === cat.id ? cat.color : isDark ? '#CBD5E1' : '#64748B'}
                                    />
                                    <Text style={[
                                        styles.categoryText,
                                        { color: category === cat.id ? cat.color : isDark ? '#CBD5E1' : '#64748B' }
                                    ]}>
                                        {cat.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        <Text variant="titleMedium" style={styles.sectionTitle}>Details</Text>
                        <TextInput
                            style={[
                                styles.input,
                                {
                                    backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
                                    color: isDark ? '#F1F5F9' : '#0F172A',
                                    borderColor: isDark ? '#334155' : '#E2E8F0'
                                }
                            ]}
                            placeholder="Tell us what you think..."
                            placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                            value={comment}
                            onChangeText={setComment}
                        />

                        {error ? (
                            <HelperText type="error" visible={true}>
                                {error}
                            </HelperText>
                        ) : null}

                        <Button
                            mode="contained"
                            onPress={handleSubmit}
                            loading={loading}
                            disabled={loading}
                            style={styles.submitButton}
                            contentStyle={{ paddingVertical: 8 }}
                        >
                            Submit Feedback
                        </Button>
                    </ScrollView>
                </Surface>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        maxHeight: '85%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontWeight: 'bold',
    },
    sectionTitle: {
        marginBottom: 12,
        fontWeight: '600',
    },
    ratingContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 24,
    },
    starContainer: {
        padding: 4,
    },
    categoriesContainer: {
        flexDirection: 'row',
        marginBottom: 24,
    },
    categoryChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        marginRight: 8,
        gap: 6,
    },
    categoryText: {
        fontSize: 14,
        fontWeight: '500',
    },
    input: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 16,
        minHeight: 120,
        marginBottom: 16,
    },
    submitButton: {
        marginTop: 8,
        borderRadius: 12,
    },
});

export default FeedbackFormModal;
