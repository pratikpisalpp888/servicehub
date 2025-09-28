const express = require('express');
const { addReview, getProviderReviews } = require('../controllers/reviewController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Add a review for a provider
router.post('/', authenticateToken, addReview);

// Get reviews for a provider
router.get('/:providerId', getProviderReviews);

module.exports = router;