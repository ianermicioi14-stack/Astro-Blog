const mssql = require("mssql");
const { execSync } = require('child_process');

async function test() {
  try {
    console.log("Finding LocalDB pipe...");
    const info = execSync('sqllocaldb info MSSQLLocalDB').toString();
    const pipeMatch = info.match(/np:\\\\.\\pipe\\LOCALDB#[A-Z0-9]+\\tsql\\query/i);
    
    if (!pipeMatch) {
      throw new Error("Could not find LocalDB pipe");
    }
    
    const pipe = pipeMatch[0];
    console.log("Found pipe:", pipe);

    const config = {
      server: pipe,
      database: "astro_blog",
      options: {
        trustServerCertificate: true
      }
    };

    console.log("Connecting with tedious...");
    let pool = await mssql.connect(config);
    console.log("Connected!");

    let result = await pool.request().query("SELECT 1 AS number");
    console.log(result.recordset);
    
    await pool.close();
  } catch (err) {
    console.error("Error:", err);
  }
}

test();
