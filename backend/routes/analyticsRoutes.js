const express = require('express');
const router = express.Router();
const { getStudentAnalytics, getClassAnalytics } = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/student/:studentId', getStudentAnalytics);
router.get('/class/:classId', getClassAnalytics);

module.exports = router;
