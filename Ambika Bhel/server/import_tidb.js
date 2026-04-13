const fs = require('fs');
const mysql = require('mysql2/promise');

async function importDatabase() {
  try {
    console.log("Connecting to TiDB server...");
    const connection = await mysql.createConnection({
      host: 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com',
      port: 4000,
      user: 'PF2zf6JTZxmcWin.root',
      password: 'vNxWIW65yRsaY5ri',
      database: 'test',
      ssl: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true
      },
      multipleStatements: true
    });

    console.log("Successfully connected! Reading database_export.sql...");
    let sqlFile = fs.readFileSync('../../database_export.sql', 'utf16le');

    // Remove comments to prevent parse issues
    sqlFile = sqlFile.replace(/--.*$/gm, '');
    sqlFile = sqlFile.replace(/\/\*[\s\S]*?\*\//gm, '');
    
    // Split into statements
    const statements = sqlFile.split(';').map(s => s.trim()).filter(s => s.length > 0);

    console.log(`Executing ${statements.length} sql statements...`);
    for (let i = 0; i < statements.length; i++) {
        try {
            await connection.query(statements[i]);
            process.stdout.write(`\rProgress: ${Math.round(((i+1)/statements.length)*100)}% (${i+1}/${statements.length})`);
        } catch (err) {
            console.error(`\nError executing statement ${i+1}:\n${statements[i].substring(0, 50)}...`);
            console.error(err.message);
        }
    }

    console.log("\n\nTiDB Database successfully populated with your local data!");
    process.exit(0);
  } catch (error) {
    console.error("Failed to connect or import database:");
    console.error(error);
    process.exit(1);
  }
}

importDatabase();
