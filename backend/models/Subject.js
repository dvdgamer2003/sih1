const mongoose = require('mongoose');

const subjectSchema = mongoose.Schema({
    classId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    icon: {
        type: String, // MaterialCommunityIcons name
        default: 'book-open-variant'
    },
    chapters: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chapter'
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Subject', subjectSchema);
