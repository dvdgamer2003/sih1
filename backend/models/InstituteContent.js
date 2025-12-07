const mongoose = require('mongoose');

const instituteContentSchema = new mongoose.Schema({
    instituteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Institute',
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
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true // URL for pdf/link, text for note
    },
    contentType: {
        type: String,
        enum: ['note', 'pdf', 'link'],
        default: 'note'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('InstituteContent', instituteContentSchema);
