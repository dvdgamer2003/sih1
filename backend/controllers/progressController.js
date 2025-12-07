const ChapterProgress = require('../models/ChapterProgress');

// Mark chapter as complete or update progress
exports.updateChapterProgress = async (req, res) => {
    try {
        const { chapterId, subjectId, classId, completed, completedAt } = req.body;
        const userId = req.user.id;

        console.log('[ProgressController] Updating chapter progress:', {
            userId,
            chapterId,
            subjectId,
            classId,
            completed
        });

        // Validate required fields
        if (!chapterId || !subjectId || !classId) {
            return res.status(400).json({
                message: 'chapterId, subjectId, and classId are required'
            });
        }

        // Find existing progress or create new
        let progress = await ChapterProgress.findOne({ userId, chapterId });

        if (progress) {
            // Update existing progress
            progress.completed = completed !== undefined ? completed : progress.completed;
            progress.completedAt = completed && completedAt ? new Date(completedAt) : progress.completedAt;
            progress.lastAccessedAt = new Date();
            progress.subjectId = subjectId;
            progress.classId = classId;
            await progress.save();

            console.log('[ProgressController] Updated existing progress');
        } else {
            // Create new progress entry
            progress = await ChapterProgress.create({
                userId,
                chapterId,
                subjectId,
                classId,
                completed: completed || false,
                completedAt: completed && completedAt ? new Date(completedAt) : null,
                lastAccessedAt: new Date()
            });

            console.log('[ProgressController] Created new progress entry');
        }

        res.status(200).json({
            message: 'Progress updated successfully',
            progress
        });
    } catch (error) {
        console.error('[ProgressController] Error updating progress:', error);
        res.status(500).json({
            message: 'Failed to update progress',
            error: error.message
        });
    }
};

// Get progress for a specific chapter
exports.getChapterProgress = async (req, res) => {
    try {
        const { chapterId } = req.params;
        const userId = req.user.id;

        const progress = await ChapterProgress.findOne({ userId, chapterId });

        if (!progress) {
            return res.status(404).json({
                message: 'Progress not found',
                progress: null
            });
        }

        res.status(200).json({ progress });
    } catch (error) {
        console.error('[ProgressController] Error getting chapter progress:', error);
        res.status(500).json({
            message: 'Failed to get progress',
            error: error.message
        });
    }
};

// Get all progress for a subject
exports.getSubjectProgress = async (req, res) => {
    try {
        const { subjectId, classId } = req.params;
        const userId = req.user.id;

        const chapters = await ChapterProgress.find({ userId, subjectId, classId });
        const stats = await ChapterProgress.getSubjectProgress(userId, subjectId, classId);

        res.status(200).json({
            chapters,
            stats
        });
    } catch (error) {
        console.error('[ProgressController] Error getting subject progress:', error);
        res.status(500).json({
            message: 'Failed to get subject progress',
            error: error.message
        });
    }
};

// Get all progress for a class
exports.getClassProgress = async (req, res) => {
    try {
        const { classId } = req.params;
        const userId = req.user.id;

        const chapters = await ChapterProgress.find({ userId, classId });
        const stats = await ChapterProgress.getClassProgress(userId, classId);

        res.status(200).json({
            chapters,
            stats
        });
    } catch (error) {
        console.error('[ProgressController] Error getting class progress:', error);
        res.status(500).json({
            message: 'Failed to get class progress',
            error: error.message
        });
    }
};

// Get all progress for the user
exports.getAllProgress = async (req, res) => {
    try {
        const userId = req.user.id;

        const progress = await ChapterProgress.find({ userId })
            .sort({ lastAccessedAt: -1 });

        const totalChapters = progress.length;
        const completedChapters = progress.filter(p => p.completed).length;
        const overallProgress = totalChapters > 0
            ? Math.round((completedChapters / totalChapters) * 100)
            : 0;

        res.status(200).json({
            progress,
            stats: {
                totalChapters,
                completedChapters,
                overallProgress
            }
        });
    } catch (error) {
        console.error('[ProgressController] Error getting all progress:', error);
        res.status(500).json({
            message: 'Failed to get progress',
            error: error.message
        });
    }
};

// Clear all progress (for testing)
exports.clearAllProgress = async (req, res) => {
    try {
        const userId = req.user.id;

        await ChapterProgress.deleteMany({ userId });

        res.status(200).json({
            message: 'All progress cleared successfully'
        });
    } catch (error) {
        console.error('[ProgressController] Error clearing progress:', error);
        res.status(500).json({
            message: 'Failed to clear progress',
            error: error.message
        });
    }
};
