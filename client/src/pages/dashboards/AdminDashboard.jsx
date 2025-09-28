import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { providerAPI } from '../../api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [pendingProviders, setPendingProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPendingProviders();
  }, []);

  const fetchPendingProviders = async () => {
    try {
      const res = await providerAPI.getPendingProviders();
      setPendingProviders(res.data.data.providers);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch pending providers');
      setLoading(false);
    }
  };

  const handleApproveProvider = async (providerId) => {
    try {
      await providerAPI.reviewProviderRequest(providerId, true);
      // Remove the approved provider from the list
      setPendingProviders(pendingProviders.filter(provider => provider._id !== providerId));
    } catch (err) {
      alert('Failed to approve provider');
    }
  };

  const handleRejectProvider = async (providerId) => {
    try {
      await providerAPI.reviewProviderRequest(providerId, false);
      // Remove the rejected provider from the list
      setPendingProviders(pendingProviders.filter(provider => provider._id !== providerId));
    } catch (err) {
      alert('Failed to reject provider');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        <p className="mt-4">Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-600">Manage service providers and platform settings</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 mr-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <div>
              <p className="text-gray-500">Pending Providers</p>
              <p className="text-2xl font-bold">{pendingProviders.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 mr-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <div>
              <p className="text-gray-500">Approved Providers</p>
              <p className="text-2xl font-bold">0</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 mr-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <p className="text-gray-500">Total Users</p>
              <p className="text-2xl font-bold">0</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Pending Provider Requests</h2>
        </div>
        
        {pendingProviders.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {pendingProviders.map((provider) => (
              <div key={provider._id} className="p-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {provider.businessName}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {provider.categories?.join(', ')}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {provider.address}
                    </p>
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
    </div>
  );
};

export default AdminDashboard;