-- Accio Ceylon Dry Foods Export Database Schema (SQLite)

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  company_name TEXT,
  country TEXT DEFAULT 'Sri Lanka',
  phone TEXT,
  role TEXT DEFAULT 'customer', -- 'customer', 'admin'
  avatar_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  short_desc TEXT,
  moisture_level TEXT DEFAULT '< 10%',
  shelf_life TEXT DEFAULT '24 Months',
  packaging_types TEXT NOT NULL, -- JSON string
  fob_price_usd REAL NOT NULL,
  moq_kg REAL DEFAULT 25,
  origin_region TEXT DEFAULT 'Kurunegala, Sri Lanka',
  certifications TEXT, -- JSON string
  nutrition_facts TEXT, -- JSON string
  images TEXT NOT NULL, -- JSON string
  in_stock INTEGER DEFAULT 1,
  is_featured INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  product_id TEXT,
  author_name TEXT NOT NULL,
  author_country TEXT DEFAULT 'International',
  author_company TEXT,
  rating INTEGER DEFAULT 5,
  title TEXT,
  comment TEXT NOT NULL,
  photo_urls TEXT DEFAULT '[]', -- JSON string
  is_verified INTEGER DEFAULT 1,
  is_featured INTEGER DEFAULT 1,
  status TEXT DEFAULT 'approved', -- 'approved', 'pending', 'rejected'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  tracking_number TEXT UNIQUE NOT NULL,
  user_id TEXT,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_company TEXT,
  customer_phone TEXT,
  destination_country TEXT NOT NULL,
  destination_port TEXT,
  order_type TEXT DEFAULT 'wholesale_fob', -- 'sample', 'wholesale_fob', 'wholesale_cif'
  total_amount REAL DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'Inquiry', -- 'Inquiry', 'Quotation Sent', 'Payment Confirmed', 'Lab Tested', 'Customs Cleared', 'Shipped (Colombo Port)', 'Delivered'
  shipping_method TEXT,
  items_json TEXT NOT NULL,
  incoterms TEXT DEFAULT 'FOB Colombo',
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS chat_rooms (
  id TEXT PRIMARY KEY,
  customer_id TEXT,
  guest_session_id TEXT,
  customer_name TEXT NOT NULL,
  customer_country TEXT DEFAULT 'International',
  customer_company TEXT,
  last_message TEXT,
  last_message_at DATETIME,
  unread_admin_count INTEGER DEFAULT 0,
  unread_customer_count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id TEXT PRIMARY KEY,
  room_id TEXT NOT NULL,
  sender_type TEXT NOT NULL, -- 'customer', 'admin', 'system'
  sender_id TEXT,
  sender_name TEXT,
  message_text TEXT NOT NULL,
  attachments TEXT DEFAULT '[]',
  is_read INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (room_id) REFERENCES chat_rooms(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS company_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  company_name TEXT DEFAULT 'Accio Ceylon (Pvt) Ltd',
  tagline TEXT DEFAULT 'Colombo''s Premier Dehydrated Tropical Fruits & Botanical Infusions Exporter',
  address TEXT DEFAULT 'Port Road, Colombo 01, Sri Lanka',
  phone TEXT DEFAULT '+94 11 258 4930',
  whatsapp TEXT DEFAULT '+94 77 123 4567',
  email TEXT DEFAULT 'export@accio-ceylon.com',
  vessel_notice TEXT DEFAULT 'MSC ANNA (FCL Departure to London Gateway & Hamburg in 48h)',
  export_target_kg REAL DEFAULT 50000,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
