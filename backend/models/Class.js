const mongoose = require('mongoose');

const classSchema = mongoose.Schema({
    classNumber: {
        type: Number,
        required: true,
        unique: true,
        min: 6,
        max: 12
    },
    subjects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject'
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Class', classSchema);
