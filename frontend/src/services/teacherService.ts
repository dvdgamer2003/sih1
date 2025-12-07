import api from './api';

export interface SubjectStats {
    subject: string;
    attempts: number;
    averageScore: number;
}

export interface WeakTopic {
    topic: string;
    subject: string;
    correctRate: number;
    attempts: number;
}

export interface QuizAttempt {
    id: string;
    studentName: string;
    subject: string;
    score: number;
    totalQuestions: number;
    timestamp: number;
}

export interface TeacherStats {
    totalAttempts: number;
    averageScore: number;
    subjectStats: SubjectStats[];
    weakTopics: WeakTopic[];
    recentAttempts: QuizAttempt[];
}

/**
 * Get teacher dashboard statistics
 */
export const getTeacherStats = async (): Promise<TeacherStats> => {
    // TODO: Replace with actual API call when backend is ready
    // const response = await api.get('/teacher/stats');
    // return response.data;

    // Mock implementation
    console.log('[TeacherService] Fetching teacher stats (mock)');
    await new Promise((resolve) => setTimeout(resolve, 800));

    return {
        totalAttempts: 156,
        averageScore: 72.5,
        subjectStats: [
            { subject: 'Mathematics', attempts: 45, averageScore: 78.2 },
            { subject: 'Science', attempts: 38, averageScore: 71.5 },
            { subject: 'English', attempts: 42, averageScore: 68.9 },
            { subject: 'History', attempts: 31, averageScore: 75.3 },
        ],
        weakTopics: [
            { topic: 'Algebra', subject: 'Mathematics', correctRate: 45, attempts: 20 },
            { topic: 'Grammar', subject: 'English', correctRate: 52, attempts: 18 },
            { topic: 'Physics', subject: 'Science', correctRate: 58, attempts: 15 },
            { topic: 'World Wars', subject: 'History', correctRate: 61, attempts: 12 },
        ],
        recentAttempts: [
            {
                id: '1',
                studentName: 'Rajesh Kumar',
                subject: 'Mathematics',
                score: 8,
                totalQuestions: 10,
                timestamp: Date.now() - 3600000,
            },
            {
                id: '2',
                studentName: 'Priya Sharma',
                subject: 'Science',
                score: 7,
                totalQuestions: 10,
                timestamp: Date.now() - 7200000,
            },
            {
                id: '3',
                studentName: 'Amit Patel',
                subject: 'English',
                score: 6,
                totalQuestions: 10,
                timestamp: Date.now() - 10800000,
            },
            {
                id: '4',
                studentName: 'Sneha Reddy',
                subject: 'History',
                score: 9,
                totalQuestions: 10,
                timestamp: Date.now() - 14400000,
            },
            {
                id: '5',
                studentName: 'Vikram Singh',
                subject: 'Mathematics',
                score: 5,
                totalQuestions: 10,
                timestamp: Date.now() - 18000000,
            },
        ],
    };
};
