const sql = require("mssql/msnodesqlv8");

const config = {
  connectionString: 'Driver={ODBC Driver 17 for SQL Server};Server=(localdb)\\MSSQLLocalDB;Database=astro_blog;Trusted_Connection=yes;'
};

async function connectDB() {
  try {
    let pool = await sql.connect(config);
    let req = pool.request();
    console.log("Request constructor path:", req.constructor.toString().substring(0, 100));
    console.log("Request prototype:", Object.getPrototypeOf(req).constructor.name);
    
    await pool.close();
  } catch (err) {
    console.error("Error:", err);
  }
}

connectDB();
