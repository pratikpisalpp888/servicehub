const express = require('express');
const { handleChatMessage } = require('../controllers/chatController');
const { validateChatMessage } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/security');

const router = express.Router();

// Apply rate limiting to chat routes
router.use('/', apiLimiter);

// Handle chat message
router.post('/', authenticateToken, validateChatMessage, handleChatMessage);

module.exports = router;