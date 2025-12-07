const Lesson = require('../models/Lesson');
const User = require('../models/User');
const NodeCache = require('node-cache');
const lessonCache = new NodeCache({ stdTTL: 600 }); // Cache for 10 minutes

// @desc    Get all lessons
// @route   GET /api/lessons
// @access  Public
const getLessons = async (req, res) => {
    try {
        const cachedLessons = lessonCache.get('allLessons');
        if (cachedLessons) {
            return res.json(cachedLessons);
        }

        const lessons = await Lesson.find({});
        lessonCache.set('allLessons', lessons);
        res.json(lessons);
    } catch (error) {
        console.error('Error in getLessons:', error);
        res.status(500).json({ message: 'Failed to fetch lessons', error: error.message });
    }
};

// @desc    Get single lesson
// @route   GET /api/lessons/:id
// @access  Public
const getLessonById = async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.id);

        if (lesson) {
            res.json(lesson);
        } else {
            res.status(404).json({ message: 'Lesson not found' });
        }
    } catch (error) {
        console.error('Error in getLessonById:', error);
        res.status(500).json({ message: 'Failed to fetch lesson', error: error.message });
    }
};

// @desc    Mark lesson as complete
// @route   PATCH /api/lessons/:id/complete
// @access  Private
const completeLesson = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            // Add XP logic here (simple +10 for now)
            user.xp += 10;
            await user.save();
            res.json({ message: 'Lesson completed', xp: user.xp });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error in completeLesson:', error);
        res.status(500).json({ message: 'Failed to complete lesson', error: error.message });
    }
};

module.exports = { getLessons, getLessonById, completeLesson };
