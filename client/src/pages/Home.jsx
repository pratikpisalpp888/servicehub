import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); // Added state for search query
  const navigate = useNavigate();

  const fetchLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          setLoading(false);
          
          // Navigate to dashboard with location data
          navigate('/dashboard', { 
            state: { 
              location: { lat: latitude, lng: longitude } 
            } 
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          setLoading(false);
          alert('Unable to retrieve your location. Please try again or enter manually.');
        }
      );
    } else {
      setLoading(false);
      alert('Geolocation is not supported by this browser.');
    }
  };

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to dashboard with search query
      navigate('/dashboard', { 
        state: { 
          searchQuery: searchQuery.trim()
        } 
      });
    }
  };

  // Service categories from the dataset
  const categories = [
    { 
      name: 'Beauty', 
      description: 'Professional beauty and salon services', 
      color: 'from-pink-50 to-pink-100', 
      icon: '💄',
      gradient: 'from-pink-500 to-pink-600',
      border: 'border-pink-200'
    },
    { 
      name: 'Carpenter', 
      description: 'Woodwork and furniture repair services', 
      color: 'from-amber-50 to-amber-100', 
      icon: '🔨',
      gradient: 'from-amber-500 to-amber-600',
      border: 'border-amber-200'
    },
    { 
      name: 'Electrician', 
      description: 'Electrical repairs and installations', 
      color: 'from-yellow-50 to-yellow-100', 
      icon: '⚡',
      gradient: 'from-yellow-500 to-yellow-600',
      border: 'border-yellow-200'
    },
    { 
      name: 'Plumber', 
      description: 'Pipeline and water system services', 
      color: 'from-blue-50 to-blue-100', 
      icon: '🔧',
      gradient: 'from-blue-500 to-blue-600',
      border: 'border-blue-200'
    },
    { 
      name: 'Paint', 
      description: 'Interior and exterior painting services', 
      color: 'from-indigo-50 to-indigo-100', 
      icon: '🎨',
      gradient: 'from-indigo-500 to-indigo-600',
      border: 'border-indigo-200'
    },
    { 
      name: 'Home Cleaning', 
      description: 'Professional cleaning services', 
      color: 'from-green-50 to-green-100', 
      icon: '🧹',
      gradient: 'from-green-500 to-green-600',
      border: 'border-green-200'
    }
  ];

  const handleCategorySelect = (category) => {
    // Navigate to dashboard with selected category
    navigate('/dashboard', { 
      state: { 
        category: category.name
      } 
    });
  };

  return (
    <div className="relative min-h-screen">
      {/* Full screen background image with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto text-center py-12 px-4">
        <div className="mb-16 pt-20">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Welcome to <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">ServiceHub</span>
          </h1>
          <p className="text-xl mb-10 text-gray-200 max-w-3xl mx-auto">
            Discover verified professionals for home services, beauty treatments, repairs, and more in Kharghar.
          </p>
          
          <div className="max-w-2xl mx-auto bg-white bg-opacity-10 backdrop-blur rounded-xl shadow-lg p-1 mb-12">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="What service are you looking for?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-4 px-5 rounded-xl text-lg focus:outline-none shadow-inner bg-white bg-opacity-20 text-white placeholder-gray-200"
                />
                <button 
                  type="submit"
                  className="absolute right-2 top-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-5 rounded-lg font-bold text-lg"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <div className="bg-blue-600 rounded-2xl shadow-lg p-8 mb-16 text-white">
          <h2 className="text-3xl font-bold mb-6">How ServiceHub Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white bg-opacity-20 p-6 rounded-xl">
              <div className="text-4xl mb-4">1</div>
              <h3 className="text-xl font-bold mb-3">Find Services</h3>
              <p>Browse trusted professionals in your area</p>
            </div>
            <div className="bg-white bg-opacity-20 p-6 rounded-xl">
              <div className="text-4xl mb-4">2</div>
              <h3 className="text-xl font-bold mb-3">Book & Pay</h3>
              <p>Schedule appointments and make secure payments</p>
            </div>
            <div className="bg-white bg-opacity-20 p-6 rounded-xl">
              <div className="text-4xl mb-4">3</div>
              <h3 className="text-xl font-bold mb-3">Get Service</h3>
              <p>Enjoy quality service from verified professionals</p>
            </div>
          </div>
          
          <div className="mt-10">
            <button
              onClick={fetchLocation}
              disabled={loading}
              className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-xl text-lg"
            >
              {loading ? 'Fetching Location...' : 'Find Services Near Me'}
            </button>
          </div>
        </div>
        
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-4 text-white">Popular Service Categories</h2>
          <p className="text-lg text-gray-200 mb-8">Choose from our most requested services</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <div 
                key={index}
                onClick={() => handleCategorySelect(category)}
                className={`bg-gradient-to-br ${category.color} p-6 rounded-2xl shadow-md hover:shadow-lg cursor-pointer flex flex-col items-center text-center border ${category.border}`}
              >
                <div className="text-5xl mb-4">{category.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">{category.name}</h3>
                <p className="text-gray-600">{category.description}</p>
                <button 
                  className={`mt-4 bg-gradient-to-r ${category.gradient} text-white py-2 px-4 rounded-lg font-medium`}
                >
                  Explore {category.name}
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-gray-100 rounded-2xl p-8 mb-12">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Why Choose ServiceHub?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="flex items-start p-5 bg-white rounded-xl shadow-sm">
              <div className="text-blue-600 text-3xl mr-4">✓</div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">Verified Professionals</h3>
                <p className="text-gray-600">All service providers are verified and rated by our community</p>
              </div>
            </div>
            <div className="flex items-start p-5 bg-white rounded-xl shadow-sm">
              <div className="text-blue-600 text-3xl mr-4">✓</div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">Secure Payments</h3>
                <p className="text-gray-600">Safe and secure payment options with visit charge protection</p>
              </div>
            </div>
            <div className="flex items-start p-5 bg-white rounded-xl shadow-sm">
              <div className="text-blue-600 text-3xl mr-4">✓</div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">24/7 Support</h3>
                <p className="text-gray-600">Our support team is always ready to assist you</p>
              </div>
            </div>
            <div className="flex items-start p-5 bg-white rounded-xl shadow-sm">
              <div className="text-blue-600 text-3xl mr-4">✓</div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">Satisfaction Guaranteed</h3>
                <p className="text-gray-600">We ensure your complete satisfaction with every service</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center py-8">
          <h3 className="text-2xl font-bold mb-4 text-white">Ready to Get Started?</h3>
          <p className="text-lg text-gray-200 mb-6 max-w-2xl mx-auto">
            Join thousands of satisfied customers who found reliable service providers through ServiceHub.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={fetchLocation}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl text-lg"
            >
              {loading ? 'Fetching Location...' : 'Find Services Now'}
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-xl text-lg"
            >
              Browse All Services
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;