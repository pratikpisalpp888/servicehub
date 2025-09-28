import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { providerAPI } from '../api';

const ProviderRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    businessName: '',
    address: '',
    category: '',
    subCategory: '',
    latitude: '',
    longitude: '',
    details: '',
    visitCharge: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const { businessName, address, category, subCategory, latitude, longitude, details, visitCharge } = formData;

  const categories = [
    'Beauty',
    'Carpenter',
    'Electrician',
    'Plumber',
    'Paint',
    'Home Cleaning'
  ];

  const subCategories = {
    'Beauty': ['Haircut', 'Makeup', 'Spa', 'Nails', 'Facial'],
    'Carpenter': ['Furniture Repair', 'Installation', 'Carpentry Work'],
    'Electrician': ['Wiring', 'Appliance Repair', 'Installation'],
    'Plumber': ['Pipe Repair', 'Installation', 'Drain Cleaning'],
    'Paint': ['Interior Painting', 'Exterior Painting', 'Wallpaper'],
    'Home Cleaning': ['Regular Cleaning', 'Deep Cleaning', 'Move-in/Move-out']
  };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    
    // Clear subCategory when category changes
    if (e.target.name === 'category') {
      setFormData(prev => ({ ...prev, subCategory: '' }));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Validate required fields
      if (!businessName || !address || !category || !latitude || !longitude || !details || !visitCharge) {
        throw new Error('All fields are required');
      }

      // Validate latitude and longitude
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);
      if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        throw new Error('Invalid latitude or longitude');
      }

      // Validate visit charge
      const charge = parseFloat(visitCharge);
      if (isNaN(charge) || charge <= 0) {
        throw new Error('Visit charge must be a positive number');
      }

      const providerData = {
        businessName,
        address,
        categories: [category],
        subCategories: subCategory ? [subCategory] : [],
        latitude: lat,
        longitude: lng,
        details,
        visitCharge: charge
      };

      const res = await providerAPI.requestProvider(providerData);
      
      if (res.data.success) {
        setSuccess(true);
        // Reset form
        setFormData({
          businessName: '',
          address: '',
          category: '',
          subCategory: '',
          latitude: '',
          longitude: '',
          details: '',
          visitCharge: ''
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Service Provider Registration</h1>
        <p className="text-gray-600">Register your business to start providing services</p>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          <p>Registration request submitted successfully! Our team will review your request and approve it shortly.</p>
          <p className="mt-2">You will be notified via email once your profile is approved.</p>
        </div>
      )}
      
      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <label htmlFor="businessName" className="block text-gray-700 font-medium mb-2">
            Business Name *
          </label>
          <input
            type="text"
            id="businessName"
            name="businessName"
            value={businessName}
            onChange={onChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your business name"
          />
        </div>
        
        <div>
          <label htmlFor="address" className="block text-gray-700 font-medium mb-2">
            Business Address *
          </label>
          <textarea
            id="address"
            name="address"
            value={address}
            onChange={onChange}
            required
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your full business address"
          ></textarea>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="category" className="block text-gray-700 font-medium mb-2">
              Service Category *
            </label>
            <select
              id="category"
              name="category"
              value={category}
              onChange={onChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="subCategory" className="block text-gray-700 font-medium mb-2">
              Sub Category
            </label>
            <select
              id="subCategory"
              name="subCategory"
              value={subCategory}
              onChange={onChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!category}
            >
              <option value="">Select a sub category</option>
              {category && subCategories[category] && subCategories[category].map((subCat) => (
                <option key={subCat} value={subCat}>{subCat}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="latitude" className="block text-gray-700 font-medium mb-2">
              Latitude *
            </label>
            <input
              type="number"
              id="latitude"
              name="latitude"
              value={latitude}
              onChange={onChange}
              required
              step="any"
              min="-90"
              max="90"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 19.044081"
            />
          </div>
          
          <div>
            <label htmlFor="longitude" className="block text-gray-700 font-medium mb-2">
              Longitude *
            </label>
            <input
              type="number"
              id="longitude"
              name="longitude"
              value={longitude}
              onChange={onChange}
              required
              step="any"
              min="-180"
              max="180"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 73.065642"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="details" className="block text-gray-700 font-medium mb-2">
            Business Description & Specialties *
          </label>
          <textarea
            id="details"
            name="details"
            value={details}
            onChange={onChange}
            required
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe your business, services, and specialties. This will be visible to customers."
          ></textarea>
        </div>
        
        <div>
          <label htmlFor="visitCharge" className="block text-gray-700 font-medium mb-2">
            Visit Charge (₹) *
          </label>
          <input
            type="number"
            id="visitCharge"
            name="visitCharge"
            value={visitCharge}
            onChange={onChange}
            required
            min="0"
            step="any"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your visit charge"
          />
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-bold text-gray-800 mb-2">Important Information</h3>
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            <li>Your registration request will be reviewed by our admin team</li>
            <li>Once approved, your profile will be visible to customers</li>
            <li>Make sure all information provided is accurate</li>
            <li>You will receive an email notification once approved</li>
          </ul>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md focus:outline-none focus:shadow-outline disabled:opacity-50"
        >
          {loading ? 'Submitting Request...' : 'Submit Registration Request'}
        </button>
      </form>
      
      <div className="mt-6 text-center">
        <button
          onClick={() => navigate('/provider-dashboard')}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default ProviderRegistration;