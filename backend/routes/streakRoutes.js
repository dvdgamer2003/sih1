const express = require('express');
const router = express.Router();
const { dailyCheckin, getStreakStatus } = require('../controllers/streakController');
const { protect } = require('../middleware/auth');

router.post('/checkin', protect, dailyCheckin);
router.get('/status', protect, getStreakStatus);

module.exports = router;
