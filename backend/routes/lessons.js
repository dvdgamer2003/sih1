const express = require('express');
const router = express.Router();
const { getLessons, getLessonById, completeLesson } = require('../controllers/lessonController');
const { protect } = require('../middleware/auth');

router.get('/', getLessons);
router.get('/:id', getLessonById);
router.patch('/:id/complete', protect, completeLesson);

module.exports = router;
