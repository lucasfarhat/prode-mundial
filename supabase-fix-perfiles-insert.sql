-- ============================================================
-- FIX: Faltaba la politica de INSERT en perfiles.
-- Sin esto, el insert de signUp() en src/lib/supabase.js falla por RLS
-- y los usuarios registrados no aparecen en la tabla de posiciones.
-- Ejecutar en: Supabase -> SQL Editor
-- ============================================================

create policy "Usuarios crean su propio perfil"
  on public.perfiles for insert
  with check (auth.uid() = id);
