-- SQLite3 Schema for Atelier Decoupled E-Commerce Backend

-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  sku TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  tagline TEXT,
  price REAL NOT NULL,
  original_price REAL,
  rating REAL DEFAULT 5.0,
  review_count INTEGER DEFAULT 0,
  category TEXT NOT NULL,
  tags TEXT, -- JSON Array string: ["Bestseller", "New Drop"]
  description TEXT,
  details TEXT, -- JSON Array string
  composition TEXT,
  care_instructions TEXT, -- JSON Array string
  images TEXT, -- JSON Object string: { "front": "...", "model": "...", "gallery": [...] }
  colors TEXT, -- JSON Array string: [{ "name": "...", "hex": "...", "image": "..." }]
  sizes TEXT, -- JSON Array string: [{ "size": "M", "stock": 5 }]
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  order_id TEXT PRIMARY KEY,
  tracking_number TEXT,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  customer_address TEXT NOT NULL,
  customer_city TEXT NOT NULL,
  customer_postal_code TEXT,
  customer_country TEXT,
  delivery_option TEXT DEFAULT 'standard',
  payment_method TEXT DEFAULT 'card',
  subtotal REAL NOT NULL,
  discount REAL DEFAULT 0,
  shipping REAL DEFAULT 0,
  tax REAL DEFAULT 0,
  total REAL NOT NULL,
  status TEXT DEFAULT 'Confirmed',
  estimated_delivery TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  name TEXT NOT NULL,
  price REAL NOT NULL,
  selected_color TEXT,
  selected_size TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  image TEXT,
  FOREIGN KEY (order_id) REFERENCES orders (order_id) ON DELETE CASCADE
);

-- Coupons Table
CREATE TABLE IF NOT EXISTS coupons (
  code TEXT PRIMARY KEY,
  discount_percent INTEGER NOT NULL,
  description TEXT,
  is_active INTEGER DEFAULT 1
);

-- User Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY DEFAULT 'default-user',
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  tier TEXT,
  member_since TEXT,
  avatar TEXT,
  addresses TEXT, -- JSON array of addresses
  payment_methods TEXT, -- JSON array of payment cards
  preferences TEXT, -- JSON object of fit and notification preferences
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
