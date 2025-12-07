const mongoose = require('mongoose');

const subPartSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String },
    description: { type: String }
});

const anatomySchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    subParts: [subPartSchema],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Anatomy', anatomySchema);
