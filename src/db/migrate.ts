import * as mssql from 'mssql';
import fs from 'fs';
import path from 'path';

const config = {
  server: "(localdb)\\MSSQLLocalDB",
  database: "astro_blog",
  options: {
    trustServerCertificate: true
  }
};

// Find the latest migration file
const migrationDir = path.join(process.cwd(), 'drizzle');
const migrationFolders = fs.readdirSync(migrationDir).filter(f => fs.lstatSync(path.join(migrationDir, f)).isDirectory());
let migrationFile = path.join(process.cwd(), 'drizzle/20260505102546_ambiguous_molly_hayes/migration.sql');

const sql = fs.readFileSync(migrationFile, 'utf8');

async function migrate() {
  try {
    console.log('Connecting to LocalDB using standard mssql (tedious)...');
    const pool = await mssql.connect(config);
    console.log('Connected!');

    const statements = sql.split('--> statement-breakpoint');
    for (let statement of statements) {
      statement = statement.trim();
      if (statement) {
        console.log(`Executing statement: ${statement.substring(0, 50)}...`);
        await pool.request().query(statement);
      }
    }

    console.log('Migration completed successfully! All tables created.');
    await pool.close();
  } catch (err) {
    console.error('Migration failed:', err);
    console.log('\nTIP: If you get EINSTLOOKUP, make sure TCP/IP is enabled for LocalDB or use the msnodesqlv8 driver.');
  }
}

migrate();
