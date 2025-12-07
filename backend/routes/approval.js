const express = require('express');
const router = express.Router();
const { getPendingUsers, approveUser, rejectUser } = require('../controllers/approvalController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// Get pending users
router.get('/pending', getPendingUsers);

// Approve user
router.post('/approve/:userId', approveUser);

// Reject user
router.post('/reject/:userId', rejectUser);

module.exports = router;
