// supabase/functions/sync-resultados/index.ts
//
// Edge Function de Supabase que corre en el servidor.
// Se ejecuta automáticamente vía cron job.
// Ventajas:
//   - Tu API key nunca queda expuesta al browser
//   - Corre aunque nadie esté usando la app
//   - Supabase Edge Functions son GRATUITAS (hasta 500k invocaciones/mes)
//
// Deploy:
//   supabase functions deploy sync-resultados --no-verify-jwt
//
// Configurar el cron en Supabase Dashboard → Edge Functions → Schedules:
//   Durante la fase de grupos:    */5 * * * *   (cada 5 min, días con partidos)
//   Días sin partidos:            0 7 * * *     (una vez al día a las 7am)

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const FOOTBALL_DATA_URL = 'https://api.football-data.org/v4'
const WORLD_CUP_ID = 2000
const SEASON = 2026

Deno.serve(async (req) => {
  // Verificación básica de seguridad (llamadas internas desde cron)
  const authHeader = req.headers.get('Authorization')
  const cronSecret = Deno.env.get('CRON_SECRET')
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const apiKey = Deno.env.get('FOOTBALLDATA_API_KEY')!

  try {
    // 1. Ver partidos sin resultado que ya deberían haber terminado
    const hace2h = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    const { data: pendientes } = await supabase
      .from('partidos')
      .select('id, external_id')
      .eq('jugado', false)
      .lt('fecha', hace2h)

    if (!pendientes?.length) {
      return new Response(JSON.stringify({ message: 'No hay partidos pendientes', actualizados: 0 }), {
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // 2. Consultar football-data.org
    const res = await fetch(
      `${FOOTBALL_DATA_URL}/competitions/${WORLD_CUP_ID}/matches?season=${SEASON}&status=FINISHED`,
      { headers: { 'X-Auth-Token': apiKey } }
    )
    const data = await res.json()

    if (!data.matches) {
      throw new Error('Respuesta inesperada de la API: ' + JSON.stringify(data))
    }

    // 3. Cruzar y actualizar
    let actualizados = 0
    for (const pendiente of pendientes) {
      const match = data.matches.find((m: any) => String(m.id) === pendiente.external_id)
      if (!match) continue
      if (match.status !== 'FINISHED') continue
      if (match.score?.fullTime?.home === null) continue

      const { error } = await supabase
        .from('partidos')
        .update({
          resultado_local: match.score.fullTime.home,
          resultado_visitante: match.score.fullTime.away,
          jugado: true,
        })
        .eq('id', pendiente.id)

      if (!error) actualizados++
    }

    // 4. Calcular ganador semanal si es domingo
    const hoy = new Date()
    if (hoy.getDay() === 0 && hoy.getHours() === 23) {
      const lunes = new Date(hoy)
      lunes.setDate(hoy.getDate() - 6)
      const numSemana = Math.ceil((hoy.getTime() - new Date('2026-06-11').getTime()) / (7 * 24 * 60 * 60 * 1000))

      await supabase.rpc('calcular_ganador_semanal', {
        p_semana: numSemana,
        p_fecha_inicio: lunes.toISOString().split('T')[0],
        p_fecha_fin: hoy.toISOString().split('T')[0],
      })
    }

    return new Response(
      JSON.stringify({ message: 'Sync OK', actualizados, pendientesTotal: pendientes.length }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('Error en sync:', err)
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
