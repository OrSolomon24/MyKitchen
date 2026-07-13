-- Categories become private per user (same model as dishes).
-- Run once in the Supabase Dashboard SQL Editor (after 0002_multi_user.sql).

alter table categories add column if not exists created_by uuid references auth.users(id);

-- All categories that exist today are Amit's, same as the dishes.
update categories
set created_by = (select id from auth.users where email = 'amit@mykitchen.local')
where created_by is null;

alter table categories alter column created_by set not null;

-- Names were globally unique; now two users may each have their own
-- "Desserts", but one user can't have it twice.
alter table categories drop constraint if exists categories_name_key;
create unique index if not exists categories_created_by_name_key on categories (created_by, name);
create index if not exists categories_created_by_idx on categories (created_by);

drop policy if exists "authenticated full access" on categories;

create policy "owner full access" on categories
  for all
  using (created_by = auth.uid())
  with check (created_by = auth.uid());
