const Joi = require('joi');

const registerSchema = Joi.object({
    name: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    language: Joi.string().optional(),
    role: Joi.string().valid('student', 'teacher', 'institute', 'admin').default('student'),
    selectedClass: Joi.number().optional().allow(null),
    avatar: Joi.string().optional().allow(null),
    themeColor: Joi.string().optional().allow(null)
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    role: Joi.string().valid('student', 'teacher').optional()
});

module.exports = { registerSchema, loginSchema };
