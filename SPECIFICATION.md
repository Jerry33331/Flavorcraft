# FlavorCraft — Application Specification Document

## Project Overview

**Project Title:** FlavorCraft  
**Fandom / Niche:** Global Culinary Arts & Home Cooking  
**Target Audience:** High school students, culinary enthusiasts, and beginner home cooks.

**Core Problem Solved:** Beginner cooks often struggle to understand ingredient compatibility, organize recipes across multiple platforms, and adapt complex recipes to high school or home kitchen setups. FlavorCraft provides an interactive platform featuring dynamic flavor profiling, personal cookbook management, and structured cooking execution guides.

---

## 1. Panel of Experts Architecture

The design, data modeling, and feature implementation of FlavorCraft are guided by a panel of 4 distinct expert personas:

| Expert Persona | Primary Role | Core Responsibilities |
|----------------|--------------|---------------------|
| @Domain-Strategist | Culinary Culture & Content Lead | Defines culinary taxonomy, designs beginner-friendly recipe structures, curates 8 authentic global seed entries, and aligns features with community needs. |
| @UX-Architect | UI/UX & Responsive Design Lead | Maps layout structures for all 5 unique domain views, ensures intuitive desktop/mobile navigation, and designs visual hierarchy with vibrant, engaging themes. |
| @Data-Engineer | Full-Stack & Database Architect | Designs PostgreSQL / Supabase schemas, handles authentication logic, secures protected routes, and implements full CRUD API logic for custom user cookbooks. |
| @Feature-Specialist | Interactive Systems Lead | Builds the fan-specific Flavor Profile Synergy Matcher and integrates the 10 selected custom interactive features into the application views. |

---

## 2. Technical Stack & Deployment Strategy

**Frontend:** HTML5 / React.js styled with Tailwind CSS (featuring dark/light mode switching and glassmorphism UI card styling).  
**Backend:** Node.js / Express or API routes handling authentication and RESTful CRUD queries.  
**Database:** PostgreSQL (via Supabase or SQLite for local Replit development).  
**Authentication:** JWT / Supabase Auth managing login, registration, and protected routes.  
**Version Control & Deployment:** GitHub repository synced directly with Replit for live project serving.

---

## 3. The 5 Unique Domain Views

FlavorCraft incorporates 5 distinct domain views (excluding login, registration, and administrative account screens):

### View 1: Culinary Dashboard & Discovery Hub
- **Purpose:** High-energy home screen providing daily culinary inspiration and quick navigation.
- **Key Components:** Hero banner, global search input, quick-category shortcuts, and a "Recipe Roulette" random item picker.

### View 2: Global Recipe Directory & Multi-Filter Catalog
- **Purpose:** Comprehensive searchable catalog to browse global recipes.
- **Key Components:** Multi-select cuisine filters, dietary badges, keyword search box, grid recipe cards, and heart icon favorite buttons.

### View 3: Cooking Mode & Deep-Dive Execution View
- **Purpose:** Dedicated step-by-step cooking interface designed for active kitchen use.
- **Key Components:** Embedded YouTube video tutorials, interactive step-by-step ingredient checkboxes, 5-star rating widget, expandable nutrition/equipment accordions, and custom user notes.

### View 4: Flavor Profile Synergy Matcher (Fan-Specific Interactive Feature)
- **Purpose:** Food chemistry simulator allowing users to test ingredient compatibility.
- **Key Components:** Dual dropdown ingredient selectors, dynamic synergy match score (0–100%), flavor note breakdown (acid, umami, sweet, spice), and culinary pairing advice.

### View 5: Custom Cookbook Studio (Primary CRUD View)
- **Purpose:** Protected workspace for authenticated users to create, view, edit, and delete custom recipe collections.
- **Key Components:** "Create New Collection" modal, list of saved cookbooks, recipe addition/removal controls, privacy toggles, and deletion confirmation dialogs.

---

## 4. Primary CRUD Entity Specification

The primary entity managing persistent user data is the **Custom Cookbook Collection** (cookbooks table):

- **Create (C):** Authenticated users can create new custom cookbooks with a title, description, category tag, cover image, and initial recipe selections.
- **Read (R):** Users can view their personal saved cookbooks on View 5 and explore featured public collections.
- **Update (U):** Users can edit cookbook names, update descriptions, add new recipes, or remove existing recipes from collections.
- **Delete (D):** Users can delete unwanted cookbooks, automatically removing relational references while maintaining database integrity.

---

## 5. 10 Custom Features Mapping Matrix

