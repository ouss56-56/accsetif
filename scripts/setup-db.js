import pg from 'pg';
const { Client } = pg;

const connectionString = 'postgresql://postgres.vkfiisccvzchaotovjmj:Oo123456789..5656@aws-1-eu-west-1.pooler.supabase.com:5432/postgres';

const sql = `
-- Create custom types
DO $$ BEGIN
    CREATE TYPE product_status AS ENUM ('active', 'draft', 'out_of_stock');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE order_status AS ENUM ('new', 'processing', 'shipped', 'delivered', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create categories
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  icon TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create products
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  original_price NUMERIC(10, 2),
  image_url TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  stock INTEGER DEFAULT 0,
  status product_status DEFAULT 'active',
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create orders
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT,
  status order_status DEFAULT 'new',
  total_amount NUMERIC(10, 2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create order items
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL,
  price_at_purchase NUMERIC(10, 2) NOT NULL
);

-- Create profiles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  role TEXT DEFAULT 'customer',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies (Drop existing if they exist to avoid errors)
DO $$ BEGIN
    DROP POLICY IF EXISTS "Public read categories" ON categories;
    DROP POLICY IF EXISTS "Admin CRUD categories" ON categories;
    DROP POLICY IF EXISTS "Public read products" ON products;
    DROP POLICY IF EXISTS "Admin CRUD products" ON products;
    DROP POLICY IF EXISTS "Admin CRUD orders" ON orders;
    DROP POLICY IF EXISTS "Customer insert orders" ON orders;
    DROP POLICY IF EXISTS "Admin CRUD order_items" ON order_items;
    DROP POLICY IF EXISTS "Customer insert order_items" ON order_items;
    DROP POLICY IF EXISTS "Admin read all profiles" ON profiles;
    DROP POLICY IF EXISTS "User read own profile" ON profiles;
EXCEPTION
    WHEN undefined_object THEN null;
END $$;

CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Admin CRUD categories" ON categories FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Admin CRUD products" ON products FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

CREATE POLICY "Admin CRUD orders" ON orders FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);
CREATE POLICY "Customer insert orders" ON orders FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin CRUD order_items" ON order_items FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);
CREATE POLICY "Customer insert order_items" ON order_items FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin read all profiles" ON profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);
CREATE POLICY "User read own profile" ON profiles FOR SELECT USING (auth.uid() = id);

-- Function to handle new user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (new.id, new.email, 'customer');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
`;

async function main() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log('Connected to database');
    await client.query(sql);
    console.log('Schema created successfully');
    
    // Seed initial categories
    const categories = [
      ['Watches', '⌚', 'Precision timepieces for the discerning collector'],
      ['Necklaces', '📿', 'Elegant chains and pendants that captivate'],
      ['Bracelets', '💎', 'Wrist adornments that speak volumes'],
      ['Sets', '✨', 'Curated collections for a complete look']
    ];
    
    for (const [name, icon, desc] of categories) {
      await client.query(
        'INSERT INTO categories (name, icon, description) VALUES ($1, $2, $3) ON CONFLICT (name) DO NOTHING',
        [name, icon, desc]
      );
    }
    console.log('Categories seeded successfully');

  } catch (err) {
    console.error('Error executing SQL', err);
  } finally {
    await client.end();
  }
}

main();
