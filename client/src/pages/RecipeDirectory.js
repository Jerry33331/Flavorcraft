import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search, Filter, Clock, Star, Heart, Grid3X3, List, X } from 'lucide-react';

export default function RecipeDirectory() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', cuisine: '', difficulty: '' });
  const [viewMode, setViewMode] = useState('grid');

  const cuisines = ['Italian', 'French', 'Thai', 'Mexican', 'Japanese', 'Indian', 'Spanish', 'Chinese'];
  const difficulties = ['Easy', 'Medium', 'Hard'];

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([k, v]) => v && params.append(k, v));
        const res = await axios.get(`/api/recipes?${params.toString()}`);
        setRecipes(res.data.recipes || []);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, [filters]);

  const formatTime = (mins) => mins < 60 ? `${mins} min` : `${Math.floor(mins/60)}h ${mins%60}m`;
  const truncate = (str, len = 40) => str.length > len ? str.substring(0, len) + '...' : str;
  const getDifficultyColor = (d) => d === 'Easy' ? 'text-green-600' : d === 'Medium' ? 'text-yellow-600' : 'text-red-600';

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Global Recipe Directory</h1>
        <p className="text-gray-600 dark:text-gray-400">Discover authentic recipes from around the world</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search recipes..."
          value={filters.search}
          onChange={(e) => setFilters({...filters, search: e.target.value})}
          className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white"
        />
        {filters.search && (
          <button onClick={() => setFilters({...filters, search: ''})} className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <select
          value={filters.cuisine}
          onChange={(e) => setFilters({...filters, cuisine: e.target.value})}
          className="px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
        >
          <option value="">All Cuisines</option>
          {cuisines.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          value={filters.difficulty}
          onChange={(e) => setFilters({...filters, difficulty: e.target.value})}
          className="px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
        >
          <option value="">All Difficulties</option>
          {difficulties.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <div className="flex gap-2 ml-auto">
          <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-amber-100 text-amber-600' : 'text-gray-400'}`}>
            <Grid3X3 className="w-5 h-5" />
          </button>
          <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-amber-100 text-amber-600' : 'text-gray-400'}`}>
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Recipes */}
      <p className="text-sm text-gray-600 dark:text-gray-400">Showing {recipes.length} recipes</p>
      
      {recipes.length > 0 ? (
        <div className={`gap-4 ${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'space-y-4'}`}>
          {recipes.map((recipe, i) => viewMode === 'grid' ? (
            <Link key={i} to={`/recipes/${recipe.id}`} className="block p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
              <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">{truncate(recipe.title)}</h3>
              <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400 mt-2">
                <span>🏷️ {recipe.cuisine}</span>
                <span><Clock className="inline w-4 h-4 mr-1" />{formatTime(recipe.prep_time_mins)}</span>
              </div>
              <div className="flex items-center mt-2">
                <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(recipe.difficulty)} bg-opacity-20`}>{recipe.difficulty}</span>
                <span className="ml-2 flex items-center"><Star className="w-4 h-4 text-yellow-500" />{recipe.average_rating}</span>
              </div>
            </Link>
          ) : (
            <Link key={i} to={`/recipes/${recipe.id}`} className="block p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
              <div className="flex gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{recipe.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{recipe.description}</p>
                  <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400 mt-2">
                    <span>🏷️ {recipe.cuisine}</span>
                    <span><Clock className="inline w-4 h-4 mr-1" />{formatTime(recipe.prep_time_mins)}</span>
                    <span className={`px-2 py-1 rounded-full ${getDifficultyColor(recipe.difficulty)} bg-opacity-20`}>{recipe.difficulty}</span>
                    <span className="flex items-center"><Star className="w-4 h-4 text-yellow-500 mr-1" />{recipe.average_rating}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          No recipes found. Try adjusting your filters.
        </div>
      )}
    </div>
  );
}
