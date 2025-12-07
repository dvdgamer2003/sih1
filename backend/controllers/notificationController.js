const Notification = require('../models/Notification');

// Get user's notifications
exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.user._id })
            .sort({ createdAt: -1 })
            .limit(50);

        const unreadCount = await Notification.countDocuments({
            recipient: req.user._id,
            isRead: false
        });

        res.json({ notifications, unreadCount });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await Notification.findOne({
            _id: id,
            recipient: req.user._id
        });

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        notification.isRead = true;
        await notification.save();

        res.json({ message: 'Marked as read' });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Mark all as read
exports.markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { recipient: req.user._id, isRead: false },
            { $set: { isRead: true } }
        );
        res.json({ message: 'All marked as read' });
    } catch (error) {
        console.error('Error marking all as read:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Send notification (Internal helper or Admin endpoint)
exports.sendNotification = async (req, res) => {
    try {
        const { recipientId, title, message, type, data } = req.body;

        // Basic permission check - only admin or system can send arbitrary notifications
        // For now, allowing any authenticated user to send (e.g. teacher to student)
        // In production, you'd want stricter checks

        const notification = await Notification.create({
            recipient: recipientId,
            sender: req.user._id,
            type,
            title,
            message,
            data
        });

        res.status(201).json(notification);
    } catch (error) {
        console.error('Error sending notification:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Internal helper to create notification
exports.createNotification = async ({ recipient, sender, type, title, message, data }) => {
    try {
        await Notification.create({
            recipient,
            sender,
            type,
            title,
            message,
            data
        });
    } catch (error) {
        console.error('Error creating internal notification:', error);
    }
};
