const Booking = require('../models/Booking');
const Provider = require('../models/Provider');
const { processMockPayment, createPaymentIntent } = require('../utils/payment');

  // Create a new booking
  const createBooking = async (req, res) => {
    try {
      const { providerId, category, subCategory, timeslot, address, notes } = req.body;

      // Verify provider exists and is approved
      const provider = await Provider.findById(providerId);
      if (!provider || !provider.approved) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or unapproved provider'
        });
      }

      // Validate required fields
      if (!address) {
        return res.status(400).json({
          success: false,
          message: 'Address is required'
        });
      }

      // Create booking
      const booking = new Booking({
        userId: req.user._id,
        providerId,
        category,
        subCategory,
        timeslot: new Date(timeslot),
        address,
        notes
      });

      await booking.save();

      res.status(201).json({
        success: true,
        message: 'Booking created successfully',
        data: {
          booking
        }
      });
    } catch (error) {
      console.error('Create booking error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while creating booking'
      });
    }
  };

// Pay visit charge for a booking
const payVisitCharge = async (req, res) => {
  try {
    const { bookingId } = req.params;
    
    // Find booking
    const booking = await Booking.findById(bookingId)
      .populate('providerId', 'visitCharge');
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Verify user owns the booking
    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to pay for this booking'
      });
    }

    // Verify booking is in pending status
    if (booking.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Booking is not in pending status'
      });
    }

    // Process payment
    const visitCharge = booking.providerId.visitCharge;
    
    // Use Stripe if available, otherwise use mock payment
    let paymentResult;
    if (process.env.STRIPE_SECRET_KEY) {
      paymentResult = await createPaymentIntent(visitCharge);
    } else {
      paymentResult = await processMockPayment(visitCharge);
    }

    if (!paymentResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Payment processing failed',
        error: paymentResult.error
      });
    }

    // Update booking
    booking.visitChargePaid = true;
    booking.visitChargeTransactionId = paymentResult.transactionId;
    booking.status = 'confirmed';
    await booking.save();

    res.json({
      success: true,
      message: 'Visit charge paid successfully',
      data: {
        booking,
        transactionId: paymentResult.transactionId
      }
    });
  } catch (error) {
    console.error('Pay visit charge error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while processing payment'
    });
  }
};

// Complete a booking and process final payment
const completeBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    
    // Find booking
    const booking = await Booking.findById(bookingId);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Verify user owns the booking or is admin/provider
    const isOwner = booking.userId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    const isProvider = req.user.role === 'provider' && 
                      booking.providerId.toString() === req.user._id.toString();
    
    if (!isOwner && !isAdmin && !isProvider) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to complete this booking'
      });
    }

    // Verify booking is in confirmed status
    if (booking.status !== 'confirmed') {
      return res.status(400).json({
        success: false,
        message: 'Booking is not in confirmed status'
      });
    }

    // Update booking status
    booking.status = 'completed';
    booking.completedAt = new Date();
    await booking.save();

    res.json({
      success: true,
      message: 'Booking completed successfully',
      data: {
        booking
      }
    });
  } catch (error) {
    console.error('Complete booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while completing booking'
    });
  }
};

// Get user's bookings
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate('providerId', 'businessName categories')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        bookings
      }
    });
  } catch (error) {
    console.error('Get user bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching bookings'
    });
  }
};

module.exports = {
  createBooking,
  payVisitCharge,
  completeBooking,
  getUserBookings
};