import pg from 'pg';
const { Client } = pg;

const connectionString = 'postgresql://postgres.vkfiisccvzchaotovjmj:Oo123456789..5656@aws-1-eu-west-1.pooler.supabase.com:5432/postgres';

async function main() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log('Connected to database');

    const sql = `
      -- Insert storage bucket for products
      INSERT INTO storage.buckets (id, name, public)
      VALUES ('products', 'products', true)
      ON CONFLICT (id) DO NOTHING;

      -- Allow public access to product images
      DROP POLICY IF EXISTS "Public Access" ON storage.objects;
      CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'products');

      -- Allow authenticated users to upload product images using the security definer function
      DROP POLICY IF EXISTS "Admin Uploads" ON storage.objects;
      CREATE POLICY "Admin Uploads" ON storage.objects FOR INSERT WITH CHECK (
        bucket_id = 'products' AND public.is_admin()
      );
      
      -- Allow admin to delete
      DROP POLICY IF EXISTS "Admin Deletes" ON storage.objects;
      CREATE POLICY "Admin Deletes" ON storage.objects FOR DELETE USING (
        bucket_id = 'products' AND public.is_admin()
      );

      -- Allow admin to update
      DROP POLICY IF EXISTS "Admin Updates" ON storage.objects;
      CREATE POLICY "Admin Updates" ON storage.objects FOR UPDATE USING (
        bucket_id = 'products' AND public.is_admin()
      );
    `;

    await client.query(sql);
    console.log('Storage bucket and policies configured with is_admin()');

  } catch (err) {
    console.error('Error configuring storage', err);
  } finally {
    await client.end();
  }
}

main();
