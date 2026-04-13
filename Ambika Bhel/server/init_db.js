const mysql = require('mysql2/promise');

async function initializeDatabase() {
  try {
    // Connect to MySQL server without specifying database
    console.log("Connecting to MySQL server as root...");
    const connection = await mysql.createConnection({
      host: '127.0.0.1',
      user: 'root',
      password: ''
    });

    console.log("Creating database 'ambikabhel' if not exists...");
    await connection.query('CREATE DATABASE IF NOT EXISTS ambikabhel;');

    console.log("Using database 'ambikabhel'...");
    await connection.query('USE ambikabhel;');

    console.log("Creating table 'items'...");
    await connection.query(`
      CREATE TABLE IF NOT EXISTS items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        quantity DECIMAL(10, 2) NOT NULL DEFAULT 0,
        unit VARCHAR(50) NOT NULL
      );
    `);

    console.log("Creating table 'logs'...");
    await connection.query(`
      CREATE TABLE IF NOT EXISTS logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        itemName VARCHAR(255) NOT NULL,
        quantityUsed DECIMAL(10, 2) NOT NULL,
        date DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Creating table 'transactions'...");
    await connection.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        type VARCHAR(50) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        description VARCHAR(255),
        mode VARCHAR(50) DEFAULT 'Cash',
        date DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Check if items already exist
    const [rows] = await connection.query('SELECT COUNT(*) as count FROM items');
    if (rows[0].count === 0) {
      console.log("Seeding initial stock items...");
      await connection.query(`
        INSERT INTO items (name, quantity, unit) VALUES
        ('Shev', 0, 'kg'),
        ('Farsan', 0, 'kg'),
        ('Imli Water', 0, 'liters'),
        ('Kachori', 0, 'pieces'),
        ('Coal', 0, 'kg'),
        ('Pani Puri', 0, 'pieces'),
        ('Carry Bag', 0, 'pieces'),
        ('Container', 0, 'pieces');
      `);
    }

    console.log("Database successfully properly initialized!");
    process.exit(0);
  } catch (error) {
    console.error("Failed to initialize database:");
    console.error(error);
    process.exit(1);
  }
}

initializeDatabase();
