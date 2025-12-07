

import class6ScienceChapters from '../assets/data/class6/science/chapters.json';
import class6MathChapters from '../assets/data/class6/mathematics/chapters.json';
import class6EnglishChapters from '../assets/data/class6/english/chapters.json';
import class6ComputerChapters from '../assets/data/class6/computer/chapters.json';

import class7ScienceChapters from '../assets/data/class7/science/chapters.json';
import class7MathChapters from '../assets/data/class7/mathematics/chapters.json';
import class7EnglishChapters from '../assets/data/class7/english/chapters.json';
import class7ComputerChapters from '../assets/data/class7/computer/chapters.json';

import class8ScienceChapters from '../assets/data/class8/science/chapters.json';
import class8MathChapters from '../assets/data/class8/mathematics/chapters.json';
import class8EnglishChapters from '../assets/data/class8/english/chapters.json';
import class8ComputerChapters from '../assets/data/class8/computer/chapters.json';

import class9ScienceChapters from '../assets/data/class9/science/chapters.json';
import class9MathChapters from '../assets/data/class9/mathematics/chapters.json';
import class9EnglishChapters from '../assets/data/class9/english/chapters.json';
import class9ComputerChapters from '../assets/data/class9/computer/chapters.json';

import class10ScienceChapters from '../assets/data/class10/science/chapters.json';
import class10MathChapters from '../assets/data/class10/mathematics/chapters.json';
import class10EnglishChapters from '../assets/data/class10/english/chapters.json';
import class10ComputerChapters from '../assets/data/class10/computer/chapters.json';

import class11ScienceChapters from '../assets/data/class11/science/chapters.json';
import class11MathChapters from '../assets/data/class11/mathematics/chapters.json';
import class11EnglishChapters from '../assets/data/class11/english/chapters.json';
import class11ComputerChapters from '../assets/data/class11/computer/chapters.json';

import class12ScienceChapters from '../assets/data/class12/science/chapters.json';
import class12MathChapters from '../assets/data/class12/mathematics/chapters.json';
import class12EnglishChapters from '../assets/data/class12/english/chapters.json';
import class12ComputerChapters from '../assets/data/class12/computer/chapters.json';

import { chapterContentMap } from './generatedContentMap';

/**
 * Offline Data Service
 * Provides educational content from local JSON files when offline
 */
