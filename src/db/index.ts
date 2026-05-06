import * as mssql from "mssql/msnodesqlv8";
import { MsSqlDatabase, MsSqlDialect, MsSqlSession, PreparedQuery } from "drizzle-orm/mssql-core";
import { entityKind } from "drizzle-orm/entity";
import * as schema from "./schema";
import "dotenv/config";

// 1. Establish the native LocalDB connection
const pool = await mssql.connect({
  driver: 'msnodesqlv8',
  connectionString: 'Driver={ODBC Driver 17 for SQL Server};Server=(localdb)\\MSSQLLocalDB;Database=astro_blog;Trusted_Connection=yes;'
} as any);

console.log("\x1b[32m[SYSTEM] Connected to LocalDB via Named Pipes!\x1b[0m");

/**
 * UTILITY: MAP SNAKE_CASE TO CAMELCASE
 * SQL Server returns columns as they are defined (usually created_at).
 * This helper ensures they match the camelCase properties in Drizzle/Astro.
 */
function mapRows(rows: any[]) {
  return rows.map(row => {
    const mapped: any = {};
    for (const [key, value] of Object.entries(row)) {
      const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
      mapped[camelKey] = value;
      if (camelKey !== key) mapped[key] = value;
    }
    return mapped;
  });
}

// 2. Formal PreparedQuery implementation
class PureMsSqlPreparedQuery extends PreparedQuery<any> {
  static readonly [entityKind] = "PureMsSqlPreparedQuery";

  constructor(private pool: any, private query: any) {
    super();
  }

  async execute() {
    try {
      const request = this.pool.request();
      
      // SAFETY GUARD: Prevent deleting the Admin user (ID 1)
      const sqlLower = this.query.sql.toLowerCase();
      if (sqlLower.includes('delete') && sqlLower.includes('users')) {
        const isAdminId = this.query.params?.some((p: any) => p === 1 || p === '1');
        if (isAdminId) {
          throw new Error('SECURITY ALERT: The Admin user (ID 1) is protected and cannot be deleted.');
        }
      }

      if (this.query.params) {
        this.query.params.forEach((val: any, idx: number) => {
          let finalVal = val;
          if (val instanceof Date) {
            finalVal = val.toISOString().slice(0, 19).replace('T', ' ');
          } else if (typeof val === 'boolean') {
            finalVal = val ? 1 : 0;
          }
          request.input(`par${idx}`, finalVal);
        });
      }
      
      console.log(`\x1b[34m[SQL]\x1b[0m ${this.query.sql}`);
      const result = await request.query(this.query.sql);
      const rows = result.recordset || [];
      const mapped = mapRows(rows);
      if (mapped.length > 0) {
        console.log(`[DB RESULT] Keys: ${Object.keys(mapped[0]).join(', ')}`);
      }
      return mapped;
    } catch (err) {
      console.error("\x1b[31m[DB ERROR]\x1b[0m", err);
      throw err;
    }
  }

  async *iterator() {
    const result = await this.execute();
    for (const row of result) yield row;
  }
}

// 3. Formal Session implementation
class PureMsSqlSession extends MsSqlSession<any, any, any, any> {
  static readonly [entityKind] = "PureMsSqlSession";

  constructor(private pool: any, dialect: MsSqlDialect) {
    super(dialect);
  }

  prepareQuery(query: any, fields: any): any {
    return new PureMsSqlPreparedQuery(this.pool, query);
  }

  async all(query: any) {
    try {
      const request = this.pool.request();
      if (query.params) {
        query.params.forEach((val: any, idx: number) => {
          let finalVal = val;
          if (val instanceof Date) {
            finalVal = val.toISOString().slice(0, 19).replace('T', ' ');
          } else if (typeof val === 'boolean') {
            finalVal = val ? 1 : 0;
          }
          request.input(`par${idx}`, finalVal);
        });
      }
      console.log(`\x1b[34m[SQL-ALL]\x1b[0m ${query.sql}`);
      const result = await request.query(query.sql);
      const rows = result.recordset || [];
      return mapRows(rows);
    } catch (err) {
      console.error("\x1b[31m[DB ERROR in all()]\x1b[0m", err);
      throw err;
    }
  }

  async transaction(transaction: any) {
    return transaction(this);
  }
}

// 4. Initialize the Drizzle Database
const dialect = new MsSqlDialect();
const session = new PureMsSqlSession(pool, dialect);
export const db = new MsSqlDatabase(dialect, session, { schema, fullSchema: schema } as any);

export default db;