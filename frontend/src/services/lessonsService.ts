import { getData, storeData } from '../offline/offlineStorage';
import { getLessons as getContentLessons, getChapters, Chapter } from './contentService';

const CACHE_KEY = 'lessons_cache';

export interface Lesson {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    duration: string;
    chapterNumber?: number;
    topics?: string[];
    class?: number;
    subject?: string;
}

/**
 * Get lessons for a specific class and subject
 * Defaults to Class 6 Science
 */
export const getLessons = async (classNum: number = 6, subject: string = 'science'): Promise<Lesson[]> => {
    try {
        const cacheKey = `${CACHE_KEY}_${classNum}_${subject}`;

        // Try to get from JSON files
        const chapters = getChapters(classNum, subject);

        if (chapters && chapters.length > 0) {
            // Transform chapters to Lesson format
            const lessons: Lesson[] = chapters.map((chapter: Chapter, index: number) => {
                // Get description from notes summary or lessons
                let description = 'CBSE Science Chapter';
                if (chapter.notes?.summary) {
                    description = chapter.notes.summary.substring(0, 150) + '...';
                } else if (chapter.description) {
                    description = chapter.description;
                } else if (chapter.lessons && chapter.lessons.length > 0) {
                    description = chapter.lessons[0].content.substring(0, 100) + '...';
                }

                return {
                    id: `${classNum}_${subject}_ch${chapter.number}`,
                    title: chapter.title,
                    description,
                    imageUrl: `https://picsum.photos/seed/${classNum}${chapter.number}/700`,
                    duration: chapter.lessons ? `${chapter.lessons.length * 10} min` : '15 min',
                    chapterNumber: chapter.number,
                    topics: chapter.topics || (chapter.lessons && chapter.lessons.length > 0 ? chapter.lessons.map(l => l.title) : []),
                    class: classNum,
                    subject: subject,
                };
            });

            await storeData(cacheKey, lessons);
            return lessons;
        }

        // Fallback to cache if JSON files not found
        const cachedLessons = await getData(cacheKey);
        if (cachedLessons) {
            return cachedLessons;
        }

        // If no content found, return empty array
        return [];
    } catch (error) {
        console.warn('Error fetching lessons, trying cache...', error);
        const cacheKey = `${CACHE_KEY}_${classNum}_${subject}`;
        const cachedLessons = await getData(cacheKey);
        if (cachedLessons) {
            return cachedLessons;
        }
        return [];
    }
};

/**
 * Get all available classes
 */
export const getAvailableClasses = (): number[] => {
    return [6, 7, 8, 9, 10, 11, 12];
};

/**
 * Get all available subjects
 */
export const getAvailableSubjects = (): string[] => {
    return ['science', 'math'];
};
