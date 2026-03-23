import pg from 'pg';
const { Client } = pg;

const connectionString = 'postgresql://postgres.vkfiisccvzchaotovjmj:Oo123456789..5656@aws-1-eu-west-1.pooler.supabase.com:5432/postgres';

const adminEmail = 'admin@gmail.com';
const adminPassword = '00000000';

async function main() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log('Connected to database');

    // Enable pgcrypto if not already enabled
    await client.query('CREATE EXTENSION IF NOT EXISTS pgcrypto');

    // Check if user already exists
    const res = await client.query('SELECT id FROM auth.users WHERE email = $1', [adminEmail]);
    
    if (res.rows.length > 0) {
      console.log('Admin user already exists');
      const userId = res.rows[0].id;
      // Ensure profile is admin
      await client.query('UPDATE public.profiles SET role = $1 WHERE id = $2', ['admin', userId]);
      console.log('Profile updated to admin');
      return;
    }

    // Insert user into auth.users manually
    // We use crypt from pgcrypto to hash the password
    // Supabase uses a specific format for auth.users
    const insertUserSql = `
      INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        recovery_sent_at,
        last_sign_in_at,
        raw_app_meta_data,
        raw_user_meta_data,
        is_super_admin,
        created_at,
        updated_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token
      )
      VALUES (
        '00000000-0000-0000-0000-000000000000',
        gen_random_uuid(),
        'authenticated',
        'authenticated',
        $1,
        crypt($2, gen_salt('bf')),
        now(),
        NULL,
        now(),
        '{"provider":"email","providers":["email"]}',
        '{}',
        false,
        now(),
        now(),
        '',
        '',
        '',
        ''
      )
      RETURNING id;
    `;

    const insertRes = await client.query(insertUserSql, [adminEmail, adminPassword]);
    const newUserId = insertRes.rows[0].id;
    console.log('Admin user created in auth.users:', newUserId);

    // Profile trigger should have handled public.profiles, but let's be sure and set the role to admin
    // Wait for a second for the trigger to fire
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await client.query('UPDATE public.profiles SET role = $1 WHERE id = $2', ['admin', newUserId]);
    console.log('Profile updated to admin');

  } catch (err) {
    console.error('Error creating admin', err);
  } finally {
    await client.end();
  }
}

main();
