const express = require('express');
const router = express.Router();
const { saveGameResult, getHighscores } = require('../controllers/gameController');
const { protect } = require('../middleware/auth');

router.post('/result', protect, saveGameResult);
router.get('/highscores', getHighscores);

module.exports = router;
