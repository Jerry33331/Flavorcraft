import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import YouTube from 'react-youtube';
import { ChefHat, Clock, Star, Heart, CheckSquare, Square, BookOpen, Note, PlayCircle, PauseCircle } from 'lucide-react';

// Helper function to extract YouTube video ID from URL
const extractYouTubeId = (url) => {
  if (!url) return null;
  
  // Handle embed URLs: https://www.youtube.com/embed/VIDEO_ID
  if (url.includes('youtube.com/embed/')) {
    const parts = url.split('embed/');
    const idPart = parts[1] || '';
    // Remove any query parameters
    return idPart.split('?')[0].split('&')[0];
  }
  
  // Handle watch URLs: https://www.youtube.com/watch?v=VIDEO_ID
  if (url.includes('youtube.com/watch')) {
    const params = new URL(url).searchParams;
    return params.get('v');
  }
  
  // Handle short URLs: https://youtu.be/VIDEO_ID
  if (url.includes('youtu.be/')) {
    const parts = url.split('youtu.be/');
    const idPart = parts[1] || '';
    return idPart.split('?')[0].split('&')[0];
  }
  
  // If URL is just the ID
  if (url.length === 11 && !url.includes('/') && !url.includes('.')) {
    return url;
  }
  
  return null;
};

export default function CookingMode() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('instructions');
  const [checkedSteps, setCheckedSteps] = useState([]);
  const [checkedIngredients, setCheckedIngredients] = useState([]);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [userNote, setUserNote] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/recipes/${id}`);
        setRecipe(res.data.recipe);
        setCheckedSteps(new Array(res.data.recipe.instructions?.length || 0).fill(false));
        setCheckedIngredients(new Array(res.data.recipe.ingredients?.length || 0).fill(false));
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  const toggleStep = (index) => {
    setCheckedSteps(prev => {
      const newChecked = [...prev];
      newChecked[index] = !newChecked[index];
      return newChecked;
    });
  };

  const toggleIngredient = (index) => {
    setCheckedIngredients(prev => {
      const newChecked = [...prev];
      newChecked[index] = !newChecked[index];
      return newChecked;
    });
  };

  const handleRating = (rating) => {
    setUserRating(rating);
    // In a real app, you would send this to the backend
  };

  const formatTime = (mins) => mins < 60 ? `${mins} min` : `${Math.floor(mins/60)}h ${mins%60}m`;
  const getDifficultyColor = (d) => d === 'Easy' ? 'bg-green-100 text-green-600' : d === 'Medium' ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600';
  const getProgress = () => {
    const total = checkedSteps.length;
    const completed = checkedSteps.filter(c => c).length;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (!recipe) return <div className="text-center py-12">Recipe not found</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <nav className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          <Link to="/">Home</Link> / <Link to="/recipes">Recipes</Link> / <span className="text-gray-900 dark:text-white">{recipe.title}</span>
        </nav>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{recipe.title}</h1>
            <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
              <span className={`px-2 py-1 rounded-full ${getDifficultyColor(recipe.difficulty)}`}>{recipe.difficulty}</span>
              <span><Clock className="inline w-4 h-4 mr-1" />{formatTime(recipe.prep_time_mins)}</span>
              <span>🏷️ {recipe.cuisine}</span>
              <span><Star className="inline w-4 h-4 mr-1 text-yellow-500" />{recipe.average_rating}</span>
            </div>
          </div>
          <button onClick={() => setIsFavorite(!isFavorite)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <Heart className={`w-6 h-6 ${isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} />
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Cooking Progress</span>
          <span className="text-sm font-medium text-amber-600">{getProgress()}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${getProgress()}%` }}></div>
        </div>
      </div>

      {/* Video */}
      {recipe?.video_url && extractYouTubeId(recipe.video_url) && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Video Tutorial</h2>
          <div className="aspect-video bg-gray-900 rounded-xl overflow-hidden relative">
            <YouTube
              videoId={extractYouTubeId(recipe.video_url)}
              opts={{ height: '100%', width: '100%', playerVars: { autoplay: 0, modestbranding: 1, rel: 0 } }}
              onStateChange={(e) => setIsPlaying(e.data === 1)}
              onError={(e) => console.error('YouTube error:', e)}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <button onClick={() => {}} className="p-2 bg-white/20 rounded-full">
                {isPlaying ? <PauseCircle className="w-6 h-6 text-white" /> : <PlayCircle className="w-6 h-6 text-white" />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Description */}
      {recipe.description && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
          <p className="text-gray-700 dark:text-gray-300">{recipe.description}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700 px-4">
          <nav className="flex space-x-8">
            {['instructions', 'ingredients', 'equipment', 'nutrition', 'notes'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 border-b-2 font-medium text-sm capitalize transition-colors ${
                  activeTab === tab
                    ? 'border-amber-500 text-amber-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
        <div className="p-4">
          {activeTab === 'instructions' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Instructions</h3>
              {JSON.parse(recipe.instructions || '[]').map((step, i) => (
                <div key={i} className={`flex gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 ${checkedSteps[i] ? 'bg-green-50 dark:bg-green-900/20' : ''}`}>
                  <button onClick={() => toggleStep(i)} className="flex-shrink-0">
                    {checkedSteps[i] ? <CheckSquare className="w-6 h-6 text-green-600" /> : <Square className="w-6 h-6 text-gray-400" />}
                  </button>
                  <div className="flex-1">
                    <div className="w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center font-bold text-sm mb-2">{i+1}</div>
                    <p className="text-gray-700 dark:text-gray-300">{step}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {activeTab === 'ingredients' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Ingredients</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {JSON.parse(recipe.ingredients || '[]').map((ingredient, i) => (
                  <div key={i} className={`flex gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 ${checkedIngredients[i] ? 'bg-green-50 dark:bg-green-900/20' : ''}`}>
                    <button onClick={() => toggleIngredient(i)}>
                      {checkedIngredients[i] ? <CheckSquare className="w-5 h-5 text-green-600" /> : <Square className="w-5 h-5 text-gray-400" />}
                    </button>
                    <span className={`flex-1 ${checkedIngredients[i] ? 'line-through text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>{ingredient}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === 'equipment' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Equipment</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {['Mixing bowls', 'Chef knife', 'Cutting board', 'Measuring cups', 'Wooden spoon', 'Skillet', 'Pot', 'Baking sheet'].map((item, i) => (
                  <div key={i} className="flex gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <Plus className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === 'nutrition' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Nutrition</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[{label: 'Calories', value: '350 kcal'}, {label: 'Protein', value: '25g'}, {label: 'Carbs', value: '45g'}, {label: 'Fat', value: '12g'}].map((item, i) => (
                  <div key={i} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.label}</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === 'notes' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Personal Notes</h3>
              <textarea
                value={userNote}
                onChange={(e) => setUserNote(e.target.value)}
                placeholder="Add your personal notes, modifications, or tips..."
                className="w-full min-h-[200px] p-4 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white resize-none"
              />
              <button className="px-6 py-3 bg-amber-500 text-white font-medium rounded-xl hover:bg-amber-600">Save Note</button>
            </div>
          )}
        </div>
      </div>

      {/* Rating */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Rate This Recipe</h3>
        <div className="flex gap-2 mb-4">
          {[1,2,3,4,5].map(star => (
            <button
              key={star}
              onClick={() => handleRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
            >
              <Star className={`w-8 h-8 ${star <= (hoverRating || userRating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
            </button>
          ))}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">Average Rating: {recipe.average_rating} / 5.0</p>
      </div>
    </div>
  );
}
