const express = require('express');
const router = express.Router();
const { getTeacherStats } = require('../controllers/teacherController');
const { protect, admin } = require('../middleware/auth');

router.get('/stats', protect, admin, getTeacherStats);

module.exports = router;
