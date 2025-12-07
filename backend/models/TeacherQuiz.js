const mongoose = require('mongoose');

const teacherQuizSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    classNumber: { type: String, required: true },
    subject: { type: String, required: true },
    questions: [{
        question: { type: String, required: true },
        options: [{ type: String, required: true }],
        correctIndex: { type: Number, required: true }
    }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TeacherQuiz', teacherQuizSchema);
