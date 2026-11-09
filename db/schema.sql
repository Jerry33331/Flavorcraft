-- FlavorCraft Database Schema

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Recipes Table
CREATE TABLE IF NOT EXISTS recipes (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    title VARCHAR(150) NOT NULL,
    cuisine VARCHAR(50) NOT NULL,
    difficulty VARCHAR(20) CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
    prep_time_mins INT NOT NULL,
    video_url TEXT,
    ingredients TEXT NOT NULL,
    instructions TEXT NOT NULL,
    description TEXT,
    dietary_tags TEXT DEFAULT '[]',
    average_rating REAL DEFAULT 0.0,
    rating_count INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Cookbooks Table
CREATE TABLE IF NOT EXISTS cookbooks (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    cover_image TEXT,
    is_public BOOLEAN DEFAULT false,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Cookbook Recipes Junction Table
CREATE TABLE IF NOT EXISTS cookbook_recipes (
    cookbook_id TEXT REFERENCES cookbooks(id) ON DELETE CASCADE,
    recipe_id TEXT REFERENCES recipes(id) ON DELETE CASCADE,
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (cookbook_id, recipe_id)
);

-- User Recipe Notes
CREATE TABLE IF NOT EXISTS user_recipe_notes (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    recipe_id TEXT REFERENCES recipes(id) ON DELETE CASCADE,
    note_text TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, recipe_id)
);

-- User Favorites
CREATE TABLE IF NOT EXISTS user_favorites (
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    recipe_id TEXT REFERENCES recipes(id) ON DELETE CASCADE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, recipe_id)
);

-- User Ratings
CREATE TABLE IF NOT EXISTS user_ratings (
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    recipe_id TEXT REFERENCES recipes(id) ON DELETE CASCADE,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, recipe_id)
);

-- Flavor Profiles
CREATE TABLE IF NOT EXISTS flavor_profiles (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    ingredient VARCHAR(100) UNIQUE NOT NULL,
    flavor_notes TEXT NOT NULL,
    pairings TEXT DEFAULT '[]',
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
