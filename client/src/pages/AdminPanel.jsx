import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { providerAPI } from '../api';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [pendingProviders, setPendingProviders] = useState([]);
  const [approvedProviders, setApprovedProviders] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      // Fetch pending providers
      const pendingRes = await providerAPI.getPendingProviders();
      setPendingProviders(pendingRes.data.data.providers);
      
      // For now, we'll just set approved providers as empty
      // In a real implementation, you would fetch approved providers separately
      setApprovedProviders([]);
      
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch providers');
      setLoading(false);
    }
  };

  const handleApproveProvider = async (providerId) => {
    try {
      await providerAPI.reviewProviderRequest(providerId, true);
      // Remove the approved provider from the pending list
      setPendingProviders(pendingProviders.filter(provider => provider._id !== providerId));
      alert('Provider approved successfully!');
    } catch (err) {
      alert('Failed to approve provider');
    }
  };

  const handleRejectProvider = async (providerId) => {
    try {
      await providerAPI.reviewProviderRequest(providerId, false);
      // Remove the rejected provider from the pending list
      setPendingProviders(pendingProviders.filter(provider => provider._id !== providerId));
      alert('Provider rejected successfully!');
    } catch (err) {
      alert('Failed to reject provider');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        <p className="mt-4">Loading admin panel...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Admin Panel</h1>
        <p className="text-gray-600">Manage service providers and platform settings</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('pending')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'pending'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Pending Providers ({pendingProviders.length})
          </button>
          <button
            onClick={() => setActiveTab('approved')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'approved'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Approved Providers ({approvedProviders.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'users'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Users Management
          </button>
        </nav>
      </div>

      {/* Pending Providers Tab */}
      {activeTab === 'pending' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Pending Provider Requests</h2>
          </div>
          
          {pendingProviders.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {pendingProviders.map((provider) => (
                <div key={provider._id} className="p-6">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                    <div className="flex-grow">
                      <h3 className="text-lg font-medium text-gray-900">
                        {provider.businessName}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Category: {provider.categories?.join(', ')}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        Address: {provider.address}
                      </p>
                      <p className="mt-2 text-sm text-gray-700">
                        {provider.details}
                      </p>
                      <div className="mt-2 flex items-center">
                        <span className="text-sm text-gray-500 mr-2">Location:</span>
                        <span className="text-sm font-medium">
                          {provider.location?.coordinates?.[1]}, {provider.location?.coordinates?.[0]}
                        </span>
                      </div>
                      <div className="mt-2">
                        <span className="text-sm text-gray-500 mr-2">Visit Charge:</span>
                        <span className="text-sm font-medium text-green-600">₹{provider.visitCharge}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 md:mt-0 flex space-x-3">
                      <button
                        onClick={() => handleApproveProvider(provider._id)}
                        className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejectProvider(provider._id)}
                        className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No pending providers</h3>
              <p className="mt-1 text-gray-500">All provider requests have been reviewed.</p>
            </div>
          )}
        </div>
      )}

      {/* Approved Providers Tab */}
      {activeTab === 'approved' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Approved Providers</h2>
          </div>
          
          {approvedProviders.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {approvedProviders.map((provider) => (
                <div key={provider._id} className="p-6">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {provider.businessName}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Category: {provider.categories?.join(', ')}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        Address: {provider.address}
                      </p>
                    </div>
                    
                    <div className="mt-4 md:mt-0 flex space-x-3">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">
                        Edit
                      </button>
                      <button className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No approved providers</h3>
              <p className="mt-1 text-gray-500">No providers have been approved yet.</p>
            </div>
          )}
        </div>
      )}

      {/* Users Management Tab */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Users Management</h2>
          </div>
          
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">Users Management</h3>
            <p className="mt-1 text-gray-500">User management features will be implemented here.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;