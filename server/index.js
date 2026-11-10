const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Database setup
const dbPath = path.join(__dirname, '../db/flavorcraft.db');
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
const db = new sqlite3.Database(dbPath);
db.serialize(() => db.run('PRAGMA foreign_keys = ON;'));

// Initialize database
const initDb = () => {
  const schema = fs.readFileSync(path.join(__dirname, '../db/schema.sql'), 'utf8');
  db.exec(schema, (err) => {
    if (err) console.error('DB init error:', err.message);
    else console.log('Database initialized');
  });
};
initDb();

// Auth middleware
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: { message: 'No token, authorization denied' } });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'flavorcraft-secret');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: { message: 'Token invalid, authorization denied' } });
  }
};

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: { message: 'All fields required' } });
    }
    db.get('SELECT id FROM users WHERE email = ? OR username = ?', [email, username], async (err, row) => {
      if (row) return res.status(400).json({ error: { message: 'User exists' } });
      const hash = await bcrypt.hash(password, 10);
      const userId = uuidv4();
      db.run('INSERT INTO users (id, username, email, password_hash) VALUES (?, ?, ?, ?)',
        [userId, username, email, hash], function(err) {
          if (err) return res.status(500).json({ error: { message: 'Registration failed' } });
          const token = jwt.sign({ id: userId }, process.env.JWT_SECRET || 'flavorcraft-secret', { expiresIn: '7d' });
          db.get('SELECT id, username, email, created_at FROM users WHERE id = ?', [userId], (err, user) => {
            res.json({ message: 'User registered', user, token });
          });
        });
    });
  } catch (error) {
    res.status(500).json({ error: { message: 'Registration failed' } });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    db.get('SELECT id, username, email, password_hash FROM users WHERE email = ?', [email], async (err, user) => {
      if (!user) return res.status(401).json({ error: { message: 'Invalid credentials' } });
      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) return res.status(401).json({ error: { message: 'Invalid credentials' } });
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'flavorcraft-secret', { expiresIn: '7d' });
      res.json({ message: 'Login successful', user: { id: user.id, username: user.username, email: user.email }, token });
    });
  } catch (error) {
    res.status(500).json({ error: { message: 'Login failed' } });
  }
});

app.get('/api/auth/me', authenticate, (req, res) => {
  db.get('SELECT id, username, email, created_at FROM users WHERE id = ?', [req.user.id], (err, user) => {
    if (!user) return res.status(404).json({ error: { message: 'User not found' } });
    res.json({ user });
  });
});

