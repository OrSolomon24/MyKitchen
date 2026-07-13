const supabase = require('./supabaseClient');

// Categories are private per user; the dish RPCs trust the category ids
// they're given, so routes must reject ids the requester doesn't own
// before linking them to a dish.
async function allCategoriesOwnedBy(categoryIds, userId) {
  const unique = [...new Set(categoryIds || [])];
  if (unique.length === 0) return true;

  const { data, error } = await supabase
    .from('categories')
    .select('id')
    .in('id', unique)
    .eq('created_by', userId);
  if (error) throw error;
  return data.length === unique.length;
}

module.exports = { allCategoriesOwnedBy };
