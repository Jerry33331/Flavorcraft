import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, Clock, Star, Heart, Dice, TrendingUp, Globe, BookOpen } from 'lucide-react';
import axios from 'axios';

export default function Dashboard() {
  const [featuredRecipes, setFeaturedRecipes] = useState([]);
  const [randomRecipe, setRandomRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featuredRes, randomRes] = await Promise.all([
          axios.get('/api/recipes/featured?limit=6'),
          axios.get('/api/recipes/random')
        ]);
        setFeaturedRecipes(featuredRes.data.recipes || []);
        setRandomRecipe(randomRes.data.recipe);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRoulette = async () => {
    try {
      const res = await axios.get('/api/recipes/random');
      setRandomRecipe(res.data.recipe);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const cuisineCategories = [
    { name: 'Italian', icon: '🍕', color: 'from-red-500 to-orange-500' },
    { name: 'French', icon: '🥖', color: 'from-blue-500 to-purple-500' },
    { name: 'Thai', icon: '🌶️', color: 'from-green-500 to-yellow-500' },
    { name: 'Mexican', icon: '🌮', color: 'from-yellow-500 to-red-500' },
    { name: 'Japanese', icon: '🍣', color: 'from-pink-500 to-red-500' },
    { name: 'Indian', icon: '🍛', color: 'from-orange-500 to-yellow-500' },
    { name: 'Spanish', icon: '🥘', color: 'from-yellow-500 to-orange-500' },
    { name: 'Chinese', icon: '🥟', color: 'from-red-500 to-pink-500' },
  ];

  const stats = [
    { label: 'Total Recipes', value: '500+', icon: <BookOpen className="w-6 h-6" /> },
    { label: 'Cuisines', value: '20+', icon: <Globe className="w-6 h-6" /> },
    { label: 'Difficulty Levels', value: '3', icon: <TrendingUp className="w-6 h-6" /> },
    { label: 'Seed Recipes', value: '8', icon: <Star className="w-6 h-6" /> },
  ];

  const formatTime = (mins) => mins < 60 ? `${mins} min` : `${Math.floor(mins/60)}h ${mins%60}m`;
  const truncate = (str, len = 30) => str.length > len ? str.substring(0, len) + '...' : str;

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="bg-gradient-to-br from-amber-500 to-blue-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-4">Welcome to FlavorCraft</h1>
        <p className="text-xl mb-6">Discover authentic global recipes, explore flavor pairings, and create your personal cookbook collection.</p>
        <div className="flex gap-4">
          <Link to="/recipes" className="px-6 py-3 bg-white text-amber-600 font-semibold rounded-lg hover:bg-gray-100">
            <ChefHat className="inline w-5 h-5 mr-2" /> Explore Recipes
          </Link>
          <Link to="/cookbooks" className="px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10">
            <BookOpen className="inline w-5 h-5 mr-2" /> My Cookbooks
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 text-center">
            <div className="text-2xl mb-2 text-amber-600">{stat.icon}</div>
            <div className="text-xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Recipe Roulette */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white"><Dice className="inline w-6 h-6 mr-2 text-amber-500" />Recipe Roulette</h2>
          <button onClick={handleRoulette} className="px-4 py-2 bg-amber-500 text-white font-medium rounded-lg hover:bg-amber-600">
            <Dice className="inline w-4 h-4 mr-2" /> Spin
          </button>
        </div>
        {randomRecipe && (
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{randomRecipe.title}</h3>
              <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400 mt-2">
                <span>🏷️ {randomRecipe.cuisine}</span>
                <span><Clock className="inline w-4 h-4 mr-1" />{formatTime(randomRecipe.prep_time_mins)}</span>
                <span><Star className="inline w-4 h-4 mr-1 text-yellow-500" />{randomRecipe.average_rating}</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">{randomRecipe.description}</p>
            </div>
            <Link to={`/recipes/${randomRecipe.id}`} className="px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600">
              View Recipe
            </Link>
          </div>
        )}
      </div>

      {/* Categories */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4"><Globe className="inline w-6 h-6 mr-2 text-amber-500" />Explore by Cuisine</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
          {cuisineCategories.map((cat, i) => (
            <Link key={i} to={`/recipes?cuisine=${cat.name}`} className={`flex flex-col items-center p-3 rounded-xl bg-gradient-to-br ${cat.color} hover:opacity-90 text-white`}>
              <span className="text-2xl">{cat.icon}</span>
              <span className="text-xs font-medium mt-1">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Recipes */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4"><TrendingUp className="inline w-6 h-6 mr-2 text-amber-500" />Top Rated Recipes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredRecipes.map((recipe, i) => (
            <Link key={i} to={`/recipes/${recipe.id}`} className="block p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:shadow-lg transition-shadow">
              <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">{truncate(recipe.title)}</h3>
              <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400 mt-2">
                <span>🏷️ {recipe.cuisine}</span>
                <span><Clock className="inline w-4 h-4 mr-1" />{formatTime(recipe.prep_time_mins)}</span>
              </div>
              <div className="flex items-center mt-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="ml-1 text-sm">{recipe.average_rating}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
