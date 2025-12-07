const express = require('express');
const router = express.Router();
const { getNotifications, markAsRead, markAllAsRead, sendNotification } = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getNotifications);
router.put('/:id/read', markAsRead);
router.put('/read-all', markAllAsRead);
router.post('/send', sendNotification);

module.exports = router;
