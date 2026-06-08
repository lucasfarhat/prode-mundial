-- ============================================================
-- MIGRACIÓN: Agregar soporte para sync automático con API externa
-- Ejecutar en: Supabase → SQL Editor (después del schema principal)
-- ============================================================

-- Agregar columna external_id a partidos (para cruzar con la API)
alter table public.partidos
  add column if not exists external_id text;

-- Índice para búsqueda rápida por external_id
create index if not exists idx_partidos_external_id
  on public.partidos(external_id);

-- Vista mejorada: incluir partidos en vivo
create or replace view public.partidos_con_estado as
select
  p.*,
  case
    when p.jugado = true then 'terminado'
    when p.fecha <= now() and p.fecha > now() - interval '2 hours' then 'en_vivo'
    when p.fecha <= now() + interval '1 hour' then 'proximo'
    else 'pendiente'
  end as estado_calculado
from public.partidos p;


-- ============================================================
-- INSTRUCCIONES PARA CONFIGURAR LA API DE RESULTADOS
-- ============================================================

-- OPCIÓN A: football-data.org (RECOMENDADA - gratis para siempre)
-- 1. Registrarse en https://www.football-data.org/client/register
-- 2. Te llega el API key por email
-- 3. Agregarlo en Supabase → Settings → Edge Functions → Secrets:
--      FOOTBALLDATA_API_KEY = tu_api_key_aqui
-- 4. También en .env.local del proyecto React:
--      VITE_FOOTBALLDATA_API_KEY = tu_api_key_aqui

-- OPCIÓN B: API-Football (100 requests/día gratis)
-- 1. Registrarse en https://www.api-football.com
-- 2. Ir al dashboard y copiar el API key
-- 3. En .env.local: VITE_APIFOOTBALL_API_KEY = tu_api_key_aqui

-- ============================================================
-- CÓMO HACER EL PRIMER SYNC (cargar external_ids)
-- ============================================================
-- Después de registrarte y tener tu API key, ejecutar esto
-- UNA SOLA VEZ desde la consola del browser (o Node.js):
--
-- import { cargarExternalIds } from './src/lib/syncResultados.js'
-- const ok = await cargarExternalIds()
-- console.log('Partidos vinculados:', ok)
--
-- Esto cruza los partidos de tu DB con los de la API por nombre de equipo.

-- ============================================================
-- DEPLOY DE LA EDGE FUNCTION (sync automático en el servidor)
-- ============================================================
-- Instalar Supabase CLI:
--   npm install -g supabase
--
-- Login:
--   supabase login
--
-- Linkear con tu proyecto:
--   supabase link --project-ref TU_PROJECT_REF
--
-- Deploy de la función:
--   supabase functions deploy sync-resultados --no-verify-jwt
--
-- Configurar secrets en Supabase Dashboard → Edge Functions → Secrets:
--   FOOTBALLDATA_API_KEY = tu_api_key_aqui
--   CRON_SECRET = cualquier_string_secreto_para_seguridad
--
-- Configurar el cron en Supabase Dashboard → Edge Functions → Schedules:
--   Nombre: sync-mundial
--   Función: sync-resultados
--   Schedule: */5 * * * *   (cada 5 min durante el torneo)
--
-- Con el plan gratuito de Supabase tenés 500.000 invocaciones/mes de Edge Functions.
-- A 1 llamada cada 5 minutos = 8.640 invocaciones/mes. Muy por debajo del límite.
-- ============================================================
