const express = require('express');
const { registerUser, loginUser, getCurrentUser } = require('../controllers/authController');
const { validateUserRegistration, validateUserLogin } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');
const { authLimiter } = require('../middleware/security');

const router = express.Router();

// Apply rate limiting to auth routes
router.use('/register', authLimiter);
router.use('/login', authLimiter);

// Register a new user
router.post('/register', validateUserRegistration, registerUser);

// Login user
router.post('/login', validateUserLogin, loginUser);

// Get current user profile
router.get('/me', authenticateToken, getCurrentUser);

module.exports = router;