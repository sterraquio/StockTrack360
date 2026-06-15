-- StockTrack360 - esquema inicial de base de datos
-- Ejecutar primero en Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  password_hash text not null,
  role text not null,
  status text not null default 'ACTIVE',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint users_name_not_empty check (length(btrim(name)) > 0),
  constraint users_email_not_empty check (length(btrim(email)) > 0),
  constraint users_password_hash_not_empty check (length(btrim(password_hash)) > 0),
  constraint users_role_allowed check (role in ('ADMINISTRADOR', 'USUARIO')),
  constraint users_status_allowed check (status in ('ACTIVE', 'INACTIVE'))
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  requires_expiration_date boolean not null default false,
  constraint categories_name_not_empty check (length(btrim(name)) > 0)
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on update cascade on delete restrict,
  name text not null,
  sku text not null unique,
  expiration_date date,
  minimum_stock integer,
  available_stock integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint products_name_not_empty check (length(btrim(name)) > 0),
  constraint products_sku_not_empty check (length(btrim(sku)) > 0),
  constraint products_minimum_stock_not_negative check (minimum_stock is null or minimum_stock >= 0),
  constraint products_available_stock_not_negative check (available_stock >= 0)
);

create table if not exists public.inventory_movements (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on update cascade on delete restrict,
  user_id uuid not null references public.users(id) on update cascade on delete restrict,
  type text not null,
  quantity integer not null,
  created_at timestamptz not null default now(),
  constraint inventory_movements_type_allowed check (type in ('ENTRADA', 'SALIDA')),
  constraint inventory_movements_quantity_positive check (quantity > 0)
);

create index if not exists users_role_status_idx
  on public.users (role, status);

create index if not exists categories_name_idx
  on public.categories (name);

create index if not exists products_category_id_idx
  on public.products (category_id);

create index if not exists products_name_idx
  on public.products (name);

create index if not exists products_low_stock_idx
  on public.products (available_stock, minimum_stock)
  where minimum_stock is not null;

create index if not exists products_expiration_date_idx
  on public.products (expiration_date)
  where expiration_date is not null;

create index if not exists inventory_movements_product_id_created_at_idx
  on public.inventory_movements (product_id, created_at desc);

create index if not exists inventory_movements_user_id_created_at_idx
  on public.inventory_movements (user_id, created_at desc);

create index if not exists inventory_movements_type_created_at_idx
  on public.inventory_movements (type, created_at desc);

create or replace function public.users_before_write()
returns trigger
language plpgsql
as $$
begin
  new.name := btrim(new.name);
  new.role := upper(btrim(new.role));
  new.status := upper(btrim(new.status));

  if tg_op = 'INSERT' then
    new.email := lower(btrim(new.email));
  elsif new.email is distinct from old.email then
    raise exception using
      errcode = 'P0001',
      message = 'USER_EMAIL_IMMUTABLE',
      detail = 'El correo no puede modificarse despues de crear el usuario.';
  end if;

  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists users_before_write_trigger on public.users;

create trigger users_before_write_trigger
before insert or update on public.users
for each row
execute function public.users_before_write();

create or replace function public.products_before_write()
returns trigger
language plpgsql
as $$
begin
  new.name := btrim(new.name);

  if tg_op = 'INSERT' then
    new.sku := upper(btrim(new.sku));
    new.available_stock := coalesce(new.available_stock, 0);
  elsif new.sku is distinct from old.sku then
    raise exception using
      errcode = 'P0001',
      message = 'PRODUCT_SKU_IMMUTABLE',
      detail = 'El SKU no puede modificarse despues de crear el producto.';
  end if;

  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists products_before_write_trigger on public.products;

create trigger products_before_write_trigger
before insert or update on public.products
for each row
execute function public.products_before_write();

create or replace function public.register_inventory_movement(
  p_product_id uuid,
  p_user_id uuid,
  p_type text,
  p_quantity integer
)
returns table (
  id uuid,
  product_id uuid,
  product_name text,
  sku text,
  user_id uuid,
  user_name text,
  type text,
  quantity integer,
  created_at timestamptz
)
language plpgsql
as $$
declare
  v_type text;
  v_product public.products%rowtype;
  v_movement public.inventory_movements%rowtype;
begin
  v_type := upper(btrim(coalesce(p_type, '')));

  if v_type not in ('ENTRADA', 'SALIDA') then
    raise exception using
      errcode = 'P0001',
      message = 'INVALID_MOVEMENT_TYPE',
      detail = 'El tipo de movimiento debe ser ENTRADA o SALIDA.';
  end if;

  if p_quantity is null or p_quantity <= 0 then
    raise exception using
      errcode = 'P0001',
      message = 'INVALID_MOVEMENT_QUANTITY',
      detail = 'La cantidad debe ser un entero mayor a 0.';
  end if;

  select *
    into v_product
    from public.products
   where products.id = p_product_id
   for update;

  if not found then
    raise exception using
      errcode = 'P0001',
      message = 'PRODUCT_NOT_FOUND',
      detail = 'No existe un producto con el id indicado.';
  end if;

  perform 1
    from public.users
   where users.id = p_user_id
     and users.status = 'ACTIVE';

  if not found then
    raise exception using
      errcode = 'P0001',
      message = 'USER_NOT_FOUND_OR_INACTIVE',
      detail = 'El usuario no existe o no esta activo.';
  end if;

  if v_type = 'SALIDA' and v_product.available_stock < p_quantity then
    raise exception using
      errcode = 'P0001',
      message = 'INSUFFICIENT_STOCK',
      detail = 'La salida no puede superar el stock disponible.';
  end if;

  update public.products
     set available_stock = case
       when v_type = 'ENTRADA' then available_stock + p_quantity
       else available_stock - p_quantity
     end
   where products.id = p_product_id
   returning * into v_product;

  insert into public.inventory_movements (product_id, user_id, type, quantity)
  values (p_product_id, p_user_id, v_type, p_quantity)
  returning * into v_movement;

  return query
  select
    v_movement.id,
    p.id,
    p.name,
    p.sku,
    u.id,
    u.name,
    v_movement.type,
    v_movement.quantity,
    v_movement.created_at
  from public.products p
  join public.users u on u.id = v_movement.user_id
  where p.id = v_movement.product_id;
end;
$$;

alter table public.users disable row level security;
alter table public.categories disable row level security;
alter table public.products disable row level security;
alter table public.inventory_movements disable row level security;

revoke all on table public.users, public.categories, public.products, public.inventory_movements from public;
revoke all on function public.register_inventory_movement(uuid, uuid, text, integer) from public;

do $$
begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    execute 'revoke all on table public.users, public.categories, public.products, public.inventory_movements from anon';
    execute 'revoke all on function public.register_inventory_movement(uuid, uuid, text, integer) from anon';
  end if;

  if exists (select 1 from pg_roles where rolname = 'authenticated') then
    execute 'revoke all on table public.users, public.categories, public.products, public.inventory_movements from authenticated';
    execute 'revoke all on function public.register_inventory_movement(uuid, uuid, text, integer) from authenticated';
  end if;

  if exists (select 1 from pg_roles where rolname = 'service_role') then
    execute 'grant usage on schema public to service_role';
    execute 'grant select, insert, update, delete on table public.users, public.categories, public.products, public.inventory_movements to service_role';
    execute 'grant execute on function public.register_inventory_movement(uuid, uuid, text, integer) to service_role';
  end if;
end;
$$;
