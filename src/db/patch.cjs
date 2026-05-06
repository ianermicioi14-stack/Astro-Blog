const mssql = require('mssql');
const mssqlV8 = require('mssql/msnodesqlv8');

// In CommonJS, the exports object is mutable
Object.assign(mssql, mssqlV8);

console.log("Global mssql patch applied via CommonJS.");