// Recipes routes
app.get('/api/recipes', (req, res) => {
  const { search, cuisine, difficulty, page = 1, limit = 12 } = req.query;
  const offset = (page - 1) * limit;
  let query = 'SELECT * FROM recipes WHERE 1=1';
  const params = [];
  if (search) { query += ' AND (title LIKE ? OR description LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }
  if (cuisine) { query += ' AND cuisine = ?'; params.push(cuisine); }
  if (difficulty) { query += ' AND difficulty = ?'; params.push(difficulty); }
  query += ' ORDER BY average_rating DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);
  db.all(query, params, (err, recipes) => {
    if (err) return res.status(500).json({ error: { message: 'Failed to get recipes' } });
    db.get('SELECT COUNT(*) as total FROM recipes', (err, count) => {
      res.json({ recipes, pagination: { page: +page, limit: +limit, total: count?.total || 0 } });
    });
  });
});

app.get('/api/recipes/:id', (req, res) => {
  db.get('SELECT * FROM recipes WHERE id = ?', [req.params.id], (err, recipe) => {
    if (!recipe) return res.status(404).json({ error: { message: 'Recipe not found' } });
    res.json({ recipe });
  });
});

app.get('/api/recipes/random', (req, res) => {
  db.get('SELECT * FROM recipes ORDER BY RANDOM() LIMIT 1', (err, recipe) => {
    if (!recipe) return res.status(404).json({ error: { message: 'No recipes found' } });
    res.json({ recipe });
  });
});

app.get('/api/recipes/featured', (req, res) => {
  const limit = req.query.limit || 6;
  db.all('SELECT * FROM recipes ORDER BY average_rating DESC LIMIT ?', [limit], (err, recipes) => {
    res.json({ recipes });
  });
});

// Cookbooks routes
app.get('/api/cookbooks', authenticate, (req, res) => {
  db.all('SELECT * FROM cookbooks WHERE user_id = ?', [req.user.id], (err, cookbooks) => {
    res.json({ cookbooks });
  });
});

app.post('/api/cookbooks', authenticate, (req, res) => {
  const { title, description, category, is_public = false } = req.body;
  const cookbookId = uuidv4();
  db.run('INSERT INTO cookbooks (id, user_id, title, description, category, is_public) VALUES (?, ?, ?, ?, ?, ?)',
    [cookbookId, req.user.id, title, description, category, is_public], function(err) {
      if (err) return res.status(500).json({ error: { message: 'Failed to create cookbook' } });
      db.get('SELECT * FROM cookbooks WHERE id = ?', [cookbookId], (err, cookbook) => {
        res.status(201).json({ message: 'Cookbook created', cookbook });
      });
    });
});

// Flavor routes
app.get('/api/flavors', (req, res) => {
  db.all('SELECT * FROM flavor_profiles', (err, profiles) => {
    res.json({ profiles });
  });
});

app.get('/api/flavors/synergy', (req, res) => {
  const { ingredient1, ingredient2 } = req.query;
  db.all('SELECT * FROM flavor_profiles WHERE ingredient IN (?, ?)', [ingredient1, ingredient2], (err, profiles) => {
    if (err || profiles.length < 2) return res.status(404).json({ error: { message: 'Ingredients not found' } });
    const p1 = profiles.find(p => p.ingredient === ingredient1);
    const p2 = profiles.find(p => p.ingredient === ingredient2);
    const notes1 = JSON.parse(p1.flavor_notes);
    const notes2 = JSON.parse(p2.flavor_notes);
    const pairings1 = JSON.parse(p1.pairings || '[]');
    const pairings2 = JSON.parse(p2.pairings || '[]');
    const isMutual = pairings1.includes(ingredient2) && pairings2.includes(ingredient1);
    const oneWay = pairings1.includes(ingredient2) || pairings2.includes(ingredient1);
    let flavorCompat = 0;
    ['acid', 'umami', 'sweet', 'spice', 'bitter'].forEach(f => {
      const diff = Math.abs((notes1[f] || 0) - (notes2[f] || 0));
      flavorCompat += 10 - (diff / 10 * 10);
    });
    flavorCompat /= 5;
    let score = 0;
    if (isMutual) score = 90 + (flavorCompat * 0.1);
    else if (oneWay) score = 70 + (flavorCompat * 0.2);
    else score = 50 + (flavorCompat * 0.4);
    score = Math.min(100, Math.max(0, Math.round(score)));
    const commonPairings = pairings1.filter(p => pairings2.includes(p));
    res.json({
      ingredient1, ingredient2,
      synergy_score: score,
      flavor_notes: { [ingredient1]: notes1, [ingredient2]: notes2 },
      is_mutual_pairing: isMutual,
      common_pairings,
      advice: score >= 80 ? 'Excellent pairing!' : score >= 60 ? 'Good pairing' : score >= 40 ? 'Fair pairing' : 'Challenging pairing'
    });
  });
});

// Get pairing suggestions for an ingredient
app.get('/api/flavors/:ingredient/suggestions', (req, res) => {
  const { ingredient } = req.params;
  
  db.get('SELECT * FROM flavor_profiles WHERE ingredient = ?', [ingredient], (err, profile) => {
    if (err || !profile) {
      return res.status(404).json({ error: { message: 'Ingredient not found' } });
    }
    
    // Get all other flavor profiles
    db.all('SELECT * FROM flavor_profiles WHERE ingredient != ?', [ingredient], (err, allProfiles) => {
      if (err) {
        return res.status(500).json({ error: { message: 'Failed to get suggestions' } });
      }
      
      const profileNotes = JSON.parse(profile.flavor_notes);
      const profilePairings = JSON.parse(profile.pairings || '[]');
      
      // Calculate synergy scores for all other ingredients
      const suggestions = allProfiles.map(otherProfile => {
        const otherNotes = JSON.parse(otherProfile.flavor_notes);
        const otherPairings = JSON.parse(otherProfile.pairings || '[]');
        
        const isMutual = profilePairings.includes(otherProfile.ingredient) && 
          otherPairings.includes(ingredient);
        const oneWay = profilePairings.includes(otherProfile.ingredient) || 
          otherPairings.includes(ingredient);
        
        // Calculate flavor compatibility
        let flavorCompat = 0;
        ['acid', 'umami', 'sweet', 'spice', 'bitter'].forEach(f => {
          const diff = Math.abs((profileNotes[f] || 0) - (otherNotes[f] || 0));
          flavorCompat += 10 - (diff / 10 * 10);
        });
        flavorCompat /= 5;
        
        let score = 0;
        if (isMutual) score = 90 + (flavorCompat * 0.1);
        else if (oneWay) score = 70 + (flavorCompat * 0.2);
        else score = 50 + (flavorCompat * 0.4);
        score = Math.min(100, Math.max(0, Math.round(score)));
        
        return {
          ingredient: otherProfile.ingredient,
          synergy_score: score,
          is_mutual_pairing: isMutual,
          flavor_notes: otherNotes,
          description: otherProfile.description
        };
      });
      
      // Sort by score descending
      suggestions.sort((a, b) => b.synergy_score - a.synergy_score);
      
      res.json({ ingredient, suggestions });
    });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`FlavorCraft server running on port ${PORT}`);
});

module.exports = app;
