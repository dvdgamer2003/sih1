const QuizResult = require('../models/QuizResult');
const GameResult = require('../models/GameResult');
const User = require('../models/User');

// @desc    Sync offline data
// @route   POST /api/sync
// @access  Private
const syncData = async (req, res) => {
    try {
        const { quizResults, gameResults, completedLessons } = req.body;
        const userId = req.user._id;

        let syncedCount = 0;

        // Sync Quiz Results
        if (quizResults && quizResults.length > 0) {
            const quizzesToInsert = quizResults.map(q => ({ ...q, userId }));
            await QuizResult.insertMany(quizzesToInsert);
            syncedCount += quizResults.length;
        }

        // Sync Game Results
        if (gameResults && gameResults.length > 0) {
            const gamesToInsert = gameResults.map(g => ({ ...g, userId }));
            await GameResult.insertMany(gamesToInsert);
            syncedCount += gameResults.length;
        }

        // Sync Completed Lessons (XP Update)
        if (completedLessons && completedLessons.length > 0) {
            const user = await User.findById(userId);
            if (user) {
                user.xp += completedLessons.length * 10; // 10 XP per lesson
                await user.save();
            }
        }

        res.json({ message: 'Sync successful', syncedCount });
    } catch (error) {
        console.error('Error in syncData:', error);
        res.status(500).json({ message: 'Failed to sync data', error: error.message });
    }
};

module.exports = { syncData };
