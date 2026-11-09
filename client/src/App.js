import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import RecipeDirectory from './pages/RecipeDirectory';
import CookingMode from './pages/CookingMode';
import FlavorMatcher from './pages/FlavorMatcher';
import CookbookStudio from './pages/CookbookStudio';
import Layout from './components/Layout';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/recipes" element={<RecipeDirectory />} />
        <Route path="/recipes/:id" element={<CookingMode />} />
        <Route path="/flavor-matcher" element={<FlavorMatcher />} />
        <Route path="/cookbooks" element={<CookbookStudio />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
