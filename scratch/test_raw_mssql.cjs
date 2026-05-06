const sql = require("mssql");

const config = {
  server: "(localdb)\\MSSQLLocalDB",
  database: "astro_blog",
  options: {
    trustServerCertificate: true
  }
};

async function connectDB() {
  try {
    console.log("Connecting...");
    let pool = await sql.connect(config);
    console.log("Connected!");

    let result = await pool.request().query("SELECT 1 AS number");
    console.log(result.recordset);
    
    await pool.close();
  } catch (err) {
    console.error("Error:", err);
  }
}

connectDB();
