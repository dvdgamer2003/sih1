const Institute = require('../models/Institute');
const User = require('../models/User');
const Class = require('../models/Class');
const Subject = require('../models/Subject');
const Chapter = require('../models/Chapter');
const Subchapter = require('../models/Subchapter');
const QuizResult = require('../models/QuizResult');

// --- User Management Controllers ---

// @desc    Get all users (with filtering)
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    try {
        const { role, search } = req.query;
        let query = {};

        if (role) {
            query.role = role;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const users = await User.find(query).select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new user
// @route   POST /api/admin/users
// @access  Private/Admin
const createUser = async (req, res) => {
    try {
        const { name, email, password, role, status, selectedClass } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            role: role || 'student',
            status: status || 'active',
            selectedClass: selectedClass || null
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.role = req.body.role || user.role;
            user.status = req.body.status || user.status;

            if (req.body.selectedClass) {
                user.selectedClass = req.body.selectedClass;
            }

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                status: updatedUser.status
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            await user.deleteOne();
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- Institute Controllers ---

// @desc    Create a new institute
// @route   POST /api/admin/institute
// @access  Private/Admin
const createInstitute = async (req, res) => {
    try {
        const { name, code, address, adminEmail, status } = req.body;

        const instituteExists = await Institute.findOne({ code });
        if (instituteExists) {
            return res.status(400).json({ message: 'Institute with this code already exists' });
        }

        const institute = await Institute.create({
            name,
            code,
            address,
            adminEmail,
            status: status || 'active'
        });

        res.status(201).json(institute);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all institutes
// @route   GET /api/admin/institutes
// @access  Private/Admin
const getInstitutes = async (req, res) => {
    try {
        // Get institutes from Institute model
        const instituteRecords = await Institute.find({});

        // Get users who registered as institutes
        const instituteUsers = await User.find({ role: 'institute' }).select('-password');

        // Combine both sources, marking the source
        const combinedInstitutes = [
            ...instituteRecords.map(inst => ({
                _id: inst._id,
                name: inst.name,
                code: inst.code,
                address: inst.address,
                adminEmail: inst.adminEmail,
                status: inst.status,
                source: 'institute_model',
                createdAt: inst.createdAt
            })),
            ...instituteUsers.map(user => ({
                _id: user._id,
                name: user.name,
                code: user.email?.split('@')[0]?.toUpperCase() || 'N/A',
                address: user.city || 'Not specified',
                adminEmail: user.email,
                status: user.status,
                source: 'user_registration',
                createdAt: user.createdAt
            }))
        ];

        // Sort by creation date (newest first)
        combinedInstitutes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.json(combinedInstitutes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update institute
// @route   PUT /api/admin/institute/:id
// @access  Private/Admin
const updateInstitute = async (req, res) => {
    try {
        const institute = await Institute.findById(req.params.id);

        if (institute) {
            institute.name = req.body.name || institute.name;
            institute.code = req.body.code || institute.code;
            institute.address = req.body.address || institute.address;
            institute.adminEmail = req.body.adminEmail || institute.adminEmail;
            institute.status = req.body.status || institute.status;

            const updatedInstitute = await institute.save();
            res.json(updatedInstitute);
        } else {
            res.status(404).json({ message: 'Institute not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete institute
// @route   DELETE /api/admin/institute/:id
// @access  Private/Admin
const deleteInstitute = async (req, res) => {
    try {
        const institute = await Institute.findById(req.params.id);

        if (institute) {
            await institute.deleteOne();
            res.json({ message: 'Institute removed' });
        } else {
            res.status(404).json({ message: 'Institute not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- Analytics Controller ---

// @desc    Get global analytics
// @route   GET /api/admin/analytics
// @access  Private/Admin
const getGlobalAnalytics = async (req, res) => {
    try {
        const GameResult = require('../models/GameResult');
        const ChapterProgress = require('../models/ChapterProgress');

        // Basic counts
        const totalInstitutes = await Institute.countDocuments({});
        const totalTeachers = await User.countDocuments({ role: 'teacher' });
        const totalStudents = await User.countDocuments({ role: 'student' });
        const totalQuizzesTaken = await QuizResult.countDocuments({});
        const totalGamesPlayed = await GameResult.countDocuments({});
        const totalLessonsCompleted = await ChapterProgress.countDocuments({ completed: true });
        const pendingApprovals = await User.countDocuments({ status: 'pending' });

        // Daily active users (last 24 hours)
        const yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
        const dailyActiveUsers = await User.countDocuments({ lastActiveDate: { $gte: yesterday } });

        // Weekly active users (last 7 days)
        const lastWeek = new Date(new Date().setDate(new Date().getDate() - 7));
        const weeklyActiveUsers = await User.countDocuments({ lastActiveDate: { $gte: lastWeek } });

        // User growth - new users this week vs last week
        const thisWeekStart = new Date(new Date().setDate(new Date().getDate() - 7));
        const lastWeekStart = new Date(new Date().setDate(new Date().getDate() - 14));
        const newUsersThisWeek = await User.countDocuments({ createdAt: { $gte: thisWeekStart } });
        const newUsersLastWeek = await User.countDocuments({
            createdAt: { $gte: lastWeekStart, $lt: thisWeekStart }
        });
        const userGrowthPercent = newUsersLastWeek > 0
            ? Math.round(((newUsersThisWeek - newUsersLastWeek) / newUsersLastWeek) * 100)
            : newUsersThisWeek > 0 ? 100 : 0;

        // Top 5 students by XP
        const topStudents = await User.find({ role: 'student', status: 'active' })
            .select('name email xp streak avatar city')
            .sort({ xp: -1 })
            .limit(5);

        // Game statistics
        const gameStats = await GameResult.aggregate([
            {
                $group: {
                    _id: '$gameType',
                    totalPlays: { $sum: 1 },
                    avgScore: { $avg: '$score' },
                    avgTime: { $avg: '$timeTaken' }
                }
            },
            { $sort: { totalPlays: -1 } },
            { $limit: 5 }
        ]);

        // User distribution by role
        const usersByRole = await User.aggregate([
            { $match: { status: 'active' } },
            { $group: { _id: '$role', count: { $sum: 1 } } }
        ]);

        // Recent registrations (last 7 days by day)
        const registrationTrend = await User.aggregate([
            { $match: { createdAt: { $gte: lastWeek } } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Average quiz score
        const avgQuizScore = await QuizResult.aggregate([
            { $group: { _id: null, avgScore: { $avg: '$score' } } }
        ]);

        // Users by city (top 5)
        const usersByCity = await User.aggregate([
            { $match: { city: { $ne: null, $ne: '' } } },
            { $group: { _id: '$city', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        res.json({
            // Basic stats
            totalInstitutes,
            totalTeachers,
            totalStudents,
            totalQuizzesTaken,
            totalGamesPlayed,
            totalLessonsCompleted,
            dailyActiveUsers,
            weeklyActiveUsers,
            pendingApprovals,

            // Growth metrics
            newUsersThisWeek,
            userGrowthPercent,

            // Engagement
            avgQuizScore: avgQuizScore[0]?.avgScore ? Math.round(avgQuizScore[0].avgScore) : 0,

            // Top performers
            topStudents,

            // Distributions
            gameStats,
            usersByRole,
            usersByCity,
            registrationTrend
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- Class Controllers ---

const createClass = async (req, res) => {
    try {
        const { classNumber } = req.body;
        const newClass = await Class.create({ classNumber });
        res.status(201).json(newClass);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateClass = async (req, res) => {
    try {
        const updatedClass = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedClass);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteClass = async (req, res) => {
    try {
        await Class.findByIdAndDelete(req.params.id);
        res.json({ message: 'Class deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- Subject Controllers ---

const createSubject = async (req, res) => {
    try {
        const { classId, name, icon } = req.body;
        const subject = await Subject.create({ classId, name, icon });
        await Class.findByIdAndUpdate(classId, { $push: { subjects: subject._id } });
        res.status(201).json(subject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateSubject = async (req, res) => {
    try {
        const updatedSubject = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedSubject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteSubject = async (req, res) => {
    try {
        const subject = await Subject.findById(req.params.id);
        if (subject) {
            await Class.findByIdAndUpdate(subject.classId, { $pull: { subjects: subject._id } });
            await subject.deleteOne();
            res.json({ message: 'Subject deleted' });
        } else {
            res.status(404).json({ message: 'Subject not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- Chapter Controllers ---

const createChapter = async (req, res) => {
    try {
        const { subjectId, name, index } = req.body;
        const chapter = await Chapter.create({ subjectId, name, index });
        await Subject.findByIdAndUpdate(subjectId, { $push: { chapters: chapter._id } });
        res.status(201).json(chapter);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateChapter = async (req, res) => {
    try {
        const updatedChapter = await Chapter.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedChapter);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteChapter = async (req, res) => {
    try {
        const chapter = await Chapter.findById(req.params.id);
        if (chapter) {
            await Subject.findByIdAndUpdate(chapter.subjectId, { $pull: { chapters: chapter._id } });
            await chapter.deleteOne();
            res.json({ message: 'Chapter deleted' });
        } else {
            res.status(404).json({ message: 'Chapter not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- Subchapter Controllers ---

const createSubchapter = async (req, res) => {
    try {
        const { chapterId, name, index, lessonContent } = req.body;
        const subchapter = await Subchapter.create({ chapterId, name, index, lessonContent });
        await Chapter.findByIdAndUpdate(chapterId, { $push: { subchapters: subchapter._id } });
        res.status(201).json(subchapter);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateSubchapter = async (req, res) => {
    try {
        const updatedSubchapter = await Subchapter.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedSubchapter);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteSubchapter = async (req, res) => {
    try {
        const subchapter = await Subchapter.findById(req.params.id);
        if (subchapter) {
            await Chapter.findByIdAndUpdate(subchapter.chapterId, { $pull: { subchapters: subchapter._id } });
            await subchapter.deleteOne();
            res.json({ message: 'Subchapter deleted' });
        } else {
            res.status(404).json({ message: 'Subchapter not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- Teacher Controllers (Legacy - can be replaced by generic User CRUD) ---

const getTeachers = async (req, res) => {
    try {
        const teachers = await User.find({ role: 'teacher' }).select('-password');
        res.json(teachers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createTeacher = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const user = await User.create({
            name,
            email,
            password,
            role: 'teacher'
        });
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateTeacher = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user && user.role === 'teacher') {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            if (req.body.password) {
                user.password = req.body.password;
            }
            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role
            });
        } else {
            res.status(404).json({ message: 'Teacher not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteTeacher = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user && user.role === 'teacher') {
            await user.deleteOne();
            res.json({ message: 'Teacher removed' });
        } else {
            res.status(404).json({ message: 'Teacher not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- Location/City Controllers ---

// @desc    Get users by city
// @route   GET /api/admin/users/by-city
// @access  Private/Admin
const getUsersByCity = async (req, res) => {
    try {
        const { city } = req.query;

        if (!city) {
            return res.status(400).json({ message: 'City parameter is required' });
        }

        const users = await User.find({
            city: { $regex: new RegExp(city, 'i') },
            status: 'active'
        }).select('-password');

        // Group by role
        const students = users.filter(u => u.role === 'student');
        const teachers = users.filter(u => u.role === 'teacher');
        const institutes = users.filter(u => u.role === 'institute');

        res.json({
            city,
            totalUsers: users.length,
            students,
            teachers,
            institutes,
            counts: {
                students: students.length,
                teachers: teachers.length,
                institutes: institutes.length
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all unique cities with user counts
// @route   GET /api/admin/cities
// @access  Private/Admin
const getUniqueCities = async (req, res) => {
    try {
        const cities = await User.aggregate([
            { $match: { city: { $ne: null, $ne: '' } } },
            {
                $group: {
                    _id: { $toLower: '$city' },
                    originalCity: { $first: '$city' },
                    totalUsers: { $sum: 1 },
                    students: { $sum: { $cond: [{ $eq: ['$role', 'student'] }, 1, 0] } },
                    teachers: { $sum: { $cond: [{ $eq: ['$role', 'teacher'] }, 1, 0] } },
                    institutes: { $sum: { $cond: [{ $eq: ['$role', 'institute'] }, 1, 0] } }
                }
            },
            { $sort: { totalUsers: -1 } }
        ]);

        const result = cities.map(c => ({
            city: c.originalCity,
            totalUsers: c.totalUsers,
            students: c.students,
            teachers: c.teachers,
            institutes: c.institutes
        }));

        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    createInstitute,
    getInstitutes,
    updateInstitute,
    deleteInstitute,
    getGlobalAnalytics,
    createClass,
    updateClass,
    deleteClass,
    createSubject,
    updateSubject,
    deleteSubject,
    createChapter,
    updateChapter,
    deleteChapter,
    createSubchapter,
    updateSubchapter,
    deleteSubchapter,
    getTeachers,
    createTeacher,
    updateTeacher,
    deleteTeacher,
    getUsersByCity,
    getUniqueCities
};
