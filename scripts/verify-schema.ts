import * as dotenv from 'dotenv';
import { Pool } from 'pg';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('No database URL found. Set DATABASE_URL in your .env.local file and re-run.');
  }

  console.log('🔍 Verifying database schema on Neon...');
  console.log('Host:', new URL(url).host);

  const pool = new Pool({ connectionString: url });

  try {
    // Check PostgreSQL version
    const versionRes = await pool.query('SELECT version();');
    console.log('✅ Connected to:', versionRes.rows[0]?.version);

    // Check all tables
    console.log('\n📋 Tables in database:');
    const tablesRes = await pool.query(`
      SELECT table_name, table_type 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    if (tablesRes.rows.length === 0) {
      console.log('❌ No tables found in database');
      return;
    }

    tablesRes.rows.forEach((row: any) => {
      console.log(`  - ${row.table_name} (${row.table_type})`);
    });

    // Check all enums
    console.log('\n🔤 Enums in database:');
    const enumsRes = await pool.query(`
      SELECT t.typname as enum_name, e.enumlabel as enum_value
      FROM pg_type t 
      JOIN pg_enum e ON t.oid = e.enumtypid  
      JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
      WHERE n.nspname = 'public'
      ORDER BY t.typname, e.enumsortorder;
    `);

    const enumMap = new Map<string, string[]>();
    enumsRes.rows.forEach((row: any) => {
      if (!enumMap.has(row.enum_name)) {
        enumMap.set(row.enum_name, []);
      }
      enumMap.get(row.enum_name)!.push(row.enum_value);
    });

    enumMap.forEach((values, name) => {
      console.log(`  - ${name}: [${values.join(', ')}]`);
    });

    // Check table columns and constraints
    console.log('\n🏗️ Table structure details:');
    for (const tableRow of tablesRes.rows) {
      if (tableRow.table_type === 'BASE TABLE') {
        const tableName = tableRow.table_name;

        // Get columns
        const columnsRes = await pool.query(
          `
          SELECT column_name, data_type, is_nullable, column_default
          FROM information_schema.columns 
          WHERE table_name = $1 
          ORDER BY ordinal_position;
        `,
          [tableName],
        );

        console.log(`\n  📊 ${tableName}:`);
        columnsRes.rows.forEach((col: any) => {
          const nullable = col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL';
          const defaultValue = col.column_default ? ` DEFAULT ${col.column_default}` : '';
          console.log(`    - ${col.column_name}: ${col.data_type} ${nullable}${defaultValue}`);
        });

        // Get foreign keys
        const fkRes = await pool.query(
          `
          SELECT 
            tc.constraint_name,
            kcu.column_name,
            ccu.table_name AS foreign_table_name,
            ccu.column_name AS foreign_column_name
          FROM information_schema.table_constraints AS tc
          JOIN information_schema.key_column_usage AS kcu
            ON tc.constraint_name = kcu.constraint_name
          JOIN information_schema.constraint_column_usage AS ccu
            ON ccu.constraint_name = tc.constraint_name
          WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name = $1;
        `,
          [tableName],
        );

        if (fkRes.rows.length > 0) {
          console.log(`    🔗 Foreign Keys:`);
          fkRes.rows.forEach((fk: any) => {
            console.log(
              `      - ${fk.column_name} → ${fk.foreign_table_name}.${fk.foreign_column_name}`,
            );
          });
        }
      }
    }

    // Check row counts
    console.log('\n📈 Current data counts:');
    for (const tableRow of tablesRes.rows) {
      if (tableRow.table_type === 'BASE TABLE') {
        const countRes = await pool.query(
          `SELECT COUNT(*) as count FROM "${tableRow.table_name}";`,
        );
        console.log(`  - ${tableRow.table_name}: ${countRes.rows[0].count} rows`);
      }
    }

    console.log('\n✅ Schema verification complete!');
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error('❌ Schema verification failed:');
  console.error(err);
  process.exitCode = 1;
});