export const offlineDataService = {
    /**
     * Get all classes available offline
     */
    getClasses: () => {
        return [
            {
                _id: 'class-6',
                classNumber: 6,
                name: 'Class 6',
                description: 'Maharashtra State Board Grade 6'
            },
            {
                _id: 'class-7',
                classNumber: 7,
                name: 'Class 7',
                description: 'Maharashtra State Board Grade 7'
            },
            {
                _id: 'class-8',
                classNumber: 8,
                name: 'Class 8',
                description: 'Maharashtra State Board Grade 8'
            },
            {
                _id: 'class-9',
                classNumber: 9,
                name: 'Class 9',
                description: 'Maharashtra State Board Grade 9'
            },
            {
                _id: 'class-10',
                classNumber: 10,
                name: 'Class 10',
                description: 'Maharashtra State Board Grade 10'
            },
            {
                _id: 'class-11',
                classNumber: 11,
                name: 'Class 11',
                description: 'Maharashtra State Board Grade 11'
            },
            {
                _id: 'class-12',
                classNumber: 12,
                name: 'Class 12',
                description: 'Maharashtra State Board Grade 12'
            }
        ];
    },

    /**
     * Get subjects for a specific class
     */
    getSubjects: (classId: string) => {
        // Extract class number from ID (e.g., "class-6" -> 6)
        // Or if it's a mongo ID, we might need to handle that. 
        // For now, let's assume our offline IDs.

        // If it's the mongo ID from previous mock data, map it
        if (classId === '691eafac8eb433fec69cf13a') classId = 'class-6';

        if (classId === 'class-6') {
            return [
                {
                    _id: 'sci-6',
                    name: 'Science',
                    classId: classId,
                    icon: 'flask',
                    color: '#4ECDC4'
                },
                {
                    _id: 'math-6',
                    name: 'Mathematics',
                    classId: classId,
                    icon: 'calculator',
                    color: '#FF6B6B'
                },
                {
                    _id: 'eng-6',
                    name: 'English',
                    classId: classId,
                    icon: 'book-alphabet',
                    color: '#A78BFA'
                },
                {
                    _id: 'comp-6',
                    name: 'Computer',
                    classId: classId,
                    icon: 'laptop',
                    color: '#60A5FA'
                }
            ];
        } else if (classId === 'class-7') {
            return [
                {
                    _id: 'sci-7',
                    name: 'Science',
                    classId: classId,
                    icon: 'flask',
                    color: '#4ECDC4'
                },
                {
                    _id: 'math-7',
                    name: 'Mathematics',
                    classId: classId,
                    icon: 'calculator',
                    color: '#FF6B6B'
                },
                {
                    _id: 'eng-7',
                    name: 'English',
                    classId: classId,
                    icon: 'book-alphabet',
                    color: '#A78BFA'
                },
                {
                    _id: 'comp-7',
                    name: 'Computer',
                    classId: classId,
                    icon: 'laptop',
                    color: '#60A5FA'
                }
            ];
        } else if (classId === 'class-8') {
            return [
                {
                    _id: 'sci-8',
                    name: 'Science',
                    classId: classId,
                    icon: 'flask',
                    color: '#4ECDC4'
                },
                {
                    _id: 'math-8',
                    name: 'Mathematics',
                    classId: classId,
                    icon: 'calculator',
                    color: '#FF6B6B'
                },
                {
                    _id: 'eng-8',
                    name: 'English',
                    classId: classId,
                    icon: 'book-alphabet',
                    color: '#A78BFA'
                },
                {
                    _id: 'comp-8',
                    name: 'Computer',
                    classId: classId,
                    icon: 'laptop',
                    color: '#60A5FA'
                }
            ];
        } else if (classId === 'class-9') {
            return [
                {
                    _id: 'sci-9',
                    name: 'Science',
                    classId: classId,
                    icon: 'flask',
                    color: '#4ECDC4'
                },
                {
                    _id: 'math-9',
                    name: 'Mathematics',
                    classId: classId,
                    icon: 'calculator',
                    color: '#FF6B6B'
                },
                {
                    _id: 'eng-9',
                    name: 'English',
                    classId: classId,
                    icon: 'book-alphabet',
                    color: '#A78BFA'
                },
                {
                    _id: 'comp-9',
                    name: 'Computer',
                    classId: classId,
                    icon: 'laptop',
                    color: '#60A5FA'
                }
            ];
        } else if (classId === 'class-10') {
            return [
                {
                    _id: 'sci-10',
                    name: 'Science',
                    classId: classId,
                    icon: 'flask',
                    color: '#4ECDC4'
                },
                {
                    _id: 'math-10',
                    name: 'Mathematics',
                    classId: classId,
                    icon: 'calculator',
                    color: '#FF6B6B'
                },
                {
                    _id: 'eng-10',
                    name: 'English',
                    classId: classId,
                    icon: 'book-alphabet',
                    color: '#A78BFA'
                },
                {
                    _id: 'comp-10',
                    name: 'Computer',
                    classId: classId,
                    icon: 'laptop',
                    color: '#60A5FA'
                }
            ];
        } else if (classId === 'class-11') {
            return [
                {
                    _id: 'sci-11',
                    name: 'Science',
                    classId: classId,
                    icon: 'flask',
                    color: '#4ECDC4'
                },
                {
                    _id: 'math-11',
                    name: 'Mathematics',
                    classId: classId,
                    icon: 'calculator',
                    color: '#FF6B6B'
                },
                {
                    _id: 'eng-11',
                    name: 'English',
                    classId: classId,
                    icon: 'book-alphabet',
                    color: '#A78BFA'
                },
                {
                    _id: 'comp-11',
                    name: 'Computer',
                    classId: classId,
                    icon: 'laptop',
                    color: '#60A5FA'
                }
            ];
        } else if (classId === 'class-12') {
            return [
                {
                    _id: 'sci-12',
                    name: 'Science',
                    classId: classId,
                    icon: 'flask',
                    color: '#4ECDC4'
                },
                {
                    _id: 'math-12',
                    name: 'Mathematics',
                    classId: classId,
                    icon: 'calculator',
                    color: '#FF6B6B'
                },
                {
                    _id: 'eng-12',
                    name: 'English',
                    classId: classId,
                    icon: 'book-alphabet',
                    color: '#A78BFA'
                },
                {
                    _id: 'comp-12',
                    name: 'Computer',
                    classId: classId,
                    icon: 'laptop',
                    color: '#60A5FA'
                }
            ];
        }
        return [];
    },

    /**
     * Get chapters for a specific subject
     */
    getChapters: (subjectId: string) => {
        // Class 6
        if (subjectId === 'sci-6' || subjectId === '691eafac8eb433fec69cf13c') {
            return class6ScienceChapters.map(chapter => ({
                _id: chapter.id,
                name: chapter.title,
                description: chapter.description,
                subjectId: subjectId,
                units: chapter.units,
                icon: chapter.icon,
                color: chapter.color
            }));
        } else if (subjectId === 'math-6' || subjectId === '691eafac8eb433fec69cf242') {
            return class6MathChapters.map(chapter => ({
                _id: chapter.id,
                name: chapter.title,
                description: chapter.description,
                subjectId: subjectId,
                units: chapter.units,
                icon: chapter.icon,
                color: chapter.color
            }));
        } else if (subjectId === 'eng-6' || subjectId === '69233db098c793077f0ecd01') {
            return class6EnglishChapters.map(chapter => ({
                _id: chapter.id,
                name: chapter.title,
                description: chapter.description,
                subjectId: subjectId,
                units: chapter.units,
                icon: chapter.icon,
                color: chapter.color
            }));
        } else if (subjectId === 'comp-6' || subjectId === '69233db3fe3cabf71c0237a1') {
            return class6ComputerChapters.map(chapter => ({
                _id: chapter.id,
                name: chapter.title,
                description: chapter.description,
                subjectId: subjectId,
                units: chapter.units,
                icon: chapter.icon,
                color: chapter.color
            }));
        }

        // Class 7
        else if (subjectId === 'sci-7') {
            return class7ScienceChapters.map(chapter => ({
                _id: chapter.id,
                name: chapter.title,
                description: chapter.description,
                subjectId: subjectId,
                units: chapter.units,
                icon: chapter.icon,
                color: chapter.color
            }));
        } else if (subjectId === 'math-7') {
            return class7MathChapters.map(chapter => ({
                _id: chapter.id,
                name: chapter.title,
                description: chapter.description,
                subjectId: subjectId,
                units: chapter.units,
                icon: chapter.icon,
                color: chapter.color
            }));
        } else if (subjectId === 'eng-7') {
            return class7EnglishChapters.map(chapter => ({
                _id: chapter.id,
                name: chapter.title,
                description: chapter.description,
                subjectId: subjectId,
                units: chapter.units,
                icon: chapter.icon,
                color: chapter.color
            }));
        } else if (subjectId === 'comp-7') {
            return class7ComputerChapters.map(chapter => ({
                _id: chapter.id,
                name: chapter.title,
                description: chapter.description,
                subjectId: subjectId,
                units: chapter.units,
                icon: chapter.icon,
                color: chapter.color
            }));
        }

        // Class 8
        else if (subjectId === 'sci-8') {
            return class8ScienceChapters.map(chapter => ({
                _id: chapter.id,
                name: chapter.title,
                description: chapter.description,
                subjectId: subjectId,
                units: chapter.units,
                icon: chapter.icon,
                color: chapter.color
            }));
        } else if (subjectId === 'math-8') {
            return class8MathChapters.map(chapter => ({
                _id: chapter.id,
                name: chapter.title,
                description: chapter.description,
                subjectId: subjectId,
                units: chapter.units,
                icon: chapter.icon,
                color: chapter.color
            }));
        } else if (subjectId === 'eng-8') {
            return class8EnglishChapters.map(chapter => ({
                _id: chapter.id,
                name: chapter.title,
                description: chapter.description,
                subjectId: subjectId,
                units: chapter.units,
                icon: chapter.icon,
                color: chapter.color
            }));
        } else if (subjectId === 'comp-8') {
            return class8ComputerChapters.map(chapter => ({
                _id: chapter.id,
                name: chapter.title,
                description: chapter.description,
                subjectId: subjectId,
                units: chapter.units,
                icon: chapter.icon,
                color: chapter.color
            }));
        }

        // Class 9
        else if (subjectId === 'sci-9') {
            return class9ScienceChapters.map(chapter => ({
                _id: chapter.id,
                name: chapter.title,
                description: chapter.description,
                subjectId: subjectId,
                units: chapter.units,
                icon: chapter.icon,
                color: chapter.color
            }));
        } else if (subjectId === 'math-9') {
            return class9MathChapters.map(chapter => ({
                _id: chapter.id,
                name: chapter.title,
                description: chapter.description,
                subjectId: subjectId,
                units: chapter.units,
                icon: chapter.icon,
                color: chapter.color
            }));
        } else if (subjectId === 'eng-9') {
            return class9EnglishChapters.map(chapter => ({
                _id: chapter.id,
                name: chapter.title,
                description: chapter.description,
                subjectId: subjectId,
                units: chapter.units,
                icon: chapter.icon,
                color: chapter.color
            }));
        } else if (subjectId === 'comp-9') {
            return class9ComputerChapters.map(chapter => ({
                _id: chapter.id,
                name: chapter.title,
                description: chapter.description,
                subjectId: subjectId,
                units: chapter.units,
                icon: chapter.icon,
                color: chapter.color
            }));
        }

        // Class 10
        else if (subjectId === 'sci-10') {
            return class10ScienceChapters.map(chapter => ({
                _id: chapter.id,
                name: chapter.title,
                description: chapter.description,
                subjectId: subjectId,
                units: chapter.units,
                icon: chapter.icon,
                color: chapter.color
            }));
        } else if (subjectId === 'math-10') {
            return class10MathChapters.map(chapter => ({
                _id: chapter.id,
                name: chapter.title,
                description: chapter.description,
                subjectId: subjectId,
                units: chapter.units,
                icon: chapter.icon,
                color: chapter.color
            }));
        } else if (subjectId === 'eng-10') {
            return class10EnglishChapters.map(chapter => ({
                _id: chapter.id,
                name: chapter.title,
                description: chapter.description,
                subjectId: subjectId,
                units: chapter.units,
                icon: chapter.icon,
                color: chapter.color
            }));
        } else if (subjectId === 'comp-10') {
            return class10ComputerChapters.map(chapter => ({
                _id: chapter.id,
                name: chapter.title,
                description: chapter.description,
                subjectId: subjectId,
                units: chapter.units,
                icon: chapter.icon,
                color: chapter.color
            }));
        }

        // Class 11
        else if (subjectId === 'sci-11') {
            return class11ScienceChapters.map(chapter => ({
                _id: chapter.id,
                name: chapter.title,
                description: chapter.description,
                subjectId: subjectId,
                units: chapter.units,
                icon: chapter.icon,
                color: chapter.color
            }));
        } else if (subjectId === 'math-11') {
            return class11MathChapters.map(chapter => ({
                _id: chapter.id,
                name: chapter.title,
                description: chapter.description,
                subjectId: subjectId,
                units: chapter.units,
                icon: chapter.icon,
                color: chapter.color
            }));
        } else if (subjectId === 'eng-11') {
            return class11EnglishChapters.map(chapter => ({
                _id: chapter.id,
                name: chapter.title,
                description: chapter.description,
                subjectId: subjectId,
                units: chapter.units,
                icon: chapter.icon,
                color: chapter.color
            }));
        } else if (subjectId === 'comp-11') {
            return class11ComputerChapters.map(chapter => ({
                _id: chapter.id,
                name: chapter.title,
                description: chapter.description,
                subjectId: subjectId,
                units: chapter.units,
                icon: chapter.icon,
                color: chapter.color
            }));
        }

        // Class 12
        else if (subjectId === 'sci-12') {
            return class12ScienceChapters.map(chapter => ({
                _id: chapter.id,
                name: chapter.title,
                description: chapter.description,
                subjectId: subjectId,
                units: chapter.units,
                icon: chapter.icon,
                color: chapter.color
            }));
        } else if (subjectId === 'math-12') {
            return class12MathChapters.map(chapter => ({
                _id: chapter.id,
                name: chapter.title,
                description: chapter.description,
                subjectId: subjectId,
                units: chapter.units,
                icon: chapter.icon,
                color: chapter.color
            }));
        } else if (subjectId === 'eng-12') {
            return class12EnglishChapters.map(chapter => ({
                _id: chapter.id,
                name: chapter.title,
                description: chapter.description,
                subjectId: subjectId,
                units: chapter.units,
                icon: chapter.icon,
                color: chapter.color
            }));
        } else if (subjectId === 'comp-12') {
            return class12ComputerChapters.map(chapter => ({
                _id: chapter.id,
                name: chapter.title,
                description: chapter.description,
                subjectId: subjectId,
                units: chapter.units,
                icon: chapter.icon,
                color: chapter.color
            }));
        }

        // Return empty for other subjects for now
        return [];
    },

    /**
     * Get lessons/subchapters for a specific chapter
     */
    getLessons: (chapterId: string) => {
        // Check if we have content for this chapter
        let chapterContent = chapterContentMap[chapterId];

        console.log('[OfflineData] getLessons', {
            chapterId,
            hasContent: !!chapterContent,
            contentKeys: chapterContent ? Object.keys(chapterContent) : [],
            lessonsCount: chapterContent?.lessons?.length
        });

        // If content is missing, return null
        if (!chapterContent) {
            console.log('[OfflineData] Content missing for', chapterId);
            return null;
        }

        if (chapterContent && chapterContent.lessons) {
            return chapterContent.lessons.map((lesson: any, index: number) => ({
                _id: `${chapterId}-${lesson.id}`, // Unique ID: chapterId-lessonId
                title: lesson.title,
                content: lesson.content, // This might be heavy to pass around in lists
                readingTime: lesson.readingTime,
                chapterId: chapterId,
                order: index + 1,
                type: 'lesson'
            }));
        }

        return [];
    },

    /**
     * Get chapter content for reading mode
     */
    getChapterContent: (chapterId: string) => {
        let chapterContent = chapterContentMap[chapterId];
        if (!chapterContent) {
            return {
                id: chapterId,
                title: 'Content Coming Soon',
                combinedContent: '# Content Coming Soon\n\nWe are working on adding this chapter content. Please check back later!',
                lessons: [],
                quiz: null
            };
        }

        return {
            id: chapterContent.id,
            title: chapterContent.title,
            combinedContent: chapterContent.lessons.map((l: any) =>
                `# ${l.title}\n\n${l.content}`
            ).join('\n\n---\n\n'),
            lessons: chapterContent.lessons,
            quiz: chapterContent.quiz
        };

        return null;
    },

    /**
     * Get a specific lesson by ID
     */
    getLesson: (lessonId: string) => {
        // Parse the unique ID: chapterId-lessonId
        // Example: sci-6-ch1-l1 -> chapterId: sci-6-ch1, internalId: l1
        const lastDashIndex = lessonId.lastIndexOf('-');
        if (lastDashIndex === -1) return null;

        const chapterId = lessonId.substring(0, lastDashIndex);
        const internalId = lessonId.substring(lastDashIndex + 1);

        let chapterContent = chapterContentMap[chapterId];

        // If content is missing, return null
        if (!chapterContent) {
            return null;
        }

        if (chapterContent && chapterContent.lessons) {
            const lesson = chapterContent.lessons.find((l: any) => l.id === internalId);
            if (lesson) {
                return {
                    _id: lessonId,
                    name: lesson.title, // Map title to name for UI consistency
                    title: lesson.title,
                    lessonContent: lesson.content, // Map content to lessonContent for UI
                    content: lesson.content,
                    readingTime: lesson.readingTime,
                    chapterId: chapterId,
                    type: 'lesson'
                };
            }
        }

        return null;
    },

    /**
     * Get quiz questions for a lesson/subchapter
     */
    getQuiz: (lessonId: string) => {
        // Parse the lesson ID to get the chapter ID
        // Example: sci-6-ch1-l1 -> chapterId: sci-6-ch1
        const lastDashIndex = lessonId.lastIndexOf('-');
        if (lastDashIndex === -1) return [];

        const chapterId = lessonId.substring(0, lastDashIndex);

        // Get chapter content (with fallback)
        let chapterContent = chapterContentMap[chapterId];

        // If content is missing, return empty array
        if (!chapterContent) {
            return [];
        }

        // Extract and transform quiz questions
        if (chapterContent && chapterContent.quiz && chapterContent.quiz.questions) {
            return chapterContent.quiz.questions.map((q: any) => ({
                _id: q.id,
                question: q.question,
                options: q.options,
                correctIndex: q.correctAnswer,
                explanation: q.explanation
            }));
        }

        return [];
    },

    /**
     * Check if content is available offline for a class
     */
    isClassAvailable: (classNumber: number) => {
        return classNumber >= 6 && classNumber <= 12;
    }
};

export default offlineDataService;
