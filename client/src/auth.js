// Authentication helper functions

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

// Get user role
export const getUserRole = () => {
  return localStorage.getItem('userRole');
};

// Get user token
export const getToken = () => {
  return localStorage.getItem('token');
};

// Logout user
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userRole');
};

// Check if user is admin
export const isAdmin = () => {
  return getUserRole() === 'admin';
};

// Check if user is provider
export const isProvider = () => {
  return getUserRole() === 'provider';
};

// Check if user is regular user
export const isRegularUser = () => {
  return getUserRole() === 'user';
};

// Set user data after login/registration
export const setUserData = (token, role) => {
  localStorage.setItem('token', token);
  localStorage.setItem('userRole', role);
};

// Get user data
export const getUserData = () => {
  return {
    token: getToken(),
    role: getUserRole()
  };
};