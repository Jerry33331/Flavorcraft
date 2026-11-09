const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const dbPath = path.join(__dirname, '../db/flavorcraft.db');
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

const db = new sqlite3.Database(dbPath);
db.serialize(() => db.run('PRAGMA foreign_keys = ON;'));

const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
db.exec(schema);

// Seed data
const seedRecipes = [
  {
    id: uuidv4(),
    title: 'Neapolitan Margherita Pizza',
    cuisine: 'Italian',
    difficulty: 'Easy',
    prep_time_mins: 25,
    video_url: 'https://www.youtube.com/embed/JixXHqXxw1M',
    ingredients: JSON.stringify(['500g Tipo 00 flour', '325ml warm water', '10g salt', '3g yeast', '200g San Marzano tomato sauce', '250g fresh mozzarella', 'Fresh basil', 'Olive oil']),
    instructions: JSON.stringify(['Mix flour, salt, yeast with water', 'Knead 10-15 minutes', 'Let rise 2-4 hours', 'Stretch dough, add sauce and mozzarella', 'Bake at 500°C for 60-90 seconds', 'Add basil and olive oil']),
    description: 'Classic Neapolitan pizza with San Marzano tomatoes, fresh mozzarella, and basil.',
    average_rating: 4.8,
    rating_count: 1250
  },
  {
    id: uuidv4(),
    title: 'Classic French Beef Bourguignon',
    cuisine: 'French',
    difficulty: 'Hard',
    prep_time_mins: 180,
    video_url: 'https://www.youtube.com/embed/1Q9Xj02Uf1I',
    ingredients: JSON.stringify(['2 lbs beef chuck', '6 oz bacon', '1 onion', '2 carrots', '3 garlic cloves', '3 cups red wine', '2 cups beef stock']),
    instructions: JSON.stringify(['Cook bacon, then beef', 'Sauté onions and carrots', 'Add wine, stock, and herbs', 'Simmer 2.5-3 hours', 'Add mushrooms and onions', 'Serve with bread']),
    description: 'Traditional French beef stew braised in red wine.',
    average_rating: 4.9,
    rating_count: 890
  },
  {
    id: uuidv4(),
    title: 'Authentic Thai Green Curry',
    cuisine: 'Thai',
    difficulty: 'Medium',
    prep_time_mins: 45,
    video_url: 'https://www.youtube.com/embed/6l5kXqc4Zmo',
    ingredients: JSON.stringify(['1.5 lbs chicken', '2 cans coconut milk', '2 tbsp green curry paste', '1 cup bamboo shoots', '1 bell pepper', 'Thai basil']),
    instructions: JSON.stringify(['Cook curry paste in coconut milk', 'Add chicken and cook', 'Add remaining coconut milk and vegetables', 'Simmer 15-20 minutes', 'Add basil and serve']),
    description: 'Fragrant Thai curry with coconut milk and chicken.',
    average_rating: 4.7,
    rating_count: 1520
  },
  {
    id: uuidv4(),
    title: 'Traditional Mexican Mole Poblano',
    cuisine: 'Mexican',
    difficulty: 'Hard',
    prep_time_mins: 120,
    video_url: 'https://www.youtube.com/embed/5J5xMpX0Q2o',
    ingredients: JSON.stringify(['4 dried chilies', '1/4 cup almonds', '1/4 cup raisins', '1 onion', '4 garlic cloves', '2 tomatoes', '1 disk Mexican chocolate']),
    instructions: JSON.stringify(['Toast and soak chilies', 'Blend ingredients into sauce', 'Simmer sauce for 30-45 minutes', 'Poach chicken in sauce', 'Serve with rice']),
    description: 'Complex Mexican mole sauce with chocolate.',
    average_rating: 4.8,
    rating_count: 670
  },
  {
    id: uuidv4(),
    title: 'Japanese Tonkotsu Ramen',
    cuisine: 'Japanese',
    difficulty: 'Hard',
    prep_time_mins: 240,
    video_url: 'https://www.youtube.com/embed/399Q3x51pYk',
    ingredients: JSON.stringify(['4 lbs pork bones', '2 lbs pork belly', '1 onion', '1 head garlic', '8 cups water', '1/4 cup soy sauce']),
    instructions: JSON.stringify(['Soak bones for 2 hours', 'Simmer bones for 10-12 hours', 'Strain and chill broth', 'Add tare seasoning', 'Assemble with noodles and toppings']),
    description: 'Rich pork bone broth ramen.',
    average_rating: 4.9,
    rating_count: 1230
  },
  {
    id: uuidv4(),
    title: 'Indian Butter Chicken',
    cuisine: 'Indian',
    difficulty: 'Medium',
    prep_time_mins: 50,
    video_url: 'https://www.youtube.com/embed/9qw0WBG5VVk',
    ingredients: JSON.stringify(['2 lbs chicken', '1 cup yogurt', '2 tbsp ginger-garlic paste', '1 tsp turmeric', '2 tbsp butter', '1 onion', '2 cups tomato puree', '1 cup cream']),
    instructions: JSON.stringify(['Marinate chicken in yogurt and spices', 'Grill chicken', 'Sauté onions, add tomato puree', 'Add cream and chicken', 'Simmer 10 minutes']),
    description: 'Creamy Indian chicken curry.',
    average_rating: 4.8,
    rating_count: 2100
  },
  {
    id: uuidv4(),
    title: 'Spanish Seafood Paella',
    cuisine: 'Spanish',
    difficulty: 'Medium',
    prep_time_mins: 60,
    video_url: 'https://www.youtube.com/embed/6l5kXqc4Zmo',
    ingredients: JSON.stringify(['2 cups rice', '4 cups stock', '1 onion', '4 garlic cloves', '1 bell pepper', '1 tomato', '1 tsp saffron', '1 lb shrimp', '1 lb mussels']),
    instructions: JSON.stringify(['Sauté onion, garlic, bell pepper', 'Add tomato and saffron', 'Add rice and stock', 'Arrange seafood on top', 'Cook 18-20 minutes']),
    description: 'Saffron-infused rice with seafood.',
    average_rating: 4.7,
    rating_count: 980
  },
  {
    id: uuidv4(),
    title: 'Handmade Tuscan Tagliatelle Bolognese',
    cuisine: 'Italian',
    difficulty: 'Medium',
    prep_time_mins: 90,
    video_url: 'https://www.youtube.com/embed/2aVH8a1s3R4',
    ingredients: JSON.stringify(['2 cups flour', '4 eggs', '1 lb ground beef', '1 lb ground pork', '1 onion', '2 carrots', '2 celery', '4 garlic', '2 cups crushed tomatoes']),
    instructions: JSON.stringify(['Make pasta dough with flour and eggs', 'Roll and cut into tagliatelle', 'Brown meat', 'Sauté vegetables', 'Add tomatoes and simmer 2-3 hours', 'Serve with pasta']),
    description: 'Fresh pasta with slow-cooked meat ragù.',
    average_rating: 4.9,
    rating_count: 1450
  }
];

const seedFlavorProfiles = [
  { ingredient: 'Tomato', flavor_notes: JSON.stringify({ acid: 8, umami: 7, sweet: 6, spice: 0, bitter: 2 }), pairings: JSON.stringify(['Basil', 'Mozzarella', 'Garlic', 'Olive Oil']), description: 'Rich and tangy with natural sweetness.' },
  { ingredient: 'Garlic', flavor_notes: JSON.stringify({ acid: 2, umami: 9, sweet: 3, spice: 5, bitter: 1 }), pairings: JSON.stringify(['Olive Oil', 'Tomato', 'Meat', 'Herbs']), description: 'Pungent and aromatic with deep umami notes.' },
  { ingredient: 'Onion', flavor_notes: JSON.stringify({ acid: 3, umami: 7, sweet: 6, spice: 2, bitter: 1 }), pairings: JSON.stringify(['Meat', 'Tomato', 'Cheese', 'Herbs']), description: 'Sweet and pungent base for many dishes.' },
  { ingredient: 'Lemon', flavor_notes: JSON.stringify({ acid: 10, umami: 1, sweet: 4, spice: 0, bitter: 2 }), pairings: JSON.stringify(['Fish', 'Olive Oil', 'Herbs', 'Garlic']), description: 'Bright and acidic.' },
  { ingredient: 'Chili', flavor_notes: JSON.stringify({ acid: 3, umami: 4, sweet: 2, spice: 10, bitter: 1 }), pairings: JSON.stringify(['Tomato', 'Garlic', 'Onion', 'Cilantro']), description: 'Hot and pungent.' },
  { ingredient: 'Basil', flavor_notes: JSON.stringify({ acid: 2, umami: 3, sweet: 7, spice: 0, bitter: 2 }), pairings: JSON.stringify(['Tomato', 'Mozzarella', 'Garlic', 'Olive Oil']), description: 'Sweet and aromatic herb.' },
  { ingredient: 'Soy Sauce', flavor_notes: JSON.stringify({ acid: 2, umami: 10, sweet: 3, spice: 0, bitter: 1 }), pairings: JSON.stringify(['Ginger', 'Garlic', 'Meat', 'Rice']), description: 'Salty and deeply umami.' },
  { ingredient: 'Coconut Milk', flavor_notes: JSON.stringify({ acid: 1, umami: 2, sweet: 8, spice: 0, bitter: 0 }), pairings: JSON.stringify(['Curry Paste', 'Chili', 'Lime', 'Fish Sauce']), description: 'Rich and creamy with natural sweetness.' }
];

// Insert recipes
seedRecipes.forEach(recipe => {
  db.run('INSERT OR IGNORE INTO recipes VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',
    [recipe.id, recipe.title, recipe.cuisine, recipe.difficulty, recipe.prep_time_mins, recipe.video_url, 
     recipe.ingredients, recipe.instructions, recipe.description, recipe.dietary_tags || '[]', recipe.average_rating, recipe.rating_count]);
});

// Insert flavor profiles
seedFlavorProfiles.forEach(profile => {
  db.run('INSERT OR IGNORE INTO flavor_profiles VALUES (?,?,?,?,?)',
    [uuidv4(), profile.ingredient, profile.flavor_notes, profile.pairings, profile.description]);
});

// Insert sample users
const userId1 = uuidv4();
const userId2 = uuidv4();
db.run('INSERT OR IGNORE INTO users VALUES (?,?,?,?,?)', [userId1, 'chef_john', 'john@flavorcraft.com', '$2a$10$N9qo8uLOickgx2ZMRZoMy.Mrq4H3Q6fQ5J8Lx5p2Y6z4f4L4K4', new Date().toISOString()]);
db.run('INSERT OR IGNORE INTO users VALUES (?,?,?,?,?)', [userId2, 'home_cook', 'home@flavorcraft.com', '$2a$10$N9qo8uLOickgx2ZMRZoMy.Mrq4H3Q6fQ5J8Lx5p2Y6z4f4L4K4', new Date().toISOString()]);

// Insert sample cookbooks
const cookbookId1 = uuidv4();
const cookbookId2 = uuidv4();
db.run('INSERT OR IGNORE INTO cookbooks VALUES (?,?,?,?,?,?,?,?)',
  [cookbookId1, userId1, 'Italian Classics', 'My Italian recipes', 'Italian', null, true, new Date().toISOString(), new Date().toISOString()]);
db.run('INSERT OR IGNORE INTO cookbooks VALUES (?,?,?,?,?,?,?,?)',
  [cookbookId2, userId2, 'Quick Meals', 'Easy weeknight recipes', 'Quick Meals', null, false, new Date().toISOString(), new Date().toISOString()]);

// Link recipes to cookbooks
db.run('INSERT OR IGNORE INTO cookbook_recipes VALUES (?,?)', [cookbookId1, seedRecipes[0].id]);
db.run('INSERT OR IGNORE INTO cookbook_recipes VALUES (?,?)', [cookbookId1, seedRecipes[7].id]);
db.run('INSERT OR IGNORE INTO cookbook_recipes VALUES (?,?)', [cookbookId2, seedRecipes[2].id]);

console.log('Database seeded successfully!');
db.close();
