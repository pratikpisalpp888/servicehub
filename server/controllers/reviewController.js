const Review = require('../models/Review');
const Provider = require('../models/Provider');

// Add a review for a provider
const addReview = async (req, res) => {
  try {
    const { providerId, rating, comment } = req.body;

    // Check if user has already reviewed this provider
    const existingReview = await Review.findOne({
      providerId,
      userId: req.user._id
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this provider'
      });
    }

    // Create new review
    const review = new Review({
      providerId,
      userId: req.user._id,
      rating,
      comment
    });

    await review.save();

    // Update provider's rating and review count
    const provider = await Provider.findById(providerId);
    const reviews = await Review.find({ providerId });
    
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;
    
    provider.rating = averageRating;
    provider.reviewCount = reviews.length;
    
    await provider.save();

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      data: {
        review
      }
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding review'
    });
  }
};

// Get reviews for a provider
const getProviderReviews = async (req, res) => {
  try {
    const { providerId } = req.params;
    
    const reviews = await Review.find({ providerId })
      .populate('userId', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        reviews
      }
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching reviews'
    });
  }
};

module.exports = {
  addReview,
  getProviderReviews
};