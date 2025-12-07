const mongoose = require('mongoose');

const quizQuestionSchema = mongoose.Schema({
    subchapterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subchapter',
        required: true
    },
    classNumber: {
        type: String,
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
    subchapter: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium'
    },
    question: {
        type: String,
        required: true
    },
    options: [{
        type: String,
        required: true
    }],
    correctIndex: {
        type: Number,
        required: true,
        min: 0
    },
    explanation: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('QuizQuestion', quizQuestionSchema);
