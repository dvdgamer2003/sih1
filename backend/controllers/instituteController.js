const User = require('../models/User');
const Institute = require('../models/Institute');
const QuizResult = require('../models/QuizResult');
const InstituteContent = require('../models/InstituteContent');

// @desc    Create a teacher account
// @route   POST /api/institute/teacher
// @access  Private/Institute
const createTeacher = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const instituteId = req.user.instituteId; // Assumes middleware sets req.user

        if (!instituteId) {
            return res.status(400).json({ message: 'Institute ID not found for this user' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const teacher = await User.create({
            name,
            email,
            password,
            role: 'teacher',
            instituteId,
            status: 'active'
        });

        // Add teacher to institute's teacher list
        await Institute.findByIdAndUpdate(instituteId, { $push: { teachers: teacher._id } });

        res.status(201).json({
            _id: teacher._id,
            name: teacher.name,
            email: teacher.email,
            instituteId: teacher.instituteId,
            status: teacher.status,
            createdAt: teacher.createdAt
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all teachers for the institute
// @route   GET /api/institute/teachers
// @access  Private/Institute
const getTeachers = async (req, res) => {
    try {
        const instituteId = req.user.instituteId;
        const teachers = await User.find({ role: 'teacher', instituteId }).select('-password');
        res.json(teachers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update teacher
// @route   PUT /api/institute/teacher/:id
// @access  Private/Institute
const updateTeacher = async (req, res) => {
    try {
        const teacher = await User.findById(req.params.id);

        if (teacher && teacher.instituteId.toString() === req.user.instituteId.toString()) {
            teacher.name = req.body.name || teacher.name;
            teacher.email = req.body.email || teacher.email;
            teacher.status = req.body.status || teacher.status;

            if (req.body.password) {
                teacher.password = req.body.password;
            }

            const updatedTeacher = await teacher.save();
            res.json({
                _id: updatedTeacher._id,
                name: updatedTeacher.name,
                email: updatedTeacher.email,
                status: updatedTeacher.status
            });
        } else {
            res.status(404).json({ message: 'Teacher not found or not authorized' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete teacher
// @route   DELETE /api/institute/teacher/:id
// @access  Private/Institute
const deleteTeacher = async (req, res) => {
    try {
        const teacher = await User.findById(req.params.id);

        if (teacher && teacher.instituteId.toString() === req.user.instituteId.toString()) {
            await Institute.findByIdAndUpdate(teacher.instituteId, { $pull: { teachers: teacher._id } });
            await teacher.deleteOne();
            res.json({ message: 'Teacher removed' });
        } else {
            res.status(404).json({ message: 'Teacher not found or not authorized' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get institute analytics
// @route   GET /api/institute/analytics
// @access  Private/Institute
const getInstituteAnalytics = async (req, res) => {
    try {
        const instituteId = req.user.instituteId;

        const totalTeachers = await User.countDocuments({ role: 'teacher', instituteId });
        const totalStudents = await User.countDocuments({ role: 'student', instituteId });

        // Get all students of this institute
        const students = await User.find({ role: 'student', instituteId }).select('_id selectedClass');
        const studentIds = students.map(s => s._id);

        // Avg Quiz Score
        const quizResults = await QuizResult.find({ userId: { $in: studentIds } });
        let avgQuizScore = 0;
        if (quizResults.length > 0) {
            const totalScore = quizResults.reduce((acc, curr) => acc + (curr.score / curr.totalQuestions) * 100, 0);
            avgQuizScore = Math.round(totalScore / quizResults.length);
        }

        // Chapter Completion Rate (Placeholder logic as tracking might vary)
        const chapterCompletionRate = 0; // Placeholder

        // Most Active Grades
        const gradeCounts = {};
        students.forEach(s => {
            if (s.selectedClass) {
                gradeCounts[s.selectedClass] = (gradeCounts[s.selectedClass] || 0) + 1;
            }
        });
        // Sort grades by count
        const mostActiveGrades = Object.entries(gradeCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([grade]) => `Class ${grade}`);

        const pendingApprovals = await User.countDocuments({
            role: { $in: ['teacher', 'student'] },
            instituteId,
            status: 'pending'
        });

        res.json({
            totalTeachers,
            totalStudents,
            pendingApprovals,
            avgQuizScore,
            chapterCompletionRate,
            mostActiveGrades
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Upload institute content
// @route   POST /api/institute/content
// @access  Private/Institute
const uploadContent = async (req, res) => {
    try {
        const { classNumber, subject, chapter, title, body, contentType } = req.body;
        const instituteId = req.user.instituteId;

        const content = await InstituteContent.create({
            instituteId,
            classNumber,
            subject,
            chapter,
            title,
            body,
            contentType
        });

        res.status(201).json(content);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    List institute content
// @route   GET /api/institute/content
// @access  Private/Institute
const listContent = async (req, res) => {
    try {
        const instituteId = req.user.instituteId;
        const content = await InstituteContent.find({ instituteId }).sort({ createdAt: -1 });
        res.json(content);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createTeacher,
    getTeachers,
    updateTeacher,
    deleteTeacher,
    getInstituteAnalytics,
    uploadContent,
    listContent
};
