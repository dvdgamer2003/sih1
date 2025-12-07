const User = require('../models/User');
const TeacherQuiz = require('../models/TeacherQuiz');
const Chapter = require('../models/Chapter');
const TeacherChapter = require('../models/TeacherChapter');

// @desc    Get teacher stats
// @route   GET /api/teacher/stats
// @access  Private/Teacher
const getTeacherStats = async (req, res) => {
    try {
        // Mock stats for now, replace with real logic later
        res.json({
            totalStudents: 0,
            pendingApprovals: 0,
            averageAttendance: '0%'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new quiz
// @route   POST /api/teacher/quiz
// @access  Private/Teacher
const createQuiz = async (req, res) => {
    try {
        const { title, description, classNumber, subject, questions } = req.body;

        const quiz = await TeacherQuiz.create({
            title,
            description,
            teacherId: req.user._id,
            classNumber,
            subject,
            questions
        });

        // Auto-assign to all students in the class
        const students = await User.find({ role: 'student', selectedClass: classNumber });

        const updates = students.map(student => {
            student.assignments.push({
                type: 'quiz',
                quizId: quiz._id,
                assignedAt: new Date(),
                status: 'pending'
            });
            return student.save();
        });

        await Promise.all(updates);

        res.status(201).json(quiz);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Assign quiz to students
// @route   POST /api/teacher/assign-quiz
// @access  Private/Teacher
const assignQuiz = async (req, res) => {
    try {
        const { quizId, studentIds, classNumber } = req.body;

        let query = { role: 'student' };
        if (studentIds && studentIds.length > 0) {
            query._id = { $in: studentIds };
        } else if (classNumber) {
            query.selectedClass = classNumber;
        } else {
            return res.status(400).json({ message: 'Please provide studentIds or classNumber' });
        }

        const students = await User.find(query);

        const updates = students.map(student => {
            // Check if already assigned
            const alreadyAssigned = student.assignments.some(
                a => a.type === 'quiz' && a.quizId && a.quizId.toString() === quizId
            );

            if (!alreadyAssigned) {
                student.assignments.push({
                    type: 'quiz',
                    quizId: quizId,
                    assignedAt: new Date(),
                    status: 'pending'
                });
                return student.save();
            }
        });

        await Promise.all(updates);

        res.json({ message: `Quiz assigned to ${updates.length} students` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Assign chapter to students
// @route   POST /api/teacher/assign-chapter
// @access  Private/Teacher
const assignChapter = async (req, res) => {
    try {
        const { chapterId, studentIds, classNumber } = req.body;

        let query = { role: 'student' };
        if (studentIds && studentIds.length > 0) {
            query._id = { $in: studentIds };
        } else if (classNumber) {
            query.selectedClass = classNumber;
        } else {
            return res.status(400).json({ message: 'Please provide studentIds or classNumber' });
        }

        const students = await User.find(query);

        const updates = students.map(student => {
            // Check if already assigned
            const alreadyAssigned = student.assignments.some(
                a => a.type === 'chapter' && a.chapterId && a.chapterId.toString() === chapterId
            );

            if (!alreadyAssigned) {
                student.assignments.push({
                    type: 'chapter',
                    chapterId: chapterId,
                    assignedAt: new Date(),
                    status: 'pending'
                });
                return student.save();
            }
        });

        await Promise.all(updates);

        res.json({ message: `Chapter assigned to ${updates.length} students` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new custom chapter
// @route   POST /api/teacher/chapter
// @access  Private/Teacher
const createChapter = async (req, res) => {
    try {
        const { title, content, classNumber, subject } = req.body;

        const chapter = await TeacherChapter.create({
            title,
            content,
            teacherId: req.user._id,
            classNumber,
            subject
        });

        // Auto-assign to all students in the class
        const students = await User.find({ role: 'student', selectedClass: classNumber });

        const updates = students.map(student => {
            student.assignments.push({
                type: 'teacherChapter',
                teacherChapterId: chapter._id,
                assignedAt: new Date(),
                status: 'pending'
            });
            return student.save();
        });

        await Promise.all(updates);

        res.status(201).json(chapter);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Assign custom chapter to students
// @route   POST /api/teacher/assign-custom-chapter
// @access  Private/Teacher
const assignCustomChapter = async (req, res) => {
    try {
        const { chapterId, studentIds, classNumber } = req.body;

        let query = { role: 'student' };
        if (studentIds && studentIds.length > 0) {
            query._id = { $in: studentIds };
        } else if (classNumber) {
            query.selectedClass = classNumber;
        } else {
            return res.status(400).json({ message: 'Please provide studentIds or classNumber' });
        }

        const students = await User.find(query);

        const updates = students.map(student => {
            // Check if already assigned
            const alreadyAssigned = student.assignments.some(
                a => a.type === 'teacherChapter' && a.teacherChapterId && a.teacherChapterId.toString() === chapterId
            );

            if (!alreadyAssigned) {
                student.assignments.push({
                    type: 'teacherChapter',
                    teacherChapterId: chapterId,
                    assignedAt: new Date(),
                    status: 'pending'
                });
                return student.save();
            }
        });

        await Promise.all(updates);

        res.json({ message: `Custom chapter assigned to ${updates.length} students` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all content created by teacher
// @route   GET /api/teacher/content
// @access  Private/Teacher
const getMyContent = async (req, res) => {
    try {
        const quizzes = await TeacherQuiz.find({ teacherId: req.user._id }).sort({ createdAt: -1 });
        const chapters = await TeacherChapter.find({ teacherId: req.user._id }).sort({ createdAt: -1 });

        const content = [
            ...quizzes.map(q => ({ ...q.toObject(), type: 'quiz' })),
            ...chapters.map(c => ({ ...c.toObject(), type: 'teacherChapter' }))
        ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.json(content);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all students
// @route   GET /api/teacher/students
// @access  Private/Teacher
const getStudents = async (req, res) => {
    try {
        // In a real app, you might want to filter by the teacher's assigned classes
        // For now, we'll return all students
        const students = await User.find({ role: 'student' }).select('-password').sort({ createdAt: -1 });
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a quiz
// @route   DELETE /api/teacher/quiz/:id
// @access  Private/Teacher
const deleteQuiz = async (req, res) => {
    try {
        const quiz = await TeacherQuiz.findById(req.params.id);

        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        if (quiz.teacherId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await quiz.deleteOne();
        res.json({ message: 'Quiz removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a quiz
// @route   PUT /api/teacher/quiz/:id
// @access  Private/Teacher
const updateQuiz = async (req, res) => {
    try {
        const { title, description, classNumber, subject, questions } = req.body;
        const quiz = await TeacherQuiz.findById(req.params.id);

        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        if (quiz.teacherId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        quiz.title = title || quiz.title;
        quiz.description = description || quiz.description;
        quiz.classNumber = classNumber || quiz.classNumber;
        quiz.subject = subject || quiz.subject;
        quiz.questions = questions || quiz.questions;

        const updatedQuiz = await quiz.save();
        res.json(updatedQuiz);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getTeacherStats,
    createQuiz,
    assignQuiz,
    assignChapter,
    createChapter,
    assignCustomChapter,
    getMyContent,
    getStudents,
    deleteQuiz,
    updateQuiz
};
