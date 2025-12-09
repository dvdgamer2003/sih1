const Feedback = require('../models/Feedback');
const User = require('../models/User');

// Create new feedback
const createFeedback = async (req, res) => {
    try {
        const { targetType, targetId, targetName, rating, comment, category } = req.body;

        const feedback = new Feedback({
            userId: req.user.id,
            instituteId: req.user.instituteId || null,
            targetType,
            targetId: targetId || null,
            targetName: targetName || null,
            rating,
            comment,
            category: category || 'other'
        });

        await feedback.save();

        res.status(201).json({
            success: true,
            message: 'Feedback submitted successfully',
            feedback
        });
    } catch (error) {
        console.error('Create feedback error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit feedback',
            error: error.message
        });
    }
};

// Get user's own feedback
const getUserFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.find({ userId: req.user.id })
            .sort({ createdAt: -1 })
            .limit(50);

        res.json({
            success: true,
            feedback,
            count: feedback.length
        });
    } catch (error) {
        console.error('Get user feedback error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch feedback',
            error: error.message
        });
    }
};

// Get feedback for teacher (from their students)
const getTeacherFeedback = async (req, res) => {
    try {
        const teacherId = req.user.id;

        // Get students assigned to this teacher
        const students = await User.find({
            assignedTeacher: teacherId,
            role: 'student'
        }).select('_id');

        const studentIds = students.map(s => s._id);

        // Get user to check instituteId
        const teacher = await User.findById(teacherId);

        // Get feedback from those students OR feedback specifically targeting this teacher OR broadcast to all teachers in institute
        const query = {
            $or: [
                { userId: { $in: studentIds } },
                { targetId: teacherId },
            ]
        };

        if (teacher.instituteId) {
            query.$or.push({
                targetType: 'all_teachers',
                instituteId: teacher.instituteId
            });
        }

        const feedback = await Feedback.find(query)
            .populate('userId', 'name email avatar')
            .sort({ createdAt: -1 })
            .limit(100);

        // Get stats
        const stats = await Feedback.aggregate([
            { $match: { userId: { $in: studentIds } } },
            {
                $group: {
                    _id: null,
                    totalFeedback: { $sum: 1 },
                    avgRating: { $avg: '$rating' },
                    pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } }
                }
            }
        ]);

        res.json({
            success: true,
            feedback,
            stats: stats[0] || { totalFeedback: 0, avgRating: 0, pending: 0 },
            totalStudents: studentIds.length
        });
    } catch (error) {
        console.error('Get teacher feedback error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch feedback',
            error: error.message
        });
    }
};

// Get all feedback (Admin)
const getAllFeedback = async (req, res) => {
    try {
        const { targetType, category, status, page = 1, limit = 50 } = req.query;

        const query = {};
        if (targetType) query.targetType = targetType;
        if (category) query.category = category;
        if (status) query.status = status;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const feedback = await Feedback.find(query)
            .populate('userId', 'name email avatar role')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Feedback.countDocuments(query);

        // Get overall stats
        const stats = await Feedback.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    avgRating: { $avg: '$rating' },
                    pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
                    reviewed: { $sum: { $cond: [{ $eq: ['$status', 'reviewed'] }, 1, 0] } },
                    resolved: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } }
                }
            }
        ]);

        // Get by category
        const byCategory = await Feedback.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } }
        ]);

        // Get by target type
        const byType = await Feedback.aggregate([
            { $group: { _id: '$targetType', count: { $sum: 1 } } }
        ]);

        res.json({
            success: true,
            feedback,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            },
            stats: stats[0] || { total: 0, avgRating: 0, pending: 0, reviewed: 0, resolved: 0 },
            byCategory,
            byType
        });
    } catch (error) {
        console.error('Get all feedback error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch feedback',
            error: error.message
        });
    }
};

// Update feedback status (Admin)
const updateFeedbackStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, adminNotes } = req.body;

        const feedback = await Feedback.findByIdAndUpdate(
            id,
            {
                status,
                adminNotes: adminNotes || null
            },
            { new: true }
        ).populate('userId', 'name email');

        if (!feedback) {
            return res.status(404).json({
                success: false,
                message: 'Feedback not found'
            });
        }

        res.json({
            success: true,
            message: 'Feedback status updated',
            feedback
        });
    } catch (error) {
        console.error('Update feedback status error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update feedback',
            error: error.message
        });
    }
};

// Delete feedback (Admin)
const deleteFeedback = async (req, res) => {
    try {
        const { id } = req.params;

        const feedback = await Feedback.findByIdAndDelete(id);

        if (!feedback) {
            return res.status(404).json({
                success: false,
                message: 'Feedback not found'
            });
        }

        res.json({
            success: true,
            message: 'Feedback deleted successfully'
        });
    } catch (error) {
        console.error('Delete feedback error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete feedback',
            error: error.message
        });
    }
};

module.exports = {
    createFeedback,
    getUserFeedback,
    getTeacherFeedback,
    getAllFeedback,
    updateFeedbackStatus,
    deleteFeedback
};
