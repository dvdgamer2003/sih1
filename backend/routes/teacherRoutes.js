const express = require('express');
const router = express.Router();
const { getTeacherStats, createQuiz, assignQuiz, assignChapter, createChapter, assignCustomChapter, getMyContent, getStudents, deleteQuiz, updateQuiz } = require('../controllers/teacherController');
const { protect, teacherOnly } = require('../middleware/auth');

router.get('/stats', protect, teacherOnly, getTeacherStats);
router.get('/content', protect, teacherOnly, getMyContent);
router.get('/students', protect, teacherOnly, getStudents);
router.post('/quiz', protect, teacherOnly, createQuiz);
router.delete('/quiz/:id', protect, teacherOnly, deleteQuiz);
router.put('/quiz/:id', protect, teacherOnly, updateQuiz);
router.post('/assign-quiz', protect, teacherOnly, assignQuiz);
router.post('/assign-chapter', protect, teacherOnly, assignChapter);
router.post('/chapter', protect, teacherOnly, createChapter);
router.post('/assign-custom-chapter', protect, teacherOnly, assignCustomChapter);

module.exports = router;
