const User = require('../models/User');

// @desc    Daily check-in for streak
// @route   POST /api/streak/checkin
// @access  Private
const dailyCheckin = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const lastActive = user.lastActiveDate ? new Date(user.lastActiveDate) : null;

        if (lastActive) {
            lastActive.setHours(0, 0, 0, 0);
            const daysDiff = Math.floor((today - lastActive) / (1000 * 60 * 60 * 24));

            if (daysDiff === 0) {
                // Already checked in today
                return res.json({
                    streak: user.streak,
                    message: 'Already checked in today',
                    alreadyCheckedIn: true
                });
            } else if (daysDiff === 1) {
                // Consecutive day - increment streak
                user.streak += 1;
            } else {
                // Missed days - reset streak
                user.streak = 1;
            }
        } else {
            // First check-in
            user.streak = 1;
        }

        user.lastActiveDate = today;

        // Add to streak history
        user.streakHistory.push({
            date: today,
            active: true
        });

        // Keep only last 30 days of history
        if (user.streakHistory.length > 30) {
            user.streakHistory = user.streakHistory.slice(-30);
        }

        await user.save();

        res.json({
            streak: user.streak,
            message: `Streak updated to ${user.streak} days!`,
            isNewStreak: user.streak === 1,
            alreadyCheckedIn: false
        });
    } catch (error) {
        console.error('Daily check-in error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get streak status
// @route   GET /api/streak/status
// @access  Private
const getStreakStatus = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId).select('streak lastActiveDate streakHistory');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const lastActive = user.lastActiveDate ? new Date(user.lastActiveDate) : null;
        let needsCheckin = true;

        if (lastActive) {
            lastActive.setHours(0, 0, 0, 0);
            const daysDiff = Math.floor((today - lastActive) / (1000 * 60 * 60 * 24));
            needsCheckin = daysDiff > 0;
        }

        res.json({
            streak: user.streak,
            lastActiveDate: user.lastActiveDate,
            needsCheckin,
            streakHistory: user.streakHistory.slice(-7) // Last 7 days
        });
    } catch (error) {
        console.error('Get streak status error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    dailyCheckin,
    getStreakStatus
};
