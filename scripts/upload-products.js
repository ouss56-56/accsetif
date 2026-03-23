// scripts/upload-products.js
// Run from project root: node scripts/upload-products.js

import { createClient } from "@supabase/supabase-js";
import { readFileSync, readdirSync } from "fs";
import { join, extname } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { readFile } from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read .env manually
const envPath = join(__dirname, "../.env");
let envContent = "";
try {
  envContent = readFileSync(envPath, "utf-8");
} catch {
  console.error("❌ Could not read .env file.");
  process.exit(1);
}

const getEnv = (key) => {
  const match = envContent.match(new RegExp(`^${key}=(.+)$`, "m"));
  return match ? match[1].trim() : null;
};

const SUPABASE_URL = getEnv("VITE_SUPABASE_URL");
const SUPABASE_KEY = getEnv("VITE_SUPABASE_ANON_KEY");

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("❌ Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Sign in as admin to get elevated privileges for storage
async function signInAdmin() {
  const { error } = await supabase.auth.signInWithPassword({
    email: "admin@gmail.com",
    password: "00000000",
  });
  if (error) throw new Error(`Admin sign-in failed: ${error.message}`);
  console.log("🔑 Signed in as admin\n");
}

const IMAGE_DIR = `C:/Users/fares/Desktop/dark-gems-emporium-main/WhatsApp Unknown 2026-03-23 at 15.00.44`;

const productMetadata = [
  {
    name: "Éclat Pearl Drop Earrings",
    description: "Timeless elegance meets modern sophistication. These lustrous pearl drop earrings are handcrafted with sterling silver settings that frame each pearl perfectly.",
    price: 149.99,
    original_price: 199.99,
    category: "Fine Jewelry",
    featured: true,
  },
  {
    name: "Serpentine Gold Necklace",
    description: "A statement piece inspired by the fluid grace of nature. This 18K gold-plated necklace features an intricate serpentine chain that catches every light.",
    price: 289.99,
    original_price: null,
    category: "Fine Jewelry",
    featured: true,
  },
  {
    name: "Cascade Diamond Ring",
    description: "Evoking the beauty of flowing water, this ring features cascading crystals set in a lustrous band. Perfect for both everyday elegance and special occasions.",
    price: 399.99,
    original_price: 499.99,
    category: "Rare Gems",
    featured: true,
  },
  {
    name: "Onyx Luxury Bracelet",
    description: "A bold fusion of dark onyx beads and brushed gold accents. This premium bracelet commands attention with its striking contrast and refined finish.",
    price: 179.99,
    original_price: null,
    category: "Fine Jewelry",
    featured: false,
  },
  {
    name: "Royal Chronograph Watch",
    description: "Precision engineering meets artisanal craftsmanship. This chronograph timepiece features a sapphire crystal face, genuine leather strap, and Swiss movement.",
    price: 849.99,
    original_price: 999.99,
    category: "Luxury Watches",
    featured: true,
  },
  {
    name: "Celestial Gem Pendant",
    description: "A celestial-inspired pendant featuring a central gemstone surrounded by delicate star-shaped accents. Set in white gold with brilliant-cut diamonds.",
    price: 549.99,
    original_price: null,
    category: "Rare Gems",
    featured: false,
  },
  {
    name: "Bespoke Gold Chain Set",
    description: "A curated set of hand-linked gold chains in varying thicknesses. Layer them for a bold statement or wear individually for understated luxury.",
    price: 329.99,
    original_price: 399.99,
    category: "Bespoke",
    featured: false,
  },
];

async function getOrCreateCategory(name) {
  const { data } = await supabase
    .from("categories")
    .select("id")
    .eq("name", name)
    .maybeSingle();

  if (data) return data.id;

  const { data: newCat, error } = await supabase
    .from("categories")
    .insert([{ name, description: `${name} collection` }])
    .select("id")
    .single();

  if (error) throw new Error(`Category insert failed: ${error.message}`);
  return newCat.id;
}

async function run() {
  console.log("🚀 Starting product upload...\n");

  // Sign in as admin to get storage write access
  await signInAdmin();

  const allFiles = readdirSync(IMAGE_DIR);
  const files = allFiles
    .filter((f) => [".jpg", ".jpeg", ".png", ".webp"].includes(extname(f).toLowerCase()))
    .sort();

  if (files.length === 0) {
    console.error("❌ No image files found in:", IMAGE_DIR);
    process.exit(1);
  }

  console.log(`📁 Found ${files.length} images:`);
  files.forEach((f, i) => console.log(`  ${i + 1}. ${f}`));
  console.log();

  let successCount = 0;

  for (let i = 0; i < Math.min(files.length, productMetadata.length); i++) {
    const file = files[i];
    const meta = productMetadata[i];
    const filePath = join(IMAGE_DIR, file);

    console.log(`⬆️  [${i + 1}/${files.length}] Uploading: ${file}`);

    const fileBuffer = await readFile(filePath);
    const safeFilename = file.replace(/\s/g, "_").replace(/[()]/g, "");
    const storagePath = `products/${Date.now()}-${i}-${safeFilename}`;

    const { error: uploadError } = await supabase.storage
      .from("products")
      .upload(storagePath, fileBuffer, {
        contentType: "image/jpeg",
        upsert: true,
      });

    if (uploadError) {
      console.error(`  ❌ Upload failed: ${uploadError.message}`);
      continue;
    }

    const { data: urlData } = supabase.storage
      .from("products")
      .getPublicUrl(storagePath);

    const imageUrl = urlData.publicUrl;

    const categoryId = await getOrCreateCategory(meta.category);

    const { error: insertError } = await supabase.from("products").insert([{
      name: meta.name,
      description: meta.description,
      price: meta.price,
      original_price: meta.original_price,
      category_id: categoryId,
      image_url: imageUrl,
      stock: 15,
      featured: meta.featured,
      status: "active",
    }]);

    if (insertError) {
      console.error(`  ❌ Insert failed: ${insertError.message}`);
      continue;
    }

    console.log(`  ✅ Uploaded: "${meta.name}" — $${meta.price}`);
    successCount++;

    // Small delay to avoid rate limits
    await new Promise((r) => setTimeout(r, 200));
  }

  console.log(`\n✨ Done! ${successCount}/${files.length} products uploaded successfully.`);
}

run().catch(console.error);
