const sql = require("mssql/msnodesqlv8");

const config = {
  connectionString: 'Driver={ODBC Driver 17 for SQL Server};Server=(localdb)\\MSSQLLocalDB;Database=astro_blog;Trusted_Connection=yes;'
};

async function connectDB() {
  try {
    console.log("Connecting with msnodesqlv8...");
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
