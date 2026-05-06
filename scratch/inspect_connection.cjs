const sql = require("mssql/msnodesqlv8");

const config = {
  connectionString: 'Driver={ODBC Driver 17 for SQL Server};Server=(localdb)\\MSSQLLocalDB;Database=astro_blog;Trusted_Connection=yes;'
};

async function connectDB() {
  try {
    let pool = await sql.connect(config);
    console.log("Pool connected");

    pool.acquire(null, (err, connection) => {
        if (err) {
            console.error("Acquire error:", err);
            return;
        }
        console.log("Connection acquired");
        console.log("Connection type:", typeof connection);
        console.log("Connection keys:", Object.keys(connection));
        console.log("Connection.on type:", typeof connection.on);
        console.log("Connection prototype keys:", Object.keys(Object.getPrototypeOf(connection)));
        
        pool.release(connection);
        pool.close();
    });

  } catch (err) {
    console.error("Error:", err);
  }
}

connectDB();
