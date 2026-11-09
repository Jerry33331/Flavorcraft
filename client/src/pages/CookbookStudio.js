import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BookOpen, Plus, X, Trash2, Edit2, Grid3X3, List, Clock, Star } from 'lucide-react';

export default function CookbookStudio() {
  const navigate = useNavigate();
  const [cookbooks, setCookbooks] = useState([]);
  const [selectedCookbook, setSelectedCookbook] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [allRecipes, setAllRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddRecipeModal, setShowAddRecipeModal] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [selectedRecipes, setSelectedRecipes] = useState([]);
  const [formData, setFormData] = useState({ title: '', description: '', category: '', is_public: false });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [cookbooksRes, recipesRes] = await Promise.all([
          axios.get('/api/cookbooks'),
          axios.get('/api/recipes')
        ]);
        setCookbooks(cookbooksRes.data.cookbooks || []);
        setAllRecipes(recipesRes.data.recipes || []);
        if (cookbooksRes.data.cookbooks.length > 0) {
          selectCookbook(cookbooksRes.data.cookbooks[0]);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const selectCookbook = async (cookbook) => {
    try {
      setSelectedCookbook(cookbook);
      const res = await axios.get(`/api/cookbooks/${cookbook.id}`);
      setRecipes(res.data.cookbook.recipes || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const createCookbook = async () => {
    try {
      const res = await axios.post('/api/cookbooks', formData);
      setCookbooks([...cookbooks, res.data.cookbook]);
      setShowCreateModal(false);
      setFormData({ title: '', description: '', category: '', is_public: false });
      selectCookbook(res.data.cookbook);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const addRecipeToCookbook = async (recipeId) => {
    try {
      await axios.post(`/api/cookbooks/${selectedCookbook.id}/recipes`, { recipe_id: recipeId });
      const res = await axios.get(`/api/cookbooks/${selectedCookbook.id}`);
      setRecipes(res.data.cookbook.recipes || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const removeRecipeFromCookbook = async (recipeId) => {
    try {
      await axios.delete(`/api/cookbooks/${selectedCookbook.id}/recipes`, { data: { recipe_id: recipeId } });
      setRecipes(recipes.filter(r => r.id !== recipeId));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const deleteCookbook = async (cookbookId) => {
    try {
      await axios.delete(`/api/cookbooks/${cookbookId}`);
      setCookbooks(cookbooks.filter(c => c.id !== cookbookId));
      if (selectedCookbook?.id === cookbookId) {
        setSelectedCookbook(null);
        setRecipes([]);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const formatTime = (mins) => mins < 60 ? `${mins} min` : `${Math.floor(mins/60)}h ${mins%60}m`;
  const truncate = (str, len = 30) => str.length > len ? str.substring(0, len) + '...' : str;

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Custom Cookbook Studio</h1>
          <p className="text-gray-600 dark:text-gray-400">Create, organize, and manage your personal recipe collections</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="px-4 py-2 bg-amber-500 text-white font-medium rounded-lg hover:bg-amber-600">
          <Plus className="inline w-4 h-4 mr-2" /> Create Cookbook
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4"><BookOpen className="inline w-5 h-5 mr-2 text-amber-500" />My Cookbooks</h2>
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {cookbooks.length > 0 ? (
                cookbooks.map((cookbook, i) => (
                  <div
                    key={i}
                    onClick={() => selectCookbook(cookbook)}
                    className={`p-3 rounded-xl cursor-pointer transition-colors ${selectedCookbook?.id === cookbook.id ? 'bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white truncate">{cookbook.title}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{recipes.filter(r => r.cookbook_id === cookbook.id).length} recipes</p>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); deleteCookbook(cookbook.id); }} className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg">
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">No cookbooks yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          {selectedCookbook ? (
            <div className="space-y-6">
              {/* Cookbook Header */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{selectedCookbook.title}</h2>
                    <p className="text-gray-600 dark:text-gray-400">{selectedCookbook.description || 'No description'}</p>
                    <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400 mt-3">
                      <span><BookOpen className="inline w-4 h-4 mr-1" />{recipes.length} recipes</span>
                      {selectedCookbook.category && <span>🏷️ {selectedCookbook.category}</span>}
                      <span className={selectedCookbook.is_public ? 'text-green-600' : 'text-gray-500'}>
                        {selectedCookbook.is_public ? 'Public' : 'Private'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setShowAddRecipeModal(true)} className="px-4 py-2 bg-amber-500 text-white font-medium rounded-lg hover:bg-amber-600 text-sm">
                      <Plus className="inline w-4 h-4 mr-1" /> Add Recipe
                    </button>
                    <button onClick={() => deleteCookbook(selectedCookbook.id)} className="px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 text-sm">
                      <Trash2 className="inline w-4 h-4 mr-1" /> Delete
                    </button>
                  </div>
                </div>
              </div>

              {/* View Toggle */}
              <div className="flex justify-end gap-2">
                <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-amber-100 text-amber-600' : 'text-gray-400'}`}>
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-amber-100 text-amber-600' : 'text-gray-400'}`}>
                  <List className="w-5 h-5" />
                </button>
              </div>

              {/* Recipes */}
              {recipes.length > 0 ? (
                <div className={`gap-4 ${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'space-y-4'}`}>
                  {recipes.map((recipe, i) => viewMode === 'grid' ? (
                    <div key={i} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                      <Link to={`/recipes/${recipe.id}`} className="block">
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
                      <button onClick={() => removeRecipeFromCookbook(recipe.id)} className="w-full mt-3 px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 text-sm">
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div key={i} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <Link to={`/recipes/${recipe.id}`} className="block">
                            <h3 className="font-semibold text-gray-900 dark:text-white">{recipe.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">{recipe.description}</p>
                            <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400 mt-2">
                              <span>🏷️ {recipe.cuisine}</span>
                              <span><Clock className="inline w-4 h-4 mr-1" />{formatTime(recipe.prep_time_mins)}</span>
                              <span><Star className="inline w-4 h-4 mr-1 text-yellow-500" />{recipe.average_rating}</span>
                            </div>
                          </Link>
                        </div>
                        <button onClick={() => removeRecipeFromCookbook(recipe.id)} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg">
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 p-8 rounded-xl border border-gray-200 dark:border-gray-700 text-center">
                  <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No recipes in this cookbook</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">Add some recipes to get started</p>
                  <button onClick={() => setShowAddRecipeModal(true)} className="px-4 py-2 bg-amber-500 text-white font-medium rounded-lg hover:bg-amber-600">
                    Add Recipes
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl border border-gray-200 dark:border-gray-700 text-center">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Select a Cookbook</h3>
              <p className="text-gray-600 dark:text-gray-400">Choose a cookbook from the sidebar or create a new one</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Cookbook Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md">
            <div className="flex justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Create Cookbook</h2>
              <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="My Recipe Collection"
                    className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="A collection of my favorite recipes"
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                  >
                    <option value="">No category</option>
                    <option value="Italian">Italian</option>
                    <option value="Desserts">Desserts</option>
                    <option value="Quick Meals">Quick Meals</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.is_public}
                    onChange={(e) => setFormData({...formData, is_public: e.target.checked})}
                    className="w-4 h-4 text-amber-600 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">Make this cookbook public</label>
                </div>
                <div className="flex justify-end gap-2">
                  <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg">
                    Cancel
                  </button>
                  <button onClick={createCookbook} className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg">
                    Create
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Recipe Modal */}
      {showAddRecipeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg">
            <div className="flex justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Add Recipes</h2>
              <button onClick={() => { setShowAddRecipeModal(false); setSelectedRecipes([]); }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="max-h-[400px] overflow-y-auto space-y-2">
                {allRecipes.filter(r => !recipes.some(recipe => recipe.id === r.id)).map((recipe, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      const newSelected = selectedRecipes.includes(recipe.id)
                        ? selectedRecipes.filter(id => id !== recipe.id)
                        : [...selectedRecipes, recipe.id];
                      setSelectedRecipes(newSelected);
                    }}
                    className={`p-3 rounded-lg cursor-pointer ${selectedRecipes.includes(recipe.id) ? 'bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                  >
                    <div className="flex gap-3">
                      <input
                        type="checkbox"
                        checked={selectedRecipes.includes(recipe.id)}
                        onChange={() => {}}
                        className="w-4 h-4 text-amber-600 border-gray-300 rounded"
                      />
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{recipe.title}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{recipe.cuisine} • {recipe.prep_time_mins} min • {recipe.average_rating} ★</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {selectedRecipes.length > 0 && (
                <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button onClick={() => setSelectedRecipes([])} className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg">
                    Clear
                  </button>
                  <button onClick={async () => {
                    for (const recipeId of selectedRecipes) {
                      await addRecipeToCookbook(recipeId);
                    }
                    setShowAddRecipeModal(false);
                    setSelectedRecipes([]);
                  }} className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg">
                    Add {selectedRecipes.length} Recipe(s)
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
