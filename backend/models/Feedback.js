const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    instituteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Institute',
        default: null
    },
    targetType: {
        type: String,
        enum: ['app', 'teacher', 'all_teachers', 'content', 'game', 'lesson'],
        required: true
    },
    targetId: {
        type: mongoose.Schema.Types.Mixed, // changed from ObjectId to Mixed to allow 'all' or similar strings if needed, though we use targetType
        default: null
    },
    targetName: {
        type: String,
        default: null
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment: {
        type: String,
        required: true,
        maxlength: 1000
    },
    category: {
        type: String,
        enum: ['bug', 'suggestion', 'praise', 'complaint', 'other'],
        default: 'other'
    },
    status: {
        type: String,
        enum: ['pending', 'reviewed', 'resolved'],
        default: 'pending'
    },
    adminNotes: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

// Index for efficient queries
feedbackSchema.index({ userId: 1, createdAt: -1 });
feedbackSchema.index({ targetType: 1, status: 1 });
feedbackSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Feedback', feedbackSchema);
