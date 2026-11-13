import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, ChefHat, ArrowLeft, Settings, LogOut } from 'lucide-react';

const Profile = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || ''
  });

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData({
      username: user?.username || '',
      email: user?.email || ''
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Not Logged In</h2>
          <Link
            to="/login"
            className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-amber-500 to-blue-600 p-6 text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">{user.username}</h1>
            <p className="text-white/80 mt-1">{user.email}</p>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <User className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                <span className="text-gray-900 dark:text-white">{user.username}</span>
              </div>
              
              <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <Mail className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                <span className="text-gray-900 dark:text-white">{user.email}</span>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <ChefHat className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                <span className="text-gray-900 dark:text-white">Member since {new Date(user.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-4">
              <button
                onClick={handleEdit}
                className="w-full flex items-center justify-center space-x-2 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl transition-colors"
              >
                <Settings className="w-5 h-5" />
                <span>Edit Profile</span>
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
