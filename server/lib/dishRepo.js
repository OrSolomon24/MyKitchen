const supabase = require('./supabaseClient');

const DISH_SELECT = `
  id, name, description, source_url, created_at, updated_at,
  dish_categories(category_id),
  dish_ingredients(id, position, raw_text),
  dish_steps(id, position, text),
  dish_images(id, storage_path, position)
`;

function toPublicUrl(storagePath) {
  return supabase.storage.from('dish-images').getPublicUrl(storagePath).data.publicUrl;
}

function shapeDish(row) {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    sourceUrl: row.source_url,
    categoryIds: (row.dish_categories || []).map((c) => c.category_id),
    ingredients: (row.dish_ingredients || [])
      .sort((a, b) => a.position - b.position)
      .map((i) => i.raw_text),
    steps: (row.dish_steps || [])
      .sort((a, b) => a.position - b.position)
      .map((s) => s.text),
    images: (row.dish_images || [])
      .sort((a, b) => a.position - b.position)
      .map((img) => ({ id: img.id, url: toPublicUrl(img.storage_path) })),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function fetchDishById(id) {
  const { data, error } = await supabase.from('dishes').select(DISH_SELECT).eq('id', id).single();
  if (error || !data) return null;
  return shapeDish(data);
}

async function fetchAllDishes() {
  const { data, error } = await supabase
    .from('dishes')
    .select(DISH_SELECT)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data.map(shapeDish);
}

module.exports = { shapeDish, fetchDishById, fetchAllDishes, toPublicUrl };
