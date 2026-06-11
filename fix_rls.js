const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://bwtbptqpfshqbnsowczn.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3dGJwdHFwZnNocWJuc293Y3puIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDkzODk3MiwiZXhwIjoyMDk2NTE0OTcyfQ.lpoPkjOALzvGE66_IA_Dm21C677S5uC2spcI6j4tXCQ';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function fixRLS() {
  try {
    const sqls = [
      `alter table public.pronos enable row level security;`,
      `drop policy if exists "Usuarios ven sus propios pronósticos" on public.pronos;`,
      `drop policy if exists "Usuarios crean sus pronósticos" on public.pronos;`,
      `drop policy if exists "Usuarios actualizan sus pronósticos" on public.pronos;`,
      `drop policy if exists "Usuarios eliminan sus pronósticos" on public.pronos;`,
      `create policy "Usuarios ven sus propios pronósticos" on public.pronos for select using (auth.uid() = usuario_id);`,
      `create policy "Usuarios crean sus pronósticos" on public.pronos for insert with check (auth.uid() = usuario_id);`,
      `create policy "Usuarios actualizan sus pronósticos" on public.pronos for update using (auth.uid() = usuario_id) with check (auth.uid() = usuario_id);`,
      `create policy "Usuarios eliminan sus pronósticos" on public.pronos for delete using (auth.uid() = usuario_id);`
    ];

    for (const sql of sqls) {
      const { error } = await supabase.rpc('exec_sql', { query: sql });
      if (error && !error.message.includes('does not exist')) {
        console.log(`⚠️ ${sql.substring(0,50)}... -> ${error.message}`);
      }
    }
    
    console.log('✓ RLS policies aplicadas');
  } catch (err) {
    console.error('Error conexión:', err.message);
  }
}

fixRLS();
