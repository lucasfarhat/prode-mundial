import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bwtbptqpfshqbnsowczn.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3dGJwdHFwZnNocWJuc293Y3puIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDkzODk3MiwiZXhwIjoyMDk2NTE0OTcyfQ.lpoPkjOALzvGE66_IA_Dm21C677S5uC2spcI6j4tXCQ';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function checkTables() {
  try {
    const tables = ['pronosticos', 'pronos', 'pronósticos'];
    
    for (const table of tables) {
      const { error } = await supabase.from(table).select('count()', { count: 'exact' }).limit(1);
      if (!error) {
        console.log(`✓ Tabla encontrada: ${table}`);
      } else {
        console.log(`✗ ${table}: ${error.message}`);
      }
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
}

checkTables();
