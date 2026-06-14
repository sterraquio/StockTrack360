-- StockTrack360 - semillas iniciales
-- Ejecutar despues de docs/database/schema.sql.
-- Este archivo no contiene contrasenas en texto plano.

begin;

insert into public.users (name, email, password_hash, role, status)
values
  (
    'Administrador',
    'admin@stocktrack360.local',
    '$2b$10$rkTpk0wjq5A2OnieCNaHYu57IQuJKDlsCGOLs3NGEIMs4kdXRzNsK',
    'ADMINISTRADOR',
    'ACTIVE'
  ),
  (
    'Usuario Inventario',
    'usuario@stocktrack360.local',
    '$2b$10$3wvtlgkizlli0I7jBDV6beM.56dfacslVucXYVCon7RSETjAIXETS',
    'USUARIO',
    'ACTIVE'
  )
on conflict (email) do update
set
  name = excluded.name,
  password_hash = excluded.password_hash,
  role = excluded.role,
  status = excluded.status;

insert into public.categories (name, requires_expiration_date)
values
  ('Alimentos y bebidas', true),
  ('Aseo y limpieza', true),
  ('Salud y medicamentos', true),
  ('Cosméticos y cuidado personal', true),
  ('Papelería y oficina', false),
  ('Ferretería y herramientas', false),
  ('Ropa y accesorios', false),
  ('Otros', false)
on conflict (name) do update
set requires_expiration_date = excluded.requires_expiration_date;

commit;
