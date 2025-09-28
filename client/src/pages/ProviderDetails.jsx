import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { providerAPI, reviewAPI } from '../api';

const ProviderDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { provider } = location.state || {};
  
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [showReviewForm, setShowReviewForm] = useState(false);
  
  useEffect(() => {
    if (provider) {
      fetchProviderReviews();
    }
  }, [provider]);
  
  const fetchProviderReviews = async () => {
    if (!provider) return;
    
    setLoading(true);
    try {
      const res = await reviewAPI.getProviderReviews(provider.id);
      setReviews(res.data.data.reviews);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!provider) return;
    
    setReviewLoading(true);
    try {
      const res = await reviewAPI.addReview({
        providerId: provider.id,
        rating: newReview.rating,
        comment: newReview.comment
      });
      
      if (res.data.success) {
        // Refresh reviews
        fetchProviderReviews();
        // Reset form
        setNewReview({ rating: 5, comment: '' });
        setShowReviewForm(false);
        // Show success message
        alert('Review added successfully!');
      }
    } catch (err) {
      console.error('Error adding review:', err);
      alert('Failed to add review. Please try again.');
    } finally {
      setReviewLoading(false);
    }
  };
  
  const handleViewMap = () => {
    // Open Google Maps with the provider's location
    const googleMapsUrl = `https://www.google.com/maps?q=${provider.location.coordinates[1]},${provider.location.coordinates[0]}`;
    window.open(googleMapsUrl, '_blank');
  };
  
  const handleBookProvider = () => {
    // Navigate to booking page with provider info
    navigate('/book', { state: { providerId: provider.id, category: provider.categories[0], provider } });
  };
  
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? 'text-yellow-400' : 'text-gray-300'}>
          ★
        </span>
      );
    }
    return stars;
  };
  
  if (!provider) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Provider Not Found</h2>
          <p className="text-gray-600 mb-6">The provider information is not available.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-5">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
        >
          <span className="mr-2">←</span> Back
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
        {/* Provider Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="flex items-start mb-4 md:mb-0">
              <div className="bg-blue-100 p-3 rounded-lg mr-5">
                <span className="text-2xl">
                  {provider.categories && provider.categories[0] === 'Beauty' && '💄'}
                  {provider.categories && provider.categories[0] === 'Carpenter' && '🔨'}
                  {provider.categories && provider.categories[0] === 'Electrician' && '⚡'}
                  {provider.categories && provider.categories[0] === 'Plumber' && '🔧'}
                  {provider.categories && provider.categories[0] === 'Paint' && '🎨'}
                  {provider.categories && provider.categories[0] === 'Home Cleaning' && '🧹'}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-1">{provider.businessName}</h1>
                <p className="text-gray-600 mb-2">{provider.address}</p>
                <div className="flex flex-wrap gap-1">
                  {provider.categories.map((category, index) => (
                    <span 
                      key={index} 
                      className="bg-blue-50 text-blue-800 text-sm font-medium px-2 py-1 rounded-full"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-end">
              <div className="flex items-center bg-yellow-50 px-3 py-1 rounded mb-3">
                <span className="text-yellow-500 mr-1">★</span>
                <div>
                  <span className="font-bold text-gray-800">
                    {provider.rating > 0 ? provider.rating.toFixed(1) : 'N/A'}
                  </span>
                  <span className="text-gray-500 ml-1 text-sm">
                    ({provider.reviewCount} {provider.reviewCount === 1 ? 'review' : 'reviews'})
                  </span>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-gray-600 text-sm">Visit Charge</p>
                <p className="text-2xl font-bold text-green-600">₹{provider.visitCharge}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          {/* Key Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-1">Distance</p>
                  <p className="font-bold text-gray-800">{provider.distance} km</p>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <div className="flex items-center">
                <div className="bg-green-100 p-2 rounded mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-1">Response Time</p>
                  <p className="font-bold text-gray-800">Within 2 hours</p>
                </div>
              </div>
            </div>
            
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
              <div className="flex items-center">
                <div className="bg-amber-100 p-2 rounded mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-1">Verified</p>
                  <p className="font-bold text-gray-800">Professional</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Directions Button */}
          <div className="mb-6">
            <button
              onClick={handleViewMap}
              className="flex items-center justify-center w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Get Directions to {provider.businessName}
            </button>
          </div>
          
          {/* About Section */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-3">About</h2>
            <p className="text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-200">
              {provider.details || 'No description available for this service provider.'}
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleBookProvider}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-md"
            >
              Book Service
            </button>
            <button
              onClick={handleViewMap}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded-md"
            >
              View on Map
            </button>
          </div>
        </div>
      </div>
      
      {/* Reviews Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-5">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Customer Reviews</h2>
            <p className="text-gray-600">
              {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'} for {provider.businessName}
            </p>
          </div>
          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md"
          >
            {showReviewForm ? 'Cancel' : 'Write a Review'}
          </button>
        </div>
        
        {showReviewForm && (
          <form onSubmit={handleAddReview} className="bg-blue-50 p-5 rounded-lg mb-6 border border-blue-100">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Share your experience</h3>
            
            <div className="mb-3">
              <label className="block text-gray-700 font-medium mb-2">Rating</label>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                    className="text-2xl focus:outline-none mr-1"
                  >
                    <span className={star <= newReview.rating ? 'text-yellow-400' : 'text-gray-300'}>
                      ★
                    </span>
                  </button>
                ))}
                <span className="ml-2 text-gray-700 font-medium">{newReview.rating} star{newReview.rating !== 1 ? 's' : ''}</span>
              </div>
            </div>
            
            <div className="mb-3">
              <label htmlFor="comment" className="block text-gray-700 font-medium mb-2">
                Your Review
              </label>
              <textarea
                id="comment"
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Share details of your experience with this service provider..."
              ></textarea>
            </div>
            
            <button
              type="submit"
              disabled={reviewLoading}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md disabled:opacity-50"
            >
              {reviewLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </div>
              ) : (
                'Submit Review'
              )}
            </button>
          </form>
        )}
        
        {loading ? (
          <div className="text-center py-6">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-600 mb-3"></div>
            <p className="text-gray-600">Loading reviews...</p>
          </div>
        ) : reviews.length > 0 ? (
          <div className="space-y-5">
            {reviews.map((review) => (
              <div 
                key={review._id} 
                className="border-b border-gray-200 pb-5 last:border-0 last:pb-0"
              >
                <div className="flex justify-between mb-2">
                  <h4 className="font-bold text-gray-800">{review.userId?.name || 'Anonymous'}</h4>
                  <div className="flex">
                    {renderStars(review.rating)}
                  </div>
                </div>
                <p className="text-gray-700 mb-2">{review.comment}</p>
                <p className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">💬</div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">No Reviews Yet</h3>
            <p className="text-gray-600 mb-5">Be the first to share your experience with this provider.</p>
            <button
              onClick={() => setShowReviewForm(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-5 rounded-md"
            >
              Write a Review
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderDetails;