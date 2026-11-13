import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import RecipeDirectory from './pages/RecipeDirectory';
import CookingMode from './pages/CookingMode';
import FlavorMatcher from './pages/FlavorMatcher';
import CookbookStudio from './pages/CookbookStudio';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/recipes" element={<RecipeDirectory />} />
        <Route path="/recipes/:id" element={<CookingMode />} />
        <Route path="/flavor-matcher" element={<FlavorMatcher />} />
        
        <Route element={<PublicRoute user={user} />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        
        <Route element={<ProtectedRoute user={user} />}>
          <Route path="/cookbooks" element={<CookbookStudio />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;


export default App;
