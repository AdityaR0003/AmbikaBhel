const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Create connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ambikabhel',
  port: process.env.DB_PORT || 3306,
  ssl: process.env.DB_SSL === 'true' ? { minVersion: 'TLSv1.2', rejectUnauthorized: true } : undefined,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// GET all items
app.get('/api/items', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM items ORDER BY id ASC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE item quantity directly
app.put('/api/items/:id', async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;
  try {
    await pool.query('UPDATE items SET quantity = ? WHERE id = ?', [quantity, id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new item
app.post('/api/items', async (req, res) => {
  const { name, unit } = req.body;
  try {
    const [result] = await pool.query('INSERT INTO items (name, quantity, unit) VALUES (?, 0, ?)', [name, unit]);
    const [newItem] = await pool.query('SELECT * FROM items WHERE id = ?', [result.insertId]);
    res.json(newItem[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE item
app.delete('/api/items/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM items WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// USE item (Deduct quantity and create log)
app.post('/api/use', async (req, res) => {
  const { itemId, quantity } = req.body;
  try {
    // Start transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    
    try {
      const [itemRows] = await connection.query('SELECT * FROM items WHERE id = ? FOR UPDATE', [itemId]);
      const item = itemRows[0];
      
      if (!item || item.quantity < quantity) {
        await connection.rollback();
        connection.release();
        return res.status(400).json({ error: 'Not enough stock' });
      }

      await connection.query('UPDATE items SET quantity = quantity - ? WHERE id = ?', [quantity, itemId]);
      await connection.query('INSERT INTO logs (itemName, quantityUsed) VALUES (?, ?)', [item.name, quantity]);
      
      await connection.commit();
      connection.release();
      res.json({ success: true });
    } catch (err) {
      await connection.rollback();
      connection.release();
      throw err;
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all logs
app.get('/api/logs', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM logs ORDER BY date DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all transactions
app.get('/api/transactions', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM transactions ORDER BY date DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST transaction
app.post('/api/transactions', async (req, res) => {
  const { type, amount, description, mode } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO transactions (type, amount, description, mode) VALUES (?, ?, ?, ?)',
      [type, amount, description, mode]
    );
    const [newTx] = await pool.query('SELECT * FROM transactions WHERE id = ?', [result.insertId]);
    res.json(newTx[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update transaction
app.put('/api/transactions/:id', async (req, res) => {
  const { id } = req.params;
  const { type, amount, description, mode } = req.body;
  try {
    await pool.query(
      'UPDATE transactions SET type = ?, amount = ?, description = ?, mode = ? WHERE id = ?',
      [type, amount, description, mode, id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update log
app.put('/api/logs/:id', async (req, res) => {
  const { id } = req.params;
  const { quantityUsed } = req.body;
  try {
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    try {
      const [logRows] = await connection.query('SELECT * FROM logs WHERE id = ? FOR UPDATE', [id]);
      const log = logRows[0];
      if (!log) {
        await connection.rollback();
        connection.release();
        return res.status(404).json({ error: 'Log not found' });
      }
      
      const diff = quantityUsed - log.quantityUsed;
      
      const [itemRows] = await connection.query('SELECT * FROM items WHERE name = ? FOR UPDATE', [log.itemName]);
      if (itemRows.length > 0) {
        const item = itemRows[0];
        if (item.quantity - diff < 0) {
          await connection.rollback();
          connection.release();
          return res.status(400).json({ error: 'Not enough stock to update this usage' });
        }
        await connection.query('UPDATE items SET quantity = quantity - ? WHERE id = ?', [diff, item.id]);
      }
      
      await connection.query('UPDATE logs SET quantityUsed = ? WHERE id = ?', [quantityUsed, id]);
      
      await connection.commit();
      connection.release();
      res.json({ success: true });
    } catch (err) {
      await connection.rollback();
      connection.release();
      throw err;
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