| Feature # | Feature Name | View Location & Implementation Details |
|-----------|--------------|----------------------------------------|
| #1 | Search Bar | Header bar and Directory (View 2) search box for matching recipe titles or ingredients. |
| #2 | Category Filters | Filter buttons on View 2 to sort recipes by cuisine (e.g., Italian, Asian, Mexican). |
| #4 | Favorites Button | Clickable heart icons on recipe cards that save items to the user's profile. |
| #5 | Rating System | Interactive 5-star rating component on View 3 updating database recipe averages. |
| #8 | Embedded Video Player | Responsive YouTube iFrame on View 3 for culinary technique guides. |
| #9 | Dark/Light Mode | Persistent global theme toggle switch in the navbar for low-light kitchen reading. |
| #11 | Random Item Generator | "Recipe Roulette" button on View 1 fetching and displaying a random database recipe. |
| #23 | Personal Notes | Text input field on View 3 allowing users to save custom recipe tweaks per dish. |
| #24 | Expandable Sections | Accordion panels on View 3 for toggling equipment lists and nutritional info. |
| #40 | Collection Checklist | Interactive ingredient checklist with strike-through toggles on View 3. |

---

## 6. Database Schema Design (SQL Reference)

```sql
-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Recipes Table (Catalog Data & Seed Entries)
CREATE TABLE recipes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(150) NOT NULL,
    cuisine VARCHAR(50) NOT NULL,
    difficulty VARCHAR(20) CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
    prep_time_mins INT NOT NULL,
    video_url TEXT,
    ingredients JSONB NOT NULL,
    instructions JSONB NOT NULL,
    average_rating NUMERIC(3,2) DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Custom Cookbooks Table (Primary CRUD Entity)
CREATE TABLE cookbooks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Cookbook Recipes Junction Table
CREATE TABLE cookbook_recipes (
    cookbook_id UUID REFERENCES cookbooks(id) ON DELETE CASCADE,
    recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
    PRIMARY KEY (cookbook_id, recipe_id)
);

-- User Personal Recipe Notes Table
CREATE TABLE user_recipe_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
    note_text TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, recipe_id)
);
```

---

## 7. Authentic Seed Content (8 Domain Entries)

1. **Neapolitan Margherita Pizza** (Italian | Easy | 25 mins): High-hydration dough, San Marzano tomato sauce, fresh mozzarella, and fresh basil leaves.

2. **Classic French Beef Bourguignon** (French | Hard | 180 mins): Tender braised beef chuck, red wine reduction broth, pearl onions, and sautéed mushrooms.

3. **Authentic Thai Green Curry** (Thai | Medium | 45 mins): Homemade green curry paste, coconut milk, bamboo shoots, chicken breast, and Thai basil.

4. **Traditional Mexican Mole Poblano** (Mexican | Hard | 120 mins): Complex multi-chili blend sauce, dark Mexican chocolate, warm spices, and poached chicken.

5. **Japanese Tonkotsu Ramen** (Japanese | Hard | 240 mins): Rich 12-hour pork bone broth, tare seasoning, tender chashu pork belly, and ajitama soft-boiled egg.

6. **Indian Butter Chicken (Murgh Makhani)** (Indian | Medium | 50 mins): Spiced yogurt-marinated chicken served in a velvety tomato, cream, and butter gravy.

7. **Spanish Seafood Paella** (Spanish | Medium | 60 mins): Saffron-infused Calasparra rice, fresh shrimp, mussels, squid, and a savory garlic sofrito base.

8. **Handmade Tuscan Tagliatelle Bolognese** (Italian | Medium | 90 mins): Fresh egg pasta noodles paired with a slow-cooked pork & beef ragù, finished with Parmigiano-Reggiano.

---

## 8. Validation, Quality Control & GitHub-to-Replit Workflow

**Client & Server Validation:** Client-side form checking via React Hook Form / Zod and server-side validation on API route submissions.

**User Feedback UI:** Success toast popups (e.g., "Cookbook created successfully!"), clear error banners for invalid logins, and descriptive empty states when search queries yield zero results.

**Responsive Design:** Visual parity across 320px mobile screens, 768px tablet viewports, and 1200px+ desktop displays.

**Deployment Workflow:**
1. Commit SPECIFICATION.md and app codebase into a public GitHub repository.
2. Import the GitHub repository directly into Replit.
3. Run live previews in Replit and use `git pull origin main` in the Replit terminal to pull down updates pushed from GitHub or Mistral.
