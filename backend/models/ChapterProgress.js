const mongoose = require('mongoose');

const chapterProgressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    chapterId: {
        type: String,
        required: true,
        index: true
    },
    subjectId: {
        type: String,
        required: true,
        index: true
    },
    classId: {
        type: String,
        required: true,
        index: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Date
    },
    lastAccessedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Compound index for efficient queries
chapterProgressSchema.index({ userId: 1, chapterId: 1 }, { unique: true });
chapterProgressSchema.index({ userId: 1, subjectId: 1, classId: 1 });

// Static method to get subject progress
chapterProgressSchema.statics.getSubjectProgress = async function (userId, subjectId, classId) {
    const progress = await this.find({ userId, subjectId, classId });
    const completed = progress.filter(p => p.completed).length;

    return {
        totalChapters: progress.length,
        completedChapters: completed,
        progress: progress.length > 0 ? Math.round((completed / progress.length) * 100) : 0
    };
};

// Static method to get class progress
chapterProgressSchema.statics.getClassProgress = async function (userId, classId) {
    const progress = await this.find({ userId, classId });
    const completed = progress.filter(p => p.completed).length;
    const subjects = new Set(progress.map(p => p.subjectId));

    return {
        totalSubjects: subjects.size,
        totalChapters: progress.length,
        completedChapters: completed,
        overallProgress: progress.length > 0 ? Math.round((completed / progress.length) * 100) : 0
    };
};

module.exports = mongoose.model('ChapterProgress', chapterProgressSchema);
