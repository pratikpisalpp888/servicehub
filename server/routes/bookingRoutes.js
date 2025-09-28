const express = require('express');
const { 
  createBooking, 
  payVisitCharge, 
  completeBooking, 
  getUserBookings 
} = require('../controllers/bookingController');
const { validateBooking } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Create a new booking
router.post('/', authenticateToken, validateBooking, createBooking);

// Pay visit charge for a booking
router.post('/:bookingId/pay-visit-charge', authenticateToken, payVisitCharge);

// Complete a booking
router.put('/:bookingId/complete', authenticateToken, completeBooking);

// Get user's bookings
router.get('/my-bookings', authenticateToken, getUserBookings);

module.exports = router;