const Provider = require('../models/Provider');
const User = require('../models/User');
const { calculateDistance, formatDistance } = require('../utils/geospatial');

// Request to become a provider
const requestProvider = async (req, res) => {
  try {
    const { businessName, categories, address, latitude, longitude, visitCharge, details } = req.body;

    // Validate required fields
    if (!businessName || !categories || !address || latitude === undefined || longitude === undefined || visitCharge === undefined || !details) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Validate latitude and longitude
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return res.status(400).json({
        success: false,
        message: 'Invalid latitude or longitude'
      });
    }

    // Validate visit charge
    const charge = parseFloat(visitCharge);
    if (isNaN(charge) || charge <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Visit charge must be a positive number'
      });
    }

    // Create provider request (not approved yet)
    const provider = new Provider({
      userId: req.user._id,
      businessName,
      categories,
      address,
      location: {
        type: 'Point',
        coordinates: [lng, lat] // GeoJSON format: [longitude, latitude]
      },
      approved: false,
      visitCharge: charge,
      details
    });

    await provider.save();

    // Update user role to provider
    await User.findByIdAndUpdate(req.user._id, { role: 'provider' });

    res.status(201).json({
      success: true,
      message: 'Provider request submitted successfully. Awaiting admin approval.',
      data: {
        provider
      }
    });
  } catch (error) {
    console.error('Provider request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while submitting provider request'
    });
  }
};

// Get nearby providers
const getNearbyProviders = async (req, res) => {
  try {
    const { lat, lng, category, radiusMeters = 10000, search } = req.query;

    // Validate coordinates
    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    // Build query
    const query = {
      approved: true,
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          $maxDistance: parseInt(radiusMeters)
        }
      }
    };

    // Filter by category if provided
    if (category) {
      query.categories = { $in: [category] };
    }

    // Filter by search query if provided
    if (search) {
      query.$or = [
        { businessName: { $regex: search, $options: 'i' } },
        { categories: { $in: [new RegExp(search, 'i')] } },
        { details: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } }
      ];
    }

    // Find nearby providers
    const providers = await Provider.find(query).populate('userId', 'name');

    // Calculate distances and format response
    const providersWithDistance = providers.map(provider => {
      const distanceKm = calculateDistance(
        latitude,
        longitude,
        provider.location.coordinates[1],
        provider.location.coordinates[0]
      );

      return {
        id: provider._id,
        userId: provider.userId,
        businessName: provider.businessName,
        categories: provider.categories,
        address: provider.address,
        distance: formatDistance(distanceKm),
        visitCharge: provider.visitCharge,
        details: provider.details,
        rating: provider.rating,
        reviewCount: provider.reviewCount,
        location: provider.location // Include location data for map display
      };
    });

    res.json({
      success: true,
      data: {
        providers: providersWithDistance
      }
    });
  } catch (error) {
    console.error('Get nearby providers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching nearby providers'
    });
  }
};

// Get all pending provider requests (admin only)
const getPendingProviders = async (req, res) => {
  try {
    const providers = await Provider.find({ approved: false }).populate('userId', 'name email phone');

    // Format providers to include rating information
    const formattedProviders = providers.map(provider => ({
      ...provider.toObject(),
      rating: provider.rating,
      reviewCount: provider.reviewCount
    }));

    res.json({
      success: true,
      data: {
        providers: formattedProviders
      }
    });
  } catch (error) {
    console.error('Get pending providers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching pending providers'
    });
  }
};

// Approve or reject a provider request (admin only)
const reviewProviderRequest = async (req, res) => {
  try {
    const { providerId } = req.params;
    const { approved } = req.body;

    // Find provider request
    const provider = await Provider.findById(providerId);
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Provider request not found'
      });
    }

    // Update approval status
    provider.approved = approved;
    await provider.save();

    // If approved, ensure user has provider role
    if (approved) {
      await User.findByIdAndUpdate(provider.userId, { role: 'provider' });
    }

    res.json({
      success: true,
      message: `Provider ${approved ? 'approved' : 'rejected'} successfully`,
      data: {
        provider
      }
    });
  } catch (error) {
    console.error('Review provider request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while reviewing provider request'
    });
  }
};

module.exports = {
  requestProvider,
  getNearbyProviders,
  getPendingProviders,
  reviewProviderRequest
};