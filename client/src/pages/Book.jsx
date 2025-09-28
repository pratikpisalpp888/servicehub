import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { bookingAPI } from '../api';

const Book = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { providerId, category, provider } = location.state || {};
  
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!providerId) {
      navigate('/dashboard');
    }
    
    // Pre-fill address if provider data is available
    if (provider && provider.address) {
      setAddress(provider.address);
    }
    
    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const formattedDate = tomorrow.toISOString().split('T')[0];
    setDate(formattedDate);
    
    // Set default time to 10:00 AM
    setTime('10:00');
  }, [providerId, provider, navigate]);

  const handleBooking = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Combine date and time
      const timeslot = `${date}T${time}:00`;
      
      const bookingData = {
        providerId,
        category,
        timeslot,
        address,
        notes
      };

      const res = await bookingAPI.createBooking(bookingData);
      
      if (res.data.success) {
        // Redirect to bookings page to complete payment
        navigate('/bookings', { 
          state: { 
            message: 'Booking created successfully! Please complete the payment.' 
          } 
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!providerId) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Book Service</h2>
        <p className="text-gray-600">Schedule your service appointment</p>
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 mb-5 rounded">
          <p>{error}</p>
        </div>
      )}
      
      {provider && (
        <div className="mb-6 p-5 bg-blue-50 rounded-lg">
          <div className="flex items-center mb-3">
            <div className="bg-blue-100 p-2 rounded mr-4">
              <span className="text-xl">
                {provider.categories && provider.categories[0] === 'Beauty' && '💄'}
                {provider.categories && provider.categories[0] === 'Carpenter' && '🔨'}
                {provider.categories && provider.categories[0] === 'Electrician' && '⚡'}
                {provider.categories && provider.categories[0] === 'Plumber' && '🔧'}
                {provider.categories && provider.categories[0] === 'Paint' && '🎨'}
                {provider.categories && provider.categories[0] === 'Home Cleaning' && '🧹'}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">{provider.businessName}</h3>
              <p className="text-gray-600">{provider.categories && provider.categories.join(', ')}</p>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-600 text-sm">Visit Charge</p>
              <p className="text-lg font-bold text-green-600">₹{provider.visitCharge}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Rating</p>
              <div className="flex items-center">
                <span className="text-yellow-500 mr-1">★</span>
                <span className="font-bold text-gray-800">
                  {provider.rating > 0 ? provider.rating.toFixed(1) : 'N/A'}
                </span>
                <span className="text-gray-500 text-sm ml-1">
                  ({provider.reviewCount})
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleBooking} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your full name"
            />
          </div>
          
          <div>
            <label htmlFor="address" className="block text-gray-700 font-medium mb-2">
              Service Address
            </label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your address"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="date" className="block text-gray-700 font-medium mb-2">
              Date
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label htmlFor="time" className="block text-gray-700 font-medium mb-2">
              Time
            </label>
            <input
              type="time"
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="notes" className="block text-gray-700 font-medium mb-2">
            Special Instructions (Optional)
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Any special instructions for the service provider..."
          ></textarea>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-bold text-gray-800 mb-2">Booking Summary</h4>
          <div className="flex justify-between mb-1">
            <span className="text-gray-600">Visit Charge</span>
            <span className="font-medium">₹{provider?.visitCharge || 0}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span className="text-gray-600">Service Tax</span>
            <span className="font-medium">₹{Math.round((provider?.visitCharge || 0) * 0.18)}</span>
          </div>
          <div className="flex justify-between border-t border-gray-300 pt-2 mt-2">
            <span className="font-bold text-gray-800">Total Amount</span>
            <span className="font-bold text-green-600">
              ₹{Math.round((provider?.visitCharge || 0) * 1.18)}
            </span>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-md focus:outline-none focus:shadow-outline disabled:opacity-50"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Creating Booking...
            </div>
          ) : (
            'Confirm Booking'
          )}
        </button>
      </form>
      
      <div className="mt-6 text-center">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center mx-auto"
        >
          <span className="mr-2">←</span> Back
        </button>
      </div>
    </div>
  );
};

export default Book;