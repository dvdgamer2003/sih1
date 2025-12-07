const express = require('express');
const router = express.Router();
const { registerUser, loginUser, refreshToken, logoutUser, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { registerSchema, loginSchema } = require('../utils/validators');

router.post('/register', validate(registerSchema), registerUser);
router.post('/login', validate(loginSchema), loginUser);
router.post('/refresh', refreshToken);
router.post('/logout', protect, logoutUser);
router.put('/profile', protect, updateProfile);

module.exports = router;
