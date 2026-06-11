import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bwtbptqpfshqbnsowczn.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3dGJwdHFwZnNocWJuc293Y3puIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDkzODk3MiwiZXhwIjoyMDk2NTE0OTcyfQ.lpoPkjOALzvGE66_IA_Dm21C677S5uC2spcI6j4tXCQ';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function fixRLS() {
  try {
    // Test connection
    const { data, error: connError } = await supabase
      .from('pronos')
      .select('count()', { count: 'exact' })
      .limit(1);
    
    if (connError) {
      console.log('❌ Error conexión:', connError.message);
      return;
    }
    
    console.log('✓ Conectado a Supabase');
    console.log('✓ Tabla pronos existe');
    console.log('\n⚠️ Para aplicar RLS policies, necesitás copiar el SQL en Supabase Console');
    console.log('Debo hacerlo via SQL Editor porque Supabase-js no tiene endpoint para ejecutar SQL');
  } catch (err) {
    console.error('Error:', err.message);
  }
}

fixRLS();
