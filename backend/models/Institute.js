const mongoose = require('mongoose');

const instituteSchema = new mongoose.Schema({
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    address: { type: String },
    adminEmail: { type: String, required: true },
    status: { type: String, enum: ['active', 'disabled'], default: 'active' },
    contactEmail: { type: String },
    contactPhone: { type: String },
    teachers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

instituteSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Institute', instituteSchema);
