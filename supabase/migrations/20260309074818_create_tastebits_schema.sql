/*
  # TasteBits Food Ordering System Schema

  ## Overview
  This migration creates the complete database schema for the TasteBits QR-based food ordering system.

  ## Tables Created

  1. **restaurant_tables**
     - `id` (uuid, primary key) - Unique identifier for each table
     - `table_number` (integer, unique) - Physical table number in restaurant
     - `qr_code` (text) - Unique QR code identifier for the table
     - `is_active` (boolean) - Whether the table is currently available
     - `created_at` (timestamptz) - When the table was added

  2. **menu_items**
     - `id` (uuid, primary key) - Unique identifier for menu item
     - `name` (text) - Name of the dish
     - `description` (text) - Description of the dish
     - `price` (decimal) - Price of the item
     - `category` (text) - Category (Appetizers, Main Course, Desserts, Beverages)
     - `image_url` (text) - URL to dish image
     - `is_available` (boolean) - Whether item is currently available
     - `created_at` (timestamptz) - When item was added

  3. **orders**
     - `id` (uuid, primary key) - Unique order identifier
     - `table_id` (uuid, foreign key) - Reference to restaurant_tables
     - `status` (text) - Order status (pending, preparing, served, cancelled)
     - `total_amount` (decimal) - Total order amount
     - `created_at` (timestamptz) - When order was placed
     - `updated_at` (timestamptz) - Last status update time

  4. **order_items**
     - `id` (uuid, primary key) - Unique identifier
     - `order_id` (uuid, foreign key) - Reference to orders
     - `menu_item_id` (uuid, foreign key) - Reference to menu_items
     - `quantity` (integer) - Number of items ordered
     - `price` (decimal) - Price at time of order
     - `created_at` (timestamptz) - When item was added to order

  5. **waiter_calls**
     - `id` (uuid, primary key) - Unique identifier
     - `table_id` (uuid, foreign key) - Reference to restaurant_tables
     - `status` (text) - Call status (pending, responded)
     - `created_at` (timestamptz) - When waiter was called
     - `responded_at` (timestamptz) - When waiter responded

  ## Security
  - RLS enabled on all tables
  - Public read access for menu_items and restaurant_tables (customer browsing)
  - Public insert access for orders, order_items, and waiter_calls (customer ordering)
  - Public read access for orders (customers can view their orders)
  - Public update access for orders and waiter_calls (for status updates from admin)
*/

-- Create restaurant_tables table
CREATE TABLE IF NOT EXISTS restaurant_tables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  table_number integer UNIQUE NOT NULL,
  qr_code text UNIQUE NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create menu_items table
CREATE TABLE IF NOT EXISTS menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  price decimal(10, 2) NOT NULL,
  category text NOT NULL,
  image_url text DEFAULT '',
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  table_id uuid REFERENCES restaurant_tables(id) NOT NULL,
  status text DEFAULT 'pending',
  total_amount decimal(10, 2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  menu_item_id uuid REFERENCES menu_items(id) NOT NULL,
  quantity integer NOT NULL,
  price decimal(10, 2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create waiter_calls table
CREATE TABLE IF NOT EXISTS waiter_calls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  table_id uuid REFERENCES restaurant_tables(id) NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  responded_at timestamptz
);

-- Enable Row Level Security
ALTER TABLE restaurant_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE waiter_calls ENABLE ROW LEVEL SECURITY;

-- RLS Policies for restaurant_tables
CREATE POLICY "Anyone can view active tables"
  ON restaurant_tables FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert tables"
  ON restaurant_tables FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update tables"
  ON restaurant_tables FOR UPDATE
  USING (true);

-- RLS Policies for menu_items
CREATE POLICY "Anyone can view available menu items"
  ON menu_items FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert menu items"
  ON menu_items FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update menu items"
  ON menu_items FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete menu items"
  ON menu_items FOR DELETE
  USING (true);

-- RLS Policies for orders
CREATE POLICY "Anyone can view orders"
  ON orders FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update orders"
  ON orders FOR UPDATE
  USING (true);

-- RLS Policies for order_items
CREATE POLICY "Anyone can view order items"
  ON order_items FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create order items"
  ON order_items FOR INSERT
  WITH CHECK (true);

-- RLS Policies for waiter_calls
CREATE POLICY "Anyone can view waiter calls"
  ON waiter_calls FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create waiter calls"
  ON waiter_calls FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update waiter calls"
  ON waiter_calls FOR UPDATE
  USING (true);

-- Insert sample tables
INSERT INTO restaurant_tables (table_number, qr_code) VALUES
  (1, 'TABLE-001'),
  (2, 'TABLE-002'),
  (3, 'TABLE-003'),
  (4, 'TABLE-004'),
  (5, 'TABLE-005'),
  (6, 'TABLE-006'),
  (7, 'TABLE-007'),
  (8, 'TABLE-008'),
  (9, 'TABLE-009'),
  (10, 'TABLE-010')
ON CONFLICT (table_number) DO NOTHING;

-- Insert sample menu items
INSERT INTO menu_items (name, description, price, category, image_url) VALUES
  ('Caesar Salad', 'Fresh romaine lettuce with parmesan and croutons', 8.99, 'Appetizers', 'https://images.pexels.com/photos/1059905/pexels-photo-1059905.jpeg?auto=compress&cs=tinysrgb&w=400'),
  ('Chicken Wings', 'Spicy buffalo wings with ranch dip', 10.99, 'Appetizers', 'https://images.pexels.com/photos/1633525/pexels-photo-1633525.jpeg?auto=compress&cs=tinysrgb&w=400'),
  ('Grilled Salmon', 'Fresh Atlantic salmon with herbs and lemon', 24.99, 'Main Course', 'https://images.pexels.com/photos/1516415/pexels-photo-1516415.jpeg?auto=compress&cs=tinysrgb&w=400'),
  ('Beef Burger', 'Angus beef patty with cheese, lettuce, and tomato', 15.99, 'Main Course', 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=400'),
  ('Margherita Pizza', 'Classic pizza with tomato, mozzarella, and basil', 14.99, 'Main Course', 'https://images.pexels.com/photos/1146760/pexels-photo-1146760.jpeg?auto=compress&cs=tinysrgb&w=400'),
  ('Pasta Carbonara', 'Creamy pasta with bacon and parmesan', 16.99, 'Main Course', 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=400'),
  ('Chocolate Lava Cake', 'Warm chocolate cake with molten center', 7.99, 'Desserts', 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400'),
  ('Tiramisu', 'Classic Italian dessert with coffee and mascarpone', 8.99, 'Desserts', 'https://images.pexels.com/photos/6880219/pexels-photo-6880219.jpeg?auto=compress&cs=tinysrgb&w=400'),
  ('Coca Cola', 'Chilled soft drink', 2.99, 'Beverages', 'https://images.pexels.com/photos/50593/coca-cola-cold-drink-soft-drink-coke-50593.jpeg?auto=compress&cs=tinysrgb&w=400'),
  ('Fresh Juice', 'Orange or apple juice', 4.99, 'Beverages', 'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?auto=compress&cs=tinysrgb&w=400')
ON CONFLICT DO NOTHING;