const mongoose = require('mongoose');

const gameResultSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    gameType: { type: String, required: true }, // 'odd-one-out', 'memory-match'
    score: { type: Number, required: true },
    timeTaken: { type: Number }, // in seconds
    timestamp: { type: Date, default: Date.now },

    // Delta System & Analytics Fields
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
    subject: { type: String },
    classLevel: { type: String },
    delta: { type: Number },
    proficiency: { type: String },
    accuracy: { type: Number },
    completedLevel: { type: Number },
    attempts: { type: Number },
    mistakes: { type: Number }
});

module.exports = mongoose.model('GameResult', gameResultSchema);
