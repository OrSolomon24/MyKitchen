-- MyKitchen multi-user support: each user owns and sees only their own recipes.
-- Run once in the Supabase Dashboard SQL Editor (after 0001_init.sql).

-- ── Backfill ownership ──────────────────────────────────────────────
-- Everything in the app today is Amit's, so hand ALL existing dishes to
-- her account (including any with a stale/null created_by) before reads
-- become owner-scoped. Her account must exist in Supabase Auth first.

update dishes
set created_by = (select id from auth.users where email = 'amit@mykitchen.local');

alter table dishes alter column created_by set not null;

create index if not exists dishes_created_by_idx on dishes (created_by);

-- ── Row Level Security: owner-only dishes ───────────────────────────
-- The Express server uses the service-role key (bypasses RLS) and does
-- its own ownership checks; these policies are defense-in-depth so a
-- family member with the anon key + their JWT still can't touch anyone
-- else's recipes. Categories stay shared across all users.

drop policy if exists "authenticated full access" on dishes;
drop policy if exists "authenticated full access" on dish_categories;
drop policy if exists "authenticated full access" on dish_ingredients;
drop policy if exists "authenticated full access" on dish_steps;
drop policy if exists "authenticated full access" on dish_images;

create policy "owner full access" on dishes
  for all
  using (created_by = auth.uid())
  with check (created_by = auth.uid());

create policy "owner full access via dish" on dish_categories
  for all
  using (exists (select 1 from dishes d where d.id = dish_id and d.created_by = auth.uid()))
  with check (exists (select 1 from dishes d where d.id = dish_id and d.created_by = auth.uid()));

create policy "owner full access via dish" on dish_ingredients
  for all
  using (exists (select 1 from dishes d where d.id = dish_id and d.created_by = auth.uid()))
  with check (exists (select 1 from dishes d where d.id = dish_id and d.created_by = auth.uid()));

create policy "owner full access via dish" on dish_steps
  for all
  using (exists (select 1 from dishes d where d.id = dish_id and d.created_by = auth.uid()))
  with check (exists (select 1 from dishes d where d.id = dish_id and d.created_by = auth.uid()));

create policy "owner full access via dish" on dish_images
  for all
  using (exists (select 1 from dishes d where d.id = dish_id and d.created_by = auth.uid()))
  with check (exists (select 1 from dishes d where d.id = dish_id and d.created_by = auth.uid()));

-- ── Lock down the write RPCs ────────────────────────────────────────
-- Both functions are `security definer` and take ownership as a plain
-- parameter, so an authenticated user calling them directly through
-- PostgREST could write to another user's dish. Only the server (using
-- the service-role key) is allowed to call them.

revoke execute on function create_dish_with_relations(text, text, text, uuid[], text[], text[], uuid)
  from public, anon, authenticated;

revoke execute on function update_dish_relations(uuid, text, text, text, uuid[], text[], text[])
  from public, anon, authenticated;
