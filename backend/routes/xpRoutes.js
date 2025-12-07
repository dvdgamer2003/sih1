const express = require('express');
const router = express.Router();
const { addXP, syncXP, getXPStatus, getLeaderboard } = require('../controllers/xpController');
const { protect } = require('../middleware/auth');

router.post('/add', protect, addXP);
router.put('/sync', protect, syncXP);
router.get('/status', protect, getXPStatus);
router.get('/leaderboard', protect, getLeaderboard);

module.exports = router;
