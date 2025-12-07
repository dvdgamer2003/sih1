const GameResult = require('../models/GameResult');
const User = require('../models/User');

// @desc    Save game result
// @route   POST /api/games/result
// @access  Private
const saveGameResult = async (req, res) => {
    try {
        const { gameType, score, timeTaken } = req.body;
        const userId = req.user._id;

        const result = await GameResult.create({
            userId,
            gameType,
            score,
            timeTaken
        });

        // Update User XP
        const user = await User.findById(userId);
        if (user) {
            user.xp += Math.floor(score / 10); // Example XP logic
            await user.save();
        }

        res.status(201).json(result);
    } catch (error) {
        console.error('Error in saveGameResult:', error);
        res.status(500).json({ message: 'Failed to save game result', error: error.message });
    }
};

// @desc    Get highscores
// @route   GET /api/games/highscores
// @access  Public
const getHighscores = async (req, res) => {
    try {
        const highscores = await GameResult.find({})
            .sort({ score: -1 })
            .limit(10)
            .populate('userId', 'name');

        res.json(highscores);
    } catch (error) {
        console.error('Error in getHighscores:', error);
        res.status(500).json({ message: 'Failed to fetch highscores', error: error.message });
    }
};

module.exports = { saveGameResult, getHighscores };
