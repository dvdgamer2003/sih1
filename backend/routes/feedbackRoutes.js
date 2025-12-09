const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    createFeedback,
    getUserFeedback,
    getTeacherFeedback,
    getAllFeedback,
    updateFeedbackStatus,
    deleteFeedback
} = require('../controllers/feedbackController');

// All routes require authentication
router.use(protect);

// Student/Teacher routes
router.post('/', createFeedback);
router.get('/user', getUserFeedback);

// Teacher routes
router.get('/teacher', getTeacherFeedback);

// Admin routes
router.get('/admin', getAllFeedback);
router.patch('/:id/status', updateFeedbackStatus);
router.delete('/:id', deleteFeedback);

module.exports = router;
