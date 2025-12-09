const User = require('../models/User');

/**
 * @desc    Get screen time stats for current user
 * @route   GET /api/wellbeing/my-stats
 * @access  Private
 */
const getMyStats = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Get last 7 days of data
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const screenTimeHistory = user.screenTimeHistory || [];
        const thisWeek = screenTimeHistory.filter(entry =>
            new Date(entry.date) >= sevenDaysAgo
        );

        // Calculate today's data
        const today = new Date().toISOString().split('T')[0];
        const todayData = screenTimeHistory.find(entry =>
            entry.date.toISOString().split('T')[0] === today
        ) || {
            date: today,
            totalMinutes: 0,
            breakdown: { games: 0, lessons: 0, quizzes: 0, other: 0 },
            sessions: 0
        };

        // Calculate average
        const totalMinutes = thisWeek.reduce((sum, d) => sum + d.totalMinutes, 0);
        const averageDaily = thisWeek.length > 0 ? Math.round(totalMinutes / thisWeek.length) : 0;

        res.json({
            today: todayData,
            thisWeek,
            dailyGoalMinutes: user.dailyGoalMinutes || 60,
            averageDaily
        });
    } catch (error) {
        console.error('Error getting wellbeing stats:', error);
        res.status(500).json({ message: 'Failed to get stats' });
    }
};

/**
 * @desc    Sync screen time data from frontend
 * @route   POST /api/wellbeing/sync
 * @access  Private
 */
const syncScreenTime = async (req, res) => {
    try {
        const { screenTimeData } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Initialize if not exists
        if (!user.screenTimeHistory) {
            user.screenTimeHistory = [];
        }

        // Merge incoming data with existing data
        for (const entry of screenTimeData) {
            const existingIndex = user.screenTimeHistory.findIndex(
                e => new Date(e.date).toISOString().split('T')[0] === entry.date
            );

            if (existingIndex >= 0) {
                // Update existing entry - take the higher value
                const existing = user.screenTimeHistory[existingIndex];
                existing.totalMinutes = Math.max(existing.totalMinutes, entry.totalMinutes);
                existing.breakdown = {
                    games: Math.max(existing.breakdown?.games || 0, entry.breakdown?.games || 0),
                    lessons: Math.max(existing.breakdown?.lessons || 0, entry.breakdown?.lessons || 0),
                    quizzes: Math.max(existing.breakdown?.quizzes || 0, entry.breakdown?.quizzes || 0),
                    other: Math.max(existing.breakdown?.other || 0, entry.breakdown?.other || 0),
                };
                existing.sessions = Math.max(existing.sessions || 0, entry.sessions || 0);
            } else {
                // Add new entry
                user.screenTimeHistory.push({
                    date: new Date(entry.date),
                    totalMinutes: entry.totalMinutes,
                    breakdown: entry.breakdown,
                    sessions: entry.sessions
                });
            }
        }

        // Keep only last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        user.screenTimeHistory = user.screenTimeHistory.filter(
            e => new Date(e.date) >= thirtyDaysAgo
        );

        await user.save();
        res.json({ message: 'Screen time synced successfully' });
    } catch (error) {
        console.error('Error syncing screen time:', error);
        res.status(500).json({ message: 'Failed to sync screen time' });
    }
};

/**
 * @desc    Log a single session
 * @route   POST /api/wellbeing/log-session
 * @access  Private
 */
const logSession = async (req, res) => {
    try {
        const { minutes, activity } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.screenTimeHistory) {
            user.screenTimeHistory = [];
        }

        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];

        let todayEntry = user.screenTimeHistory.find(
            e => e.date.toISOString().split('T')[0] === todayStr
        );

        if (!todayEntry) {
            todayEntry = {
                date: today,
                totalMinutes: 0,
                breakdown: { games: 0, lessons: 0, quizzes: 0, other: 0 },
                sessions: 0
            };
            user.screenTimeHistory.push(todayEntry);
        }

        todayEntry.totalMinutes += minutes;
        if (activity && todayEntry.breakdown[activity] !== undefined) {
            todayEntry.breakdown[activity] += minutes;
        } else {
            todayEntry.breakdown.other += minutes;
        }
        todayEntry.sessions += 1;

        await user.save();
        res.json({ message: 'Session logged' });
    } catch (error) {
        console.error('Error logging session:', error);
        res.status(500).json({ message: 'Failed to log session' });
    }
};

/**
 * @desc    Get all students' screen time for teacher
 * @route   GET /api/wellbeing/students
 * @access  Private (Teacher only)
 */
const getStudentsWellbeing = async (req, res) => {
    try {
        const teacher = await User.findById(req.user.id);
        if (!teacher || teacher.role !== 'teacher') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Get all students assigned to this teacher
        const students = await User.find({
            teacherId: req.user.id,
            role: 'student',
            status: 'active'
        }).select('name avatar screenTimeHistory streak lastActiveDate');

        const today = new Date().toISOString().split('T')[0];
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        let totalClassMinutes = 0;
        let activeToday = 0;

        const studentData = students.map(student => {
            const history = student.screenTimeHistory || [];

            // Today's minutes
            const todayEntry = history.find(
                e => e.date && e.date.toISOString().split('T')[0] === today
            );
            const todayMinutes = todayEntry?.totalMinutes || 0;

            // Weekly minutes
            const weeklyEntries = history.filter(
                e => e.date && new Date(e.date) >= sevenDaysAgo
            );
            const weeklyMinutes = weeklyEntries.reduce((sum, e) => sum + e.totalMinutes, 0);

            // Average daily
            const averageDaily = weeklyEntries.length > 0
                ? Math.round(weeklyMinutes / weeklyEntries.length)
                : 0;

            totalClassMinutes += todayMinutes;
            if (todayMinutes > 0) activeToday++;

            return {
                _id: student._id,
                name: student.name,
                avatar: student.avatar,
                todayMinutes,
                weeklyMinutes,
                averageDaily,
                lastActive: student.lastActiveDate,
                streak: student.streak || 0
            };
        });

        const classAverage = students.length > 0
            ? Math.round(totalClassMinutes / students.length)
            : 0;

        res.json({
            students: studentData,
            classAverage,
            totalStudents: students.length,
            activeToday
        });
    } catch (error) {
        console.error('Error getting students wellbeing:', error);
        res.status(500).json({ message: 'Failed to get students data' });
    }
};

/**
 * @desc    Update daily goal
 * @route   PUT /api/wellbeing/goal
 * @access  Private
 */
const updateDailyGoal = async (req, res) => {
    try {
        const { minutes } = req.body;

        await User.findByIdAndUpdate(req.user.id, {
            dailyGoalMinutes: minutes
        });

        res.json({ message: 'Goal updated' });
    } catch (error) {
        console.error('Error updating goal:', error);
        res.status(500).json({ message: 'Failed to update goal' });
    }
};

module.exports = {
    getMyStats,
    syncScreenTime,
    logSession,
    getStudentsWellbeing,
    updateDailyGoal
};
