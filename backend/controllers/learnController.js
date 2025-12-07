const Class = require('../models/Class');
const Subject = require('../models/Subject');
const Chapter = require('../models/Chapter');
const Subchapter = require('../models/Subchapter');
const QuizQuestion = require('../models/QuizQuestion');

// @desc    Get all classes (6-12)
// @route   GET /api/learn/classes
// @access  Public
const getClasses = async (req, res) => {
    try {
        const classes = await Class.find().sort({ classNumber: 1 });
        res.json(classes);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get subjects for a class
// @route   GET /api/learn/classes/:classId/subjects
// @access  Public
const getSubjects = async (req, res) => {
    try {
        const subjects = await Subject.find({ classId: req.params.classId });
        res.json(subjects);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get chapters for a subject
// @route   GET /api/learn/subjects/:subjectId/chapters
// @access  Public
const getChapters = async (req, res) => {
    try {
        const chapters = await Chapter.find({ subjectId: req.params.subjectId }).sort({ index: 1 });
        res.json(chapters);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get subchapters for a chapter
// @route   GET /api/learn/chapters/:chapterId/subchapters
// @access  Public
const getSubchapters = async (req, res) => {
    try {
        const subchapters = await Subchapter.find({ chapterId: req.params.chapterId }).sort({ index: 1 });
        res.json(subchapters);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get single subchapter details
// @route   GET /api/learn/subchapters/:id
// @access  Public
const getSubchapter = async (req, res) => {
    try {
        const subchapter = await Subchapter.findById(req.params.id);
        if (subchapter) {
            res.json(subchapter);
        } else {
            res.status(404).json({ message: 'Subchapter not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get quiz for a subchapter
// @route   GET /api/learn/subchapters/:id/quiz
// @access  Public
const getQuiz = async (req, res) => {
    try {
        const subchapterId = req.params.id;

        // First, check if questions already exist in database
        let questions = await QuizQuestion.find({ subchapterId });

        // If questions exist, return them
        if (questions && questions.length > 0) {
            return res.json(questions);
        }

        // If no questions exist, generate them using Gemini AI
        const subchapter = await Subchapter.findById(subchapterId);

        if (!subchapter) {
            return res.status(404).json({ message: 'Subchapter not found' });
        }

        // Try to generate questions using Gemini AI
        try {
            const { generateQuizQuestions, generateFallbackQuestions } = require('../services/geminiService');

            let generatedQuestions;
            try {
                // Attempt to generate with Gemini AI
                generatedQuestions = await generateQuizQuestions(
                    subchapter.name,
                    subchapter.lessonContent,
                    5 // Generate 5 questions
                );
            } catch (aiError) {
                console.warn('Gemini AI generation failed, using fallback:', aiError.message);
                // Use fallback questions if AI fails
                generatedQuestions = generateFallbackQuestions(subchapter.name);
            }

            // Save generated questions to database
            const savedQuestions = await Promise.all(
                generatedQuestions.map(async (q) => {
                    const quizQuestion = new QuizQuestion({
                        subchapterId: subchapterId,
                        question: q.question,
                        options: q.options,
                        correctIndex: q.correctIndex,
                        explanation: q.explanation
                    });
                    return await quizQuestion.save();
                })
            );

            return res.json(savedQuestions);
        } catch (error) {
            console.error('Error generating quiz questions:', error);
            // Return empty array if all generation methods fail
            return res.json([]);
        }
    } catch (error) {
        console.error('Server error in getQuiz:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get chapter with full content (all subchapters combined)
// @route   GET /api/learn/chapters/:chapterId/content
// @access  Public
const getChapterWithContent = async (req, res) => {
    try {
        const chapter = await Chapter.findById(req.params.chapterId);
        if (!chapter) {
            return res.status(404).json({ message: 'Chapter not found' });
        }

        const subchapters = await Subchapter.find({ chapterId: req.params.chapterId }).sort({ index: 1 });

        // Combine all subchapter content into one markdown document
        let combinedContent = `# ${chapter.name}\n\n`;

        subchapters.forEach((subchapter, index) => {
            combinedContent += `## ${index + 1}. ${subchapter.name}\n\n`;
            combinedContent += subchapter.lessonContent || 'Content coming soon...\n\n';
            combinedContent += '\n---\n\n';
        });

        res.json({
            chapter,
            subchapters,
            combinedContent,
            totalSubchapters: subchapters.length
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Regenerate quiz questions for a subchapter (Admin)
// @route   POST /api/learn/subchapters/:id/quiz/regenerate
// @access  Public (should be protected in production)
const regenerateQuiz = async (req, res) => {
    try {
        const subchapterId = req.params.id;

        // Delete existing questions
        await QuizQuestion.deleteMany({ subchapterId });

        // Get subchapter
        const subchapter = await Subchapter.findById(subchapterId);

        if (!subchapter) {
            return res.status(404).json({ message: 'Subchapter not found' });
        }

        // Generate new questions
        const { generateQuizQuestions, generateFallbackQuestions } = require('../services/geminiService');

        let generatedQuestions;
        try {
            generatedQuestions = await generateQuizQuestions(
                subchapter.name,
                subchapter.lessonContent,
                5
            );
        } catch (aiError) {
            console.warn('Gemini AI generation failed, using fallback:', aiError.message);
            generatedQuestions = generateFallbackQuestions(subchapter.name);
        }

        // Save new questions
        const savedQuestions = await Promise.all(
            generatedQuestions.map(async (q) => {
                const quizQuestion = new QuizQuestion({
                    subchapterId: subchapterId,
                    question: q.question,
                    options: q.options,
                    correctIndex: q.correctIndex,
                    explanation: q.explanation
                });
                return await quizQuestion.save();
            })
        );

        res.json({ message: 'Quiz regenerated successfully', questions: savedQuestions });
    } catch (error) {
        console.error('Error regenerating quiz:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get visuals/simulations for a subchapter
// @route   GET /api/learn/subchapters/:id/visuals
// @access  Public
const getVisuals = async (req, res) => {
    try {
        const subchapter = await Subchapter.findById(req.params.id);

        if (!subchapter) {
            return res.status(404).json({ message: 'Subchapter not found' });
        }

        res.json(subchapter.visuals || []);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Generate reading material using AI
// @route   POST /api/learn/subchapters/:id/generate-content
// @access  Public
const generateReadingMaterial = async (req, res) => {
    try {
        const { id } = req.params;
        const geminiService = require('../services/geminiService');

        // Get subchapter details
        const subchapter = await Subchapter.findById(id).populate('chapterId');
        if (!subchapter) {
            return res.status(404).json({ message: 'Subchapter not found' });
        }

        // Generate content using Gemini
        const prompt = `Generate comprehensive reading material for the following topic:

Topic: ${subchapter.name}
Chapter: ${subchapter.chapterId?.name || 'General'}

Please provide:
1. A clear introduction (2-3 paragraphs)
2. Main concepts explained in detail (4-5 sections)
3. Real-world examples and applications
4. Key takeaways (bullet points)
5. Summary

Format the content in Markdown for easy reading. Make it educational, engaging, and suitable for students. Use proper headings (##, ###) and formatting.`;

        const generatedContent = await geminiService.generateContent(prompt);

        // Update subchapter with generated content
        subchapter.lessonContent = generatedContent;
        await subchapter.save();

        res.json({
            success: true,
            content: generatedContent,
            message: 'Reading material generated successfully'
        });
    } catch (error) {
        console.error('Error generating reading material:', error);
        res.status(500).json({
            message: 'Failed to generate reading material',
            error: error.message
        });
    }
};

module.exports = {
    getClasses,
    getSubjects,
    getChapters,
    getSubchapters,
    getSubchapter,
    getQuiz,
    getChapterWithContent,
    regenerateQuiz,
    getVisuals,
    generateReadingMaterial
};
