import postgres from 'postgres';
import { readFileSync } from 'fs';

const sql = postgres({
  host: 'db.bwtbptqpfshqbnsowczn.supabase.co',
  port: 5432,
  database: 'postgres',
  username: 'postgres',
  password: 'Lukitas89,.',
  ssl: 'require'
});

async function applyRLS() {
  try {
    // Leer el archivo SQL
    const sqlContent = readFileSync('./supabase-fix-pronos-rls.sql', 'utf-8');
    const statements = sqlContent.split(';').filter(s => s.trim());

    console.log(`Ejecutando ${statements.length} statements SQL...`);
    
    for (const stmt of statements) {
      if (!stmt.trim()) continue;
      try {
        await sql.unsafe(stmt);
        console.log(`✓ ${stmt.substring(0, 50)}...`);
      } catch (err) {
        if (err.message.includes('already exists')) {
          console.log(`⚠️ Ya existe: ${stmt.substring(0, 50)}...`);
        } else {
          console.error(`❌ ${err.message}`);
        }
      }
    }
    
    console.log('\n✅ RLS policies aplicadas exitosamente');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

applyRLS();
