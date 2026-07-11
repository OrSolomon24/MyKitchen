// One-off Mongo -> Supabase migration.
//
// Dedupes the "one Dish document per category" bug back into a single
// dish row + dish_categories links, splits ingredients/instruction into
// dish_ingredients/dish_steps rows, and re-uploads Cloudinary images into
// Supabase Storage.
//
// Safe to re-run: it truncates dishes/categories (cascades clean up all
// children/links) before repopulating from the current Mongo state. Note:
// old Storage objects from a previous run are NOT deleted automatically
// (new dish ids -> new storage paths each run), so if you re-run this
// more than once, clear the `dish-images` bucket manually in the
// dashboard first to avoid orphaned files eating into the free-tier quota.
require('dotenv').config({ path: require('path').join(__dirname, '../server/.env') });
const mongoose = require('mongoose');
const crypto = require('crypto');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const MONGODB_URI = process.env.MONGODB_URI;

if (!SUPABASE_URL || !SERVICE_KEY || !MONGODB_URI) {
  console.error('Missing SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, or MONGODB_URI in server/.env');
  process.exit(1);
}

const sbHeaders = {
  apikey: SERVICE_KEY,
  Authorization: `Bearer ${SERVICE_KEY}`,
  'Content-Type': 'application/json',
};

async function sbInsert(table, rows, { returnRepresentation = true } = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: { ...sbHeaders, Prefer: returnRepresentation ? 'return=representation' : 'return=minimal' },
    body: JSON.stringify(rows),
  });
  if (!res.ok) {
    throw new Error(`Insert into ${table} failed (${res.status}): ${await res.text()}`);
  }
  return returnRepresentation ? res.json() : null;
}

async function sbDeleteAll(table, pkCol = 'id') {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${pkCol}=not.is.null`, {
    method: 'DELETE',
    headers: { ...sbHeaders, Prefer: 'return=minimal' },
  });
  if (!res.ok) {
    throw new Error(`Delete all from ${table} failed (${res.status}): ${await res.text()}`);
  }
}

async function sbCount(table) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=id`, {
    headers: { ...sbHeaders, Prefer: 'count=exact' },
  });
  const range = res.headers.get('content-range');
  return range ? parseInt(range.split('/')[1], 10) : null;
}

async function uploadImageToStorage(dishId, imageUrl, position) {
  const res = await fetch(imageUrl);
  if (!res.ok) throw new Error(`Failed to fetch image ${imageUrl}: ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  const contentType = res.headers.get('content-type') || 'image/jpeg';
  const ext = contentType.split('/')[1]?.split(';')[0] || 'jpg';
  const path = `recipes/${dishId}/${crypto.randomUUID()}.${ext}`;

  const uploadRes = await fetch(`${SUPABASE_URL}/storage/v1/object/dish-images/${path}`, {
    method: 'POST',
    headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, 'Content-Type': contentType },
    body: buffer,
  });
  if (!uploadRes.ok) {
    throw new Error(`Storage upload failed for ${path} (${uploadRes.status}): ${await uploadRes.text()}`);
  }
  return path;
}

function normKey(dish) {
  return [
    (dish.name || '').trim(),
    (dish.description || '').trim(),
    (dish.url || '').trim(),
    JSON.stringify((dish.ingredients || []).map((s) => String(s).trim())),
    (dish.instruction || '').trim(),
  ].join('|');
}

async function main() {
  console.log('Connecting to Mongo...');
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;

  const mongoCategories = await db.collection('foodCategories').find().toArray();
  const mongoDishes = await db.collection('dishes').find().toArray();
  console.log(`Mongo: ${mongoCategories.length} categories, ${mongoDishes.length} dish docs (pre-dedup)`);

  console.log('Clearing existing Supabase rows (dishes cascade, then categories)...');
  await sbDeleteAll('dishes');
  await sbDeleteAll('categories');

  const categoryIdMap = new Map();
  for (const cat of mongoCategories) {
    const [inserted] = await sbInsert('categories', [{ name: cat.name }]);
    categoryIdMap.set(cat.id, inserted.id);
  }
  console.log(`Inserted ${categoryIdMap.size} categories`);

  const groups = new Map();
  for (const dish of mongoDishes) {
    const key = normKey(dish);
    if (!groups.has(key)) groups.set(key, { representative: dish, categoryIds: new Set(), imageGroups: [] });
    const group = groups.get(key);
    if (dish.categoryid != null) group.categoryIds.add(dish.categoryid);
    if (Array.isArray(dish.images) && dish.images.length > 0) group.imageGroups.push(dish.images);
  }
  console.log(`Deduped into ${groups.size} unique dishes (from ${mongoDishes.length} docs)`);

  for (const group of groups.values()) {
    if (group.imageGroups.length > 1) {
      console.log(`  [review] "${group.representative.name}" had images on ${group.imageGroups.length} duplicates — unioning all`);
    }
  }

  let dishCount = 0;
  let imageCount = 0;
  let skippedCategoryRefs = 0;

  for (const group of groups.values()) {
    const d = group.representative;
    const categoryUuids = [...group.categoryIds].map((legacyId) => categoryIdMap.get(legacyId)).filter(Boolean);
    skippedCategoryRefs += group.categoryIds.size - categoryUuids.length;

    const ingredients = (d.ingredients || []).map((s) => String(s).trim()).filter(Boolean);
    const steps = (d.instruction || '').split('\n').map((s) => s.trim()).filter(Boolean);

    const rpcRes = await fetch(`${SUPABASE_URL}/rest/v1/rpc/create_dish_with_relations`, {
      method: 'POST',
      headers: sbHeaders,
      body: JSON.stringify({
        p_name: d.name,
        p_description: d.description || null,
        p_source_url: d.url || null,
        p_category_ids: categoryUuids,
        p_ingredients: ingredients,
        p_steps: steps,
        p_created_by: null,
      }),
    });
    if (!rpcRes.ok) {
      throw new Error(`create_dish_with_relations failed for "${d.name}" (${rpcRes.status}): ${await rpcRes.text()}`);
    }
    const newDishId = await rpcRes.json();
    dishCount++;

    const allImages = group.imageGroups.flat();
    let position = 0;
    for (const img of allImages) {
      if (!img.url) continue;
      try {
        const path = await uploadImageToStorage(newDishId, img.url, position);
        await sbInsert('dish_images', [{ dish_id: newDishId, storage_path: path, position }], { returnRepresentation: false });
        imageCount++;
        position++;
      } catch (err) {
        console.error(`  [image error] "${d.name}": ${err.message}`);
      }
    }
  }

  console.log(`\nDone. Inserted ${dishCount} dishes, ${imageCount} images.`);
  if (skippedCategoryRefs > 0) {
    console.log(`Warning: ${skippedCategoryRefs} category reference(s) couldn't be mapped (dangling categoryid).`);
  }

  const [finalDishCount, finalCategoryCount, finalImageCount] = await Promise.all([
    sbCount('dishes'),
    sbCount('categories'),
    sbCount('dish_images'),
  ]);
  console.log(`Verification: dishes=${finalDishCount}, categories=${finalCategoryCount}, images=${finalImageCount}`);

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
