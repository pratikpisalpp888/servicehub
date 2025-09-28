import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated, getUserRole } from '../auth';
import UserDashboard from './dashboards/UserDashboard';
import ProviderDashboard from './dashboards/ProviderDashboard';
import AdminDashboard from './dashboards/AdminDashboard';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    // Get user role
    const role = getUserRole();
    setUserRole(role);
    setLoading(false);
  }, [navigate]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        <p className="mt-4">Loading dashboard...</p>
      </div>
    );
  }

  // Render appropriate dashboard based on user role
  switch (userRole) {
    case 'user':
      return <UserDashboard />;
    case 'provider':
      return <ProviderDashboard />;
    case 'admin':
      return <AdminDashboard />;
    default:
      // If role is not recognized, redirect to login
      navigate('/login');
      return null;
  }
};

export default Dashboard;