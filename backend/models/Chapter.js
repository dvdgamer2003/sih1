const mongoose = require('mongoose');

const chapterSchema = mongoose.Schema({
    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
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
    subchapters: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subchapter'
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Chapter', chapterSchema);
