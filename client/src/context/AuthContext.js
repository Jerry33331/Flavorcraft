import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get('/api/auth/me', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setUser(response.data.user);
        }
      } catch (err) {
        console.error('Auth check failed:', err.message);
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const register = async (username, email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post('/api/auth/register', {
        username,
        email,
        password
      });

      const { user, token } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
      
      toast.success('Registration successful! Welcome to FlavorCraft.');
      return { success: true, user };
    } catch (err) {
      const message = err.response?.data?.error?.message || 'Registration failed';
      setError(message);
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post('/api/auth/login', {
        email,
        password
      });

      const { user, token } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
      
      toast.success('Login successful! Welcome back.');
      return { success: true, user };
    } catch (err) {
      const message = err.response?.data?.error?.message || 'Login failed';
      setError(message);
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out successfully');
  };

  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const isAuthenticated = () => {
    return user !== null;
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      error,
      register,
      login,
      logout,
      getAuthHeader,
      isAuthenticated,
      setUser,
      setError
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
