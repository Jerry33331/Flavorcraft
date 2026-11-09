import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChefHat, Target, Lightbulb, Sparkles, BarChart3, TrendingUp, ArrowRight, RefreshCw } from 'lucide-react';

export default function FlavorMatcher() {
  const [profiles, setProfiles] = useState([]);
  const [selected1, setSelected1] = useState('');
  const [selected2, setSelected2] = useState('');
  const [synergyData, setSynergyData] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const res = await axios.get('/api/flavors');
        setProfiles(res.data.profiles || []);
        if (res.data.profiles.length >= 2) {
          setSelected1(res.data.profiles[0].ingredient);
          setSelected2(res.data.profiles[1].ingredient);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfiles();
  }, []);

  useEffect(() => {
    if (selected1 && selected2) {
      const fetchSynergy = async () => {
        try {
          const res = await axios.get('/api/flavors/synergy', { params: { ingredient1: selected1, ingredient2: selected2 } });
          setSynergyData(res.data);
          const sugRes = await axios.get(`/api/flavors/${selected1}/suggestions`);
          setSuggestions(sugRes.data.suggestions || []);
        } catch (error) {
          console.error('Error:', error);
        }
      };
      fetchSynergy();
    }
  }, [selected1, selected2]);

  const swapIngredients = () => {
    const temp = selected1;
    setSelected1(selected2);
    setSelected2(temp);
  };

  const getRandomPairing = () => {
    if (profiles.length < 2) return;
    const r1 = Math.floor(Math.random() * profiles.length);
    let r2;
    do { r2 = Math.floor(Math.random() * profiles.length); } while (r2 === r1);
    setSelected1(profiles[r1].ingredient);
    setSelected2(profiles[r2].ingredient);
  };

  const getSynergyColor = (score) => {
    if (score >= 80) return 'bg-green-100 text-green-600';
    if (score >= 60) return 'bg-blue-100 text-blue-600';
    if (score >= 40) return 'bg-yellow-100 text-yellow-600';
    return 'bg-red-100 text-red-600';
  };

  const flavorColors = {
    acid: 'bg-red-500', umami: 'bg-amber-600', sweet: 'bg-pink-500', spice: 'bg-orange-500', bitter: 'bg-green-500'
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Flavor Profile Synergy Matcher</h1>
          <p className="text-gray-600 dark:text-gray-400">Test ingredient compatibility and discover perfect flavor pairings</p>
        </div>
        <button onClick={getRandomPairing} className="px-4 py-2 bg-amber-500 text-white font-medium rounded-lg hover:bg-amber-600">
          <RefreshCw className="inline w-4 h-4 mr-2" /> Random Pairing
        </button>
      </div>

      {/* Calculator */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4"><Target className="inline w-6 h-6 mr-2 text-amber-500" />Synergy Calculator</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Ingredient 1</label>
            <select
              value={selected1}
              onChange={(e) => setSelected1(e.target.value)}
              className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white"
            >
              {profiles.map(p => <option key={p.ingredient} value={p.ingredient}>{p.ingredient}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Ingredient 2</label>
            <select
              value={selected2}
              onChange={(e) => setSelected2(e.target.value)}
              className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white"
            >
              {profiles.map(p => <option key={p.ingredient} value={p.ingredient}>{p.ingredient}</option>)}
            </select>
          </div>
        </div>
        <div className="flex justify-center mb-6">
          <button onClick={swapIngredients} className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
            <ArrowRight className="w-5 h-5 text-gray-600 transform rotate-90" />
          </button>
        </div>

        {/* Results */}
        {synergyData && (
          <div className="bg-gradient-to-r from-amber-50 to-blue-50 dark:from-amber-900/30 dark:to-blue-900/30 rounded-xl p-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Synergy Score</h3>
              <div className="flex justify-center gap-4 mb-4">
                <span className="text-2xl font-bold text-gray-700">{synergyData.ingredient1}</span>
                <span className="text-2xl font-bold text-amber-600">+ {synergyData.ingredient2}</span>
              </div>
              <div className="inline-block px-6 py-3 rounded-full text-3xl font-bold shadow-lg" style={{background: synergyData.synergy_score >= 80 ? '#dcfce7' : synergyData.synergy_score >= 60 ? '#dbeafe' : '#fef3c7'}}>
                {synergyData.synergy_score}
              </div>
              <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-md mx-auto">{synergyData.advice}</p>
            </div>
            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-center">{synergyData.ingredient1}</h4>
                <div className="space-y-3">
                  {Object.entries(synergyData.flavor_notes[synergyData.ingredient1] || {}).map(([note, value]) => (
                    <div key={note}>
                      <div className="flex justify-between text-xs mb-1"><span className="capitalize">{note}</span><span>{value}</span></div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                        <div className={`h-1.5 rounded-full ${flavorColors[note] || 'bg-amber-500'}`} style={{width: `${value * 10}%`}}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-center">{synergyData.ingredient2}</h4>
                <div className="space-y-3">
                  {Object.entries(synergyData.flavor_notes[synergyData.ingredient2] || {}).map(([note, value]) => (
                    <div key={note}>
                      <div className="flex justify-between text-xs mb-1"><span className="capitalize">{note}</span><span>{value}</span></div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                        <div className={`h-1.5 rounded-full ${flavorColors[note] || 'bg-amber-500'}`} style={{width: `${value * 10}%`}}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
              {synergyData.is_mutual_pairing && (
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600 dark:text-green-400 text-sm">
                  <Sparkles className="w-4 h-4" /> Mutual Pairing
                </span>
              )}
              {synergyData.common_pairings?.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Common Pairings:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {synergyData.common_pairings.map((p, i) => (
                      <span key={i} className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full text-sm">{p}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Suggestions */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4"><Lightbulb className="inline w-6 h-6 mr-2 text-amber-500" />Pairing Suggestions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {suggestions.slice(0, 6).map((sug, i) => (
            <div key={i} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900 dark:text-white">{sug.ingredient}</h3>
                <span className={`px-2 py-1 text-xs rounded-full ${getSynergyColor(sug.synergy_score)}`}>{sug.synergy_score}</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{sug.description}</p>
              {sug.is_mutual_pairing && <span className="text-xs text-green-600 mt-2 inline-block">✓ Mutual</span>}
              <button
                onClick={() => setSelected2(sug.ingredient)}
                className="w-full mt-3 px-4 py-2 bg-amber-500 text-white font-medium rounded-lg hover:bg-amber-600 text-sm"
              >
                Compare with {selected1}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Flavor Notes Guide */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4"><BarChart3 className="inline w-6 h-6 mr-2 text-amber-500" />Flavor Notes Guide</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {Object.entries(flavorColors).map(([note, color]) => (
            <div key={note} className="text-center">
              <div className={`w-12 h-12 ${color} rounded-xl mx-auto mb-2 flex items-center justify-center`}>
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <p className="font-medium text-gray-900 dark:text-white capitalize">{note}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-4">Understanding flavor profiles helps create balanced dishes</p>
      </div>

      {/* Popular Pairings */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4"><TrendingUp className="inline w-6 h-6 mr-2 text-amber-500" />Popular Pairings</h2>
        <div className="flex flex-wrap gap-3 justify-center">
          {[['Tomato', 'Basil'], ['Garlic', 'Olive Oil'], ['Chocolate', 'Strawberry'], ['Peanut Butter', 'Jelly'], ['Bacon', 'Eggs'], ['Cheese', 'Wine']].map(([a, b], i) => (
            <div key={i} className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300">
              <span>{a}</span>
              <span className="text-amber-500">+</span>
              <span>{b}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
