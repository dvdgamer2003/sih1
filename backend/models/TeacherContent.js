const mongoose = require('mongoose');

const teacherContentSchema = new mongoose.Schema({
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    classNumber: {
        type: Number,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    chapter: {
        type: String,
        required: true
    },
    contentType: {
        type: String,
        enum: ['note', 'pdf', 'link'],
        required: true
    },
    body: {
        type: String,
        required: true // URL for pdf/link, text for note
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('TeacherContent', teacherContentSchema);
