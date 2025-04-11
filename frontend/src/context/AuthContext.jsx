import { createContext, useState, useContext, useEffect } from 'react';

// Create the auth context
const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on page load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }
    setLoading(false);
  }, []);

  // Login function
  const login = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('user');
  };

  // Context value
  const value = {
    user,
    isLoggedIn,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
}; 