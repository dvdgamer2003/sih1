const express = require('express');
const router = express.Router();
const { getStudentTasks, getQuizById } = require('../controllers/studentController');
const { protect } = require('../middleware/auth');

router.get('/tasks', protect, getStudentTasks);
router.get('/quiz/:id', protect, getQuizById);

module.exports = router;
