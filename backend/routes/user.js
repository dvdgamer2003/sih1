const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Select class
router.post('/select-class', protect, async (req, res) => {
    try {
        const { classId } = req.body;
        const userId = req.user.id;

        console.log('[UserRoutes] Selecting class:', { userId, classId });

        // Validate classId
        // Validate classId
        if (!classId) {
            return res.status(400).json({ message: 'Class ID is required' });
        }

        let classNumber;
        if (typeof classId === 'string') {
            classNumber = parseInt(classId.replace('class-', ''));
        } else {
            classNumber = parseInt(classId);
        }

        if (isNaN(classNumber) || classNumber < 6 || classNumber > 12) {
            return res.status(400).json({
                message: 'Invalid class selection. Must be between 6 and 12.'
            });
        }

        // Update user's selected class
        const user = await User.findByIdAndUpdate(
            userId,
            { selectedClass: classNumber },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('[UserRoutes] Class updated successfully');

        res.status(200).json({
            message: 'Class selected successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                selectedClass: user.selectedClass,
            }
        });
    } catch (error) {
        console.error('[UserRoutes] Error selecting class:', error);
        res.status(500).json({
            message: 'Failed to select class',
            error: error.message
        });
    }
});

// Get user profile (includes selected class)
router.get('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password').populate('assignedTeacher', 'name');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                selectedClass: user.selectedClass,
                xp: user.xp,
                level: user.level,
                streak: user.streak,
                level: user.level,
                streak: user.streak,
                language: user.language,
                assignedTeacher: user.assignedTeacher
            }
        });
    } catch (error) {
        console.error('[UserRoutes] Error getting profile:', error);
        res.status(500).json({
            message: 'Failed to get profile',
            error: error.message
        });
    }
});

// Get available teachers for the student
router.get('/teachers', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const query = { role: 'teacher' };

        if (user.instituteId) {
            query.instituteId = user.instituteId;
        } else if (user.assignedTeacher) {
            query._id = user.assignedTeacher;
        } else {
            // If no institute and no assigned teacher, return empty
            return res.json({ teachers: [] });
        }

        const teachers = await User.find(query).select('name email avatar');
        res.json({ teachers });
    } catch (error) {
        console.error('[UserRoutes] Error getting teachers:', error);
        res.status(500).json({
            message: 'Failed to get teachers',
            error: error.message
        });
    }
});

module.exports = router;
