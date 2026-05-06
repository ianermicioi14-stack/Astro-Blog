const sql = require("mssql/msnodesqlv8");

const config = {
  connectionString: 'Driver={ODBC Driver 17 for SQL Server};Server=(localdb)\\MSSQLLocalDB;Database=master;Trusted_Connection=yes;'
};

async function findPort() {
  try {
    console.log("Connecting to LocalDB via msnodesqlv8 to find TCP port...");
    let pool = await sql.connect(config);
    console.log("Connected to master!");

    let result = await pool.request().query(`
        SELECT local_tcp_port 
        FROM sys.dm_exec_connections 
        WHERE session_id = @@SPID
    `);
    
    const port = result.recordset[0].local_tcp_port;
    console.log("LocalDB is listening on port:", port);
    
    await pool.close();
    return port;
  } catch (err) {
    console.error("Error finding port:", err);
    return null;
  }
}

findPort();
