-- MyKitchen initial Supabase schema
-- Run once in the Supabase Dashboard SQL Editor (or via `supabase db push` once the CLI is linked).

create extension if not exists pgcrypto;

-- ── Tables ──────────────────────────────────────────────────────────

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists dishes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  source_url text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists dish_categories (
  dish_id uuid not null references dishes(id) on delete cascade,
  category_id uuid not null references categories(id) on delete restrict,
  primary key (dish_id, category_id)
);

create table if not exists dish_ingredients (
  id uuid primary key default gen_random_uuid(),
  dish_id uuid not null references dishes(id) on delete cascade,
  position int not null,
  raw_text text not null,
  quantity text,
  unit text,
  name text
);
create index if not exists dish_ingredients_dish_id_position_idx on dish_ingredients (dish_id, position);

create table if not exists dish_steps (
  id uuid primary key default gen_random_uuid(),
  dish_id uuid not null references dishes(id) on delete cascade,
  position int not null,
  text text not null
);
create index if not exists dish_steps_dish_id_position_idx on dish_steps (dish_id, position);

create table if not exists dish_images (
  id uuid primary key default gen_random_uuid(),
  dish_id uuid not null references dishes(id) on delete cascade,
  storage_path text not null,
  position int not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists dish_images_dish_id_position_idx on dish_images (dish_id, position);

-- ── Row Level Security ──────────────────────────────────────────────
-- The Express server uses the service-role key (bypasses RLS). These
-- policies are defense-in-depth / allow future direct client access.

alter table categories enable row level security;
alter table dishes enable row level security;
alter table dish_categories enable row level security;
alter table dish_ingredients enable row level security;
alter table dish_steps enable row level security;
alter table dish_images enable row level security;

create policy "authenticated full access" on categories
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated full access" on dishes
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated full access" on dish_categories
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated full access" on dish_ingredients
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated full access" on dish_steps
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated full access" on dish_images
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ── Storage ─────────────────────────────────────────────────────────

insert into storage.buckets (id, name, public)
values ('dish-images', 'dish-images', true)
on conflict (id) do nothing;

create policy "Public read access on dish-images"
  on storage.objects for select
  using (bucket_id = 'dish-images');

create policy "Authenticated write access on dish-images"
  on storage.objects for insert
  with check (bucket_id = 'dish-images' and auth.role() = 'authenticated');

create policy "Authenticated update access on dish-images"
  on storage.objects for update
  using (bucket_id = 'dish-images' and auth.role() = 'authenticated');

create policy "Authenticated delete access on dish-images"
  on storage.objects for delete
  using (bucket_id = 'dish-images' and auth.role() = 'authenticated');

-- ── RPCs for atomic multi-table writes ──────────────────────────────
-- Used by the Phase 2 backend rewrite so a dish + its category links +
-- ingredients + steps are written in one transaction (fixes the old
-- "one duplicate Dish document per category" bug for good).

create or replace function create_dish_with_relations(
  p_name text,
  p_description text,
  p_source_url text,
  p_category_ids uuid[],
  p_ingredients text[],
  p_steps text[],
  p_created_by uuid default null
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_dish_id uuid;
  i int;
begin
  insert into dishes (name, description, source_url, created_by)
  values (p_name, p_description, p_source_url, p_created_by)
  returning id into v_dish_id;

  if p_category_ids is not null and array_length(p_category_ids, 1) > 0 then
    insert into dish_categories (dish_id, category_id)
    select v_dish_id, c from unnest(p_category_ids) as c;
  end if;

  if p_ingredients is not null and array_length(p_ingredients, 1) > 0 then
    for i in 1 .. array_length(p_ingredients, 1) loop
      insert into dish_ingredients (dish_id, position, raw_text)
      values (v_dish_id, i - 1, p_ingredients[i]);
    end loop;
  end if;

  if p_steps is not null and array_length(p_steps, 1) > 0 then
    for i in 1 .. array_length(p_steps, 1) loop
      insert into dish_steps (dish_id, position, text)
      values (v_dish_id, i - 1, p_steps[i]);
    end loop;
  end if;

  return v_dish_id;
end;
$$;

create or replace function update_dish_relations(
  p_dish_id uuid,
  p_name text,
  p_description text,
  p_source_url text,
  p_category_ids uuid[],
  p_ingredients text[],
  p_steps text[]
) returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  i int;
begin
  update dishes
  set name = p_name,
      description = p_description,
      source_url = p_source_url,
      updated_at = now()
  where id = p_dish_id;

  delete from dish_categories where dish_id = p_dish_id;
  if p_category_ids is not null and array_length(p_category_ids, 1) > 0 then
    insert into dish_categories (dish_id, category_id)
    select p_dish_id, c from unnest(p_category_ids) as c;
  end if;

  delete from dish_ingredients where dish_id = p_dish_id;
  if p_ingredients is not null and array_length(p_ingredients, 1) > 0 then
    for i in 1 .. array_length(p_ingredients, 1) loop
      insert into dish_ingredients (dish_id, position, raw_text)
      values (p_dish_id, i - 1, p_ingredients[i]);
    end loop;
  end if;

  delete from dish_steps where dish_id = p_dish_id;
  if p_steps is not null and array_length(p_steps, 1) > 0 then
    for i in 1 .. array_length(p_steps, 1) loop
      insert into dish_steps (dish_id, position, text)
      values (p_dish_id, i - 1, p_steps[i]);
    end loop;
  end if;
end;
$$;
