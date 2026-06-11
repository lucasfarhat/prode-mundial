-- Fix RLS para tabla 'pronosticos'
-- El error "violates row-level security policy" significa que no hay una policy
-- que permita a los usuarios insertar sus propios pronósticos.

-- Habilitar RLS en la tabla pronosticos (si no está ya habilitada)
alter table public.pronosticos enable row level security;

-- Eliminar policies viejas si existen
drop policy if exists "Usuarios ven sus propios pronósticos" on public.pronosticos;
drop policy if exists "Usuarios crean sus pronósticos" on public.pronosticos;
drop policy if exists "Usuarios actualizan sus pronósticos" on public.pronosticos;
drop policy if exists "Usuarios eliminan sus pronósticos" on public.pronosticos;

-- Crear policies para pronósticos:
-- 1. SELECT: Usuario ve solo sus propios pronósticos
create policy "Usuarios ven sus propios pronósticos"
  on public.pronosticos
  for select
  using (auth.uid() = user_id);

-- 2. INSERT: Usuario puede insertar sus propios pronósticos
create policy "Usuarios crean sus pronósticos"
  on public.pronosticos
  for insert
  with check (auth.uid() = user_id);

-- 3. UPDATE: Usuario puede actualizar solo sus pronósticos
create policy "Usuarios actualizan sus pronósticos"
  on public.pronosticos
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 4. DELETE: Usuario puede eliminar solo sus pronósticos
create policy "Usuarios eliminan sus pronósticos"
  on public.pronosticos
  for delete
  using (auth.uid() = user_id);
