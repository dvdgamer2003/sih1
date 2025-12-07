const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Update/create chapter progress
router.post('/chapter', progressController.updateChapterProgress);

// Get progress for a specific chapter
router.get('/chapter/:chapterId', progressController.getChapterProgress);

// Get progress for a subject
router.get('/subject/:classId/:subjectId', progressController.getSubjectProgress);

// Get progress for a class
router.get('/class/:classId', progressController.getClassProgress);

// Get all progress for the user
router.get('/all', progressController.getAllProgress);

// Clear all progress (for testing)
router.delete('/clear', progressController.clearAllProgress);

module.exports = router;
