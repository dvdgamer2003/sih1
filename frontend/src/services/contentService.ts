/**
 * Content Service
 * 
 * Service to load and manage learning content (lessons and quizzes) from JSON files
 */

// Static imports for Metro bundler compatibility
// Metro doesn't support dynamic require() with template literals
import class6ScienceLessons from '../data/lessons/class6/science.json';
import class7ScienceLessons from '../data/lessons/class7/science.json';
import class8ScienceLessons from '../data/lessons/class8/science.json';
import class9ScienceLessons from '../data/lessons/class9/science.json';
import class10ScienceLessons from '../data/lessons/class10/science.json';
import class11ScienceLessons from '../data/lessons/class11/science.json';
import class12ScienceLessons from '../data/lessons/class12/science.json';

import class6ScienceQuizzes from '../data/quizzes/class6/science.json';
import class7ScienceQuizzes from '../data/quizzes/class7/science.json';
import class8ScienceQuizzes from '../data/quizzes/class8/science.json';
import class9ScienceQuizzes from '../data/quizzes/class9/science.json';
import class10ScienceQuizzes from '../data/quizzes/class10/science.json';
import class11ScienceQuizzes from '../data/quizzes/class11/science.json';
import class12ScienceQuizzes from '../data/quizzes/class12/science.json';

// Type definitions
export interface LessonSection {
    heading: string;
    text: string;
    examples?: string[];
}

export interface PracticeQuestion {
    question: string;
    answer: string;
}

export interface Lesson {
    id: string;
    title: string;
    duration: string;
    content: string;
    sections: LessonSection[];
    keyPoints: string[];
    practice?: PracticeQuestion[];
}

export interface Chapter {
    id?: string;
    number: number;
    title: string;
    description?: string;
    topics?: string[];
    lessons?: Lesson[];
    notes?: {
        summary: string;
        key_points: string[];
        keywords: string[];
    };
}

export interface LessonData {
    class: number;
    subject: string;
    chapters: Chapter[];
}

export interface QuizQuestion {
    id: string;
    question: string;
    type: 'multiple-choice' | 'true-false' | 'fill-blank';
    options: string[];
    correctAnswer: number;
    explanation: string;
    points: number;
}

export interface Quiz {
    id: string;
    chapterId: string;
    title: string;
    description: string;
    timeLimit: number;
    passingScore: number;
    questions: QuizQuestion[];
}

export interface QuizData {
    class: number;
    subject: string;
    quizzes: Quiz[];
}



// Lesson data mapping
const lessonDataMap: Record<string, any> = {
    '6_science': class6ScienceLessons,
    '7_science': class7ScienceLessons,
    '8_science': class8ScienceLessons,
    '9_science': class9ScienceLessons,
    '10_science': class10ScienceLessons,
    '11_science': class11ScienceLessons,
    '12_science': class12ScienceLessons,
};

// Quiz data mapping
const quizDataMap: Record<string, any> = {
    '6_science': class6ScienceQuizzes,
    '7_science': class7ScienceQuizzes,
    '8_science': class8ScienceQuizzes,
    '9_science': class9ScienceQuizzes,
    '10_science': class10ScienceQuizzes,
    '11_science': class11ScienceQuizzes,
    '12_science': class12ScienceQuizzes,
};

/**
 * Load lesson data for a specific class and subject
 */
export const getLessons = (classNum: number, subject: string): LessonData | null => {
    try {
        const key = `${classNum}_${subject}`;
        const data = lessonDataMap[key];
        if (!data) {
            console.warn(`No lesson data found for class ${classNum} ${subject}`);
            return null;
        }
        return data;
    } catch (error) {
        console.error(`Failed to load lessons for class ${classNum} ${subject}:`, error);
        return null;
    }
};

/**
 * Load quiz data for a specific class and subject
 */
export const getQuizzes = (classNum: number, subject: string): QuizData | null => {
    try {
        const key = `${classNum}_${subject}`;
        const data = quizDataMap[key];
        if (!data) {
            console.warn(`No quiz data found for class ${classNum} ${subject}`);
            return null;
        }
        return data;
    } catch (error) {
        console.error(`Failed to load quizzes for class ${classNum} ${subject}:`, error);
        return null;
    }
};

/**
 * Get a specific lesson by ID
 */
export const getLessonById = (
    classNum: number,
    subject: string,
    chapterId: string,
    lessonId: string
): Lesson | null => {
    const data = getLessons(classNum, subject);
    if (!data) return null;

    const chapter = data.chapters.find(ch => ch.id === chapterId);
    if (!chapter) return null;

    return chapter.lessons?.find(lesson => lesson.id === lessonId) || null;
};

/**
 * Get a specific quiz by ID
 */
export const getQuizById = (
    classNum: number,
    subject: string,
    quizId: string
): Quiz | null => {
    const data = getQuizzes(classNum, subject);
    if (!data) return null;

    return data.quizzes.find(quiz => quiz.id === quizId) || null;
};

/**
 * Get all chapters for a class and subject
 */
export const getChapters = (classNum: number, subject: string): Chapter[] => {
    const data = getLessons(classNum, subject);
    return data?.chapters || [];
};

/**
 * Get quizzes for a specific chapter
 */
export const getQuizzesForChapter = (
    classNum: number,
    subject: string,
    chapterId: string
): Quiz[] => {
    const data = getQuizzes(classNum, subject);
    if (!data) return [];

    return data.quizzes.filter(quiz => quiz.chapterId === chapterId);
};

/**
 * Search lessons by keyword
 */
export const searchLessons = (
    classNum: number,
    subject: string,
    keyword: string
): Lesson[] => {
    const data = getLessons(classNum, subject);
    if (!data) return [];

    const results: Lesson[] = [];
    const lowerKeyword = keyword.toLowerCase();

    data.chapters.forEach(chapter => {
        chapter.lessons?.forEach(lesson => {
            if (
                lesson.title.toLowerCase().includes(lowerKeyword) ||
                lesson.content.toLowerCase().includes(lowerKeyword)
            ) {
                results.push(lesson);
            }
        });
    });

    return results;
};

export default {
    getLessons,
    getQuizzes,
    getLessonById,
    getQuizById,
    getChapters,
    getQuizzesForChapter,
    searchLessons,
};
