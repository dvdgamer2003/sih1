const express = require('express');
const router = express.Router();
const { syncData } = require('../controllers/syncController');
const { protect } = require('../middleware/auth');

router.post('/', protect, syncData);

module.exports = router;
