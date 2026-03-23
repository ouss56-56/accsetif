import pg from 'pg';
const { Client } = pg;

const connectionString = 'postgresql://postgres.vkfiisccvzchaotovjmj:Oo123456789..5656@aws-1-eu-west-1.pooler.supabase.com:5432/postgres';

const sql = `
-- Create a security definer function to check if the user is an admin
-- This avoids RLS recursion by running with the privileges of the creator
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update table policies to use the new function
DROP POLICY IF EXISTS "Admin CRUD categories" ON categories;
CREATE POLICY "Admin CRUD categories" ON categories FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Admin CRUD products" ON products;
CREATE POLICY "Admin CRUD products" ON products FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Admin CRUD orders" ON orders;
CREATE POLICY "Admin CRUD orders" ON orders FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Admin CRUD order_items" ON order_items;
CREATE POLICY "Admin CRUD order_items" ON order_items FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Admin read all profiles" ON profiles;
CREATE POLICY "Admin read all profiles" ON profiles FOR SELECT USING (public.is_admin());
`;

async function main() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log('Connected to database');
    await client.query(sql);
    console.log('RLS fix applied successfully (is_admin function created)');
  } catch (err) {
    console.error('Error applying RLS fix', err);
  } finally {
    await client.end();
  }
}

main();
