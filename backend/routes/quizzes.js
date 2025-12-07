const express = require('express');
const router = express.Router();
const { getRandomQuiz, submitQuizResult, getTopicQuiz } = require('../controllers/quizController');
const { protect } = require('../middleware/auth');

router.get('/', getTopicQuiz);
router.get('/random', getRandomQuiz);
router.post('/submit', protect, submitQuizResult);

module.exports = router;
