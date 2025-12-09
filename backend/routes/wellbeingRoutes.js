const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    getMyStats,
    syncScreenTime,
    logSession,
    getStudentsWellbeing,
    updateDailyGoal
} = require('../controllers/wellbeingController');

// All routes require authentication
router.use(protect);

// Student routes
router.get('/my-stats', getMyStats);
router.post('/sync', syncScreenTime);
router.post('/log-session', logSession);
router.put('/goal', updateDailyGoal);

// Teacher routes
router.get('/students', getStudentsWellbeing);

module.exports = router;
