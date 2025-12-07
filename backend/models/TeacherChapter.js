const mongoose = require('mongoose');

const teacherChapterSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true }, // Markdown or HTML content
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    classNumber: { type: String, required: true },
    subject: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TeacherChapter', teacherChapterSchema);
