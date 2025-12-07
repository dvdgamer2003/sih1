const mongoose = require('mongoose');

const subchapterSchema = mongoose.Schema({
    chapterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chapter',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    index: {
        type: Number,
        required: true
    },
    lessonContent: {
        type: String, // Markdown or HTML content
        default: ''
    },
    simulationPath: {
        type: String, // Path to PhET simulation (e.g., /simulations/gravity-and-orbits/gravity-and-orbits_en.html)
        default: null
    },
    visuals: [{
        title: { type: String },
        fileName: { type: String },
        description: { type: String },
        subject: { type: String }
    }],
    games: [{
        type: String,
        enum: ['odd-one-out', 'memory-match', 'interactive-science', 'none'],
        default: 'none'
    }],
    quizQuestions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'QuizQuestion'
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Subchapter', subchapterSchema);
