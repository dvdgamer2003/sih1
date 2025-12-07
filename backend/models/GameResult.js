const mongoose = require('mongoose');

const gameResultSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    gameType: { type: String, required: true }, // 'odd-one-out', 'memory-match'
    score: { type: Number, required: true },
    timeTaken: { type: Number }, // in seconds
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GameResult', gameResultSchema);
