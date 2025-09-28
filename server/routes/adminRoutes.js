const express = require('express');
const { getPendingProviders, reviewProviderRequest } = require('../controllers/providerController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// All admin routes require admin authentication
router.use(authenticateToken, authorizeRole('admin'));

// Get pending provider requests
router.get('/providers/pending', getPendingProviders);

// Approve or reject a provider request
router.put('/providers/:providerId/request', reviewProviderRequest);

module.exports = router;