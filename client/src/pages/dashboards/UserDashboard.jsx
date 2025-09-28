import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { providerAPI } from '../../api';
import ProviderMap from '../../components/ProviderMap';

const UserDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Set default location to Kharghar
  const [locationData, setLocationData] = useState(location.state?.location || { lat: 19.044081, lng: 73.065642 });
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(location.state?.category || '');
  const [searchQuery, setSearchQuery] = useState(location.state?.searchQuery || '');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
  const [showAllProviders, setShowAllProviders] = useState(false);

  // Categories for the service selection
  const categories = [
    'Beauty', 
    'Carpenter', 
    'Electrician', 
    'Plumber', 
    'Paint', 
    'Home Cleaning'
  ];

  useEffect(() => {
    // Fetch providers when component mounts or when category/search changes
    if (selectedCategory || searchQuery || showAllProviders) {
      fetchNearbyProviders();
    } else {
      // Fetch all providers if no category is selected
      fetchNearbyProviders();
    }
  }, [selectedCategory, searchQuery, showAllProviders]);

  useEffect(() => {
    // If category was passed from home page, select it
    if (location.state?.category) {
      setSelectedCategory(location.state.category);
    }
    
    // If search query was passed from home page, set it
    if (location.state?.searchQuery) {
      setSearchQuery(location.state.searchQuery);
    }
    
    // If location was passed from home page, use it
    if (location.state?.location) {
      setLocationData(location.state.location);
    }
  }, [location.state]);

  const fetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocationData({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to retrieve your location. Please try again.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const fetchNearbyProviders = async () => {
    setLoading(true);
    try {
      const params = {
        lat: locationData.lat,
        lng: locationData.lng
      };
      
      if (selectedCategory) {
        params.category = selectedCategory;
      }
      
      if (searchQuery) {
        params.search = searchQuery;
      }
      
      const res = await providerAPI.getNearbyProviders(params);
      setProviders(res.data.data.providers);
    } catch (err) {
      console.error('Error fetching providers:', err);
      alert('Failed to fetch nearby providers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSearchQuery(''); // Clear search query when selecting a category
    setShowAllProviders(false); // Reset show all providers flag
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSelectedCategory(''); // Clear category when searching
    setShowAllProviders(false); // Reset show all providers flag
    fetchNearbyProviders();
  };

  const handleBookProvider = (providerId) => {
    // Navigate to booking page with provider info
    navigate('/book', { state: { providerId, category: selectedCategory } });
  };

  const handleViewMap = (provider) => {
    // Open Google Maps with the provider's location
    const googleMapsUrl = `https://www.google.com/maps?q=${provider.location.coordinates[1]},${provider.location.coordinates[0]}`;
    window.open(googleMapsUrl, '_blank');
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

  const handleViewAllProviders = () => {
    setShowAllProviders(true);
    setSelectedCategory('');
    setSearchQuery('');
    fetchNearbyProviders();
  };

  // Function to generate static map image URL with markers for all providers
  const generateStaticMapUrl = () => {
    if (providers.length === 0) return '';
    
    // For demonstration purposes, we'll use a placeholder map image
    // In a real application, you would use the Google Static Maps API with a valid API key
    return 'https://via.placeholder.com/600x400/4A90E2/ffffff?text=Map+View+with+Provider+Locations';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
          Find Local Services in Kharghar
        </h1>
        <p className="text-gray-600">Discover trusted professionals in your area</p>
      </div>
      
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h2 className="text-xl font-bold text-gray-800">Select a Service Category</h2>
        </div>
        
        {/* Search bar */}
        <div className="mb-6">
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-3 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button 
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white py-1 px-4 rounded-md font-medium"
              >
                Search
              </button>
            </div>
          </form>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategorySelect(category)}
              className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-500 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              <span className="text-lg block mb-1">
                {category === 'Beauty' && '💄'}
                {category === 'Carpenter' && '🔨'}
                {category === 'Electrician' && '⚡'}
                {category === 'Plumber' && '🔧'}
                {category === 'Paint' && '🎨'}
                {category === 'Home Cleaning' && '🧹'}
              </span>
              <span className="text-xs font-medium">{category}</span>
            </button>
          ))}
        </div>
      </div>
      
      {(selectedCategory || showAllProviders) && (
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {selectedCategory ? selectedCategory : 'All'} Providers in Kharghar
              </h2>
              <p className="text-gray-600">
                {providers.length} {providers.length === 1 ? 'provider' : 'providers'} found
              </p>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  viewMode === 'list' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                List View
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  viewMode === 'map' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Map View
              </button>
              <button
                onClick={fetchNearbyProviders}
                disabled={loading}
                className="px-3 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md text-sm font-medium disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Refresh'}
              </button>
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600">Finding providers near you...</p>
            </div>
          ) : providers.length > 0 ? (
            viewMode === 'list' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {providers.map((provider) => (
                  <div 
                    key={provider.id} 
                    className="border rounded-xl p-5 hover:shadow-md transition-shadow bg-white flex flex-col h-full border-gray-200"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-gray-800">{provider.businessName}</h3>
                        <p className="text-gray-600 text-sm mt-1">{provider.address}</p>
                      </div>
                      <div className="flex items-center bg-yellow-50 px-2 py-1 rounded">
                        <span className="text-yellow-500 text-sm mr-1">★</span>
                        <span className="font-medium text-gray-800 text-sm">
                          {provider.rating > 0 ? provider.rating.toFixed(1) : 'N/A'}
                        </span>
                        <span className="text-gray-500 text-xs ml-1">
                          ({provider.reviewCount})
                        </span>
                      </div>
                    </div>
                    
                    <div className="mb-4 flex-grow">
                      <div className="flex flex-wrap gap-1 mb-3">
                        {provider.categories.map((category, index) => (
                          <span 
                            key={index} 
                            className="bg-blue-50 text-blue-800 text-xs font-medium px-2 py-1 rounded-full"
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                      
                      <p className="text-gray-700 text-sm mb-4">{provider.details}</p>
                      
                      <div className="flex justify-between items-center mb-4">
                        {/* Removed distance information as requested */}
                        <div className="bg-green-50 p-2 rounded">
                          <p className="text-gray-600 text-xs">Visit Charge</p>
                          <p className="font-medium text-green-600 text-sm">₹{provider.visitCharge}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-auto">
                      <button
                        onClick={() => navigate('/provider-details', { state: { provider } })}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-3 rounded-md text-sm"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleViewMap(provider)}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-3 rounded-md text-sm"
                      >
                        Directions
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-xl p-5">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-800">Map View</h3>
                  <button
                    onClick={() => setViewMode('list')}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md"
                  >
                    Switch to List View
                  </button>
                </div>
                <div className="bg-white rounded-xl shadow p-3">
                  <div className="h-[400px] w-full rounded-lg overflow-hidden mb-5">
                    {/* Interactive Google Map with provider markers */}
                    <ProviderMap providers={providers} />
                  </div>
                  
                  {/* List of providers below the map */}
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                    {providers.map((provider) => (
                      <div 
                        key={provider.id} 
                        className="border rounded-lg p-3 hover:bg-gray-50 transition-colors border-gray-200"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-gray-800">{provider.businessName}</h4>
                            <p className="text-gray-600 text-sm">{provider.address}</p>
                          </div>
                          <div className="flex items-center bg-yellow-50 px-2 py-1 rounded">
                            <span className="text-yellow-500 text-sm mr-1">★</span>
                            <span className="font-medium text-gray-800 text-sm">
                              {provider.rating > 0 ? provider.rating.toFixed(1) : 'N/A'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex flex-wrap gap-1">
                            {provider.categories.slice(0, 2).map((category, index) => (
                              <span 
                                key={index} 
                                className="bg-blue-50 text-blue-800 text-xs font-medium px-2 py-1 rounded-full"
                              >
                                {category}
                              </span>
                            ))}
                            {provider.categories.length > 2 && (
                              <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
                                +{provider.categories.length - 2}
                              </span>
                            )}
                          </div>
                          <div className="bg-green-50 p-1 rounded">
                            <p className="font-medium text-green-600 text-sm">₹{provider.visitCharge}</p>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => navigate('/provider-details', { state: { provider } })}
                            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-1 px-2 rounded text-sm"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => handleViewMap(provider)}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-1 px-2 rounded text-sm"
                          >
                            Directions
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No providers found. Try a different category or search term.</p>
            </div>
          )}
        </div>
      )}
      
      <div className="text-center mt-8">
        <button
          onClick={handleViewAllProviders}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg"
        >
          View All Providers
        </button>
      </div>
    </div>
  );
};

export default UserDashboard;