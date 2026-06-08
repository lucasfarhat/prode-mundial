-- ============================================================
-- FIX: Crear el perfil automaticamente con un trigger en auth.users.
-- Reemplaza el insert manual del cliente (que fallaba por RLS cuando
-- hay confirmacion de email activada, porque no hay sesion al registrarse).
-- El nombre y telefono viajan en raw_user_meta_data (options.data del signUp).
-- Ejecutar en: Supabase -> SQL Editor
-- ============================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.perfiles (id, nombre, email, telefono)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nombre', split_part(new.email, '@', 1)),
    new.email,
    new.raw_user_meta_data->>'telefono'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
