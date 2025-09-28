const express = require('express');
const { 
  requestProvider, 
  getNearbyProviders, 
  getPendingProviders, 
  reviewProviderRequest 
} = require('../controllers/providerController');
const { validateProviderRequest } = require('../middleware/validation');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// Provider registration request
router.post('/request', authenticateToken, validateProviderRequest, requestProvider);

// Get nearby providers
router.get('/nearby', getNearbyProviders);

// Admin routes - get pending providers and approve/reject requests
router.get('/pending', authenticateToken, authorizeRole('admin'), getPendingProviders);
router.put('/:providerId/request', authenticateToken, authorizeRole('admin'), reviewProviderRequest);

module.exports = router;