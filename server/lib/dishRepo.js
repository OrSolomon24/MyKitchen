const supabase = require('./supabaseClient');

const DISH_SELECT = `
  id, name, description, source_url, created_at, updated_at,
  dish_categories(category_id),
  dish_ingredients(id, position, raw_text),
  dish_steps(id, position, text),
  dish_images(id, storage_path, position)
`;

// List view never renders ingredients/steps, so skip those joins entirely
// to cut payload size and DB work for the endpoint hit on every page load.
const DISH_LIST_SELECT = `
  id, name, description, source_url, created_at, updated_at,
  dish_categories(category_id),
  dish_images(id, storage_path, position)
`;

function toPublicUrl(storagePath) {
  return supabase.storage.from('dish-images').getPublicUrl(storagePath).data.publicUrl;
}

function shapeImages(row) {
  return (row.dish_images || [])
    .sort((a, b) => a.position - b.position)
    .map((img) => ({ id: img.id, url: toPublicUrl(img.storage_path) }));
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
    images: shapeImages(row),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function shapeDishListItem(row) {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    sourceUrl: row.source_url,
    categoryIds: (row.dish_categories || []).map((c) => c.category_id),
    images: shapeImages(row),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// Every read is scoped to the owning user: the server uses the
// service-role key (bypasses RLS), so this filter is what keeps one
// family member's recipes invisible to another.
async function fetchDishById(id, userId) {
  const { data, error } = await supabase
    .from('dishes')
    .select(DISH_SELECT)
    .eq('id', id)
    .eq('created_by', userId)
    .single();
  if (error || !data) return null;
  return shapeDish(data);
}

async function fetchDishListView(userId) {
  const { data, error } = await supabase
    .from('dishes')
    .select(DISH_LIST_SELECT)
    .eq('created_by', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data.map(shapeDishListItem);
}

module.exports = { shapeDish, fetchDishById, fetchDishListView, toPublicUrl };
