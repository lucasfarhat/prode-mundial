import postgres from 'postgres';

const sql = postgres({
  host: 'db.bwtbptqpfshqbnsowczn.supabase.co',
  port: 5432,
  database: 'postgres',
  username: 'postgres',
  password: 'Lukitas89,.',
  ssl: 'require'
});

async function inspectTable() {
  try {
    const columns = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'pronosticos' 
      ORDER BY ordinal_position
    `;
    
    console.log('Columnas de la tabla pronosticos:');
    columns.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type}`);
    });

  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await sql.end();
  }
}

inspectTable();
