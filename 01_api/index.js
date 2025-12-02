const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config({ path: '.env.local' });

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'mini_cini_db',
  port: Number(process.env.DB_PORT || 3306),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 AS ok');
    res.json({ 
      status: 'ok', 
      db: rows[0].ok === 1,
      timestamp: new Date().toISOString()
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ 
      status: 'error', 
      message: e.message 
    });
  }
});

// Get all movies
app.get('/movies', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT * FROM movies 
      ORDER BY created_at DESC
    `);
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get single movie
app.get('/movies/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM movies WHERE id = ?',
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    res.json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add movie to watchlist
app.post('/movies', async (req, res) => {
  try {
    const { title, year, genre, poster_url, rating, watched } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const [result] = await pool.query(
      `INSERT INTO movies (title, year, genre, poster_url, rating, watched) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [title, year || null, genre || null, poster_url || null, 
       rating || null, watched || false]
    );

    const [newMovie] = await pool.query(
      'SELECT * FROM movies WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json(newMovie[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update movie
app.put('/movies/:id', async (req, res) => {
  try {
    const { title, year, genre, poster_url, rating, watched } = req.body;
    
    await pool.query(
      `UPDATE movies 
       SET title = COALESCE(?, title),
           year = COALESCE(?, year),
           genre = COALESCE(?, genre),
           poster_url = COALESCE(?, poster_url),
           rating = COALESCE(?, rating),
           watched = COALESCE(?, watched),
           updated_at = NOW()
       WHERE id = ?`,
      [title, year, genre, poster_url, rating, watched, req.params.id]
    );

    const [updated] = await pool.query(
      'SELECT * FROM movies WHERE id = ?',
      [req.params.id]
    );

    if (updated.length === 0) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    res.json(updated[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete movie
app.delete('/movies/:id', async (req, res) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM movies WHERE id = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    res.json({ message: 'Movie deleted successfully' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start server
const port = Number(process.env.PORT || 3001);
app.listen(port, () => {
  console.log(`🎬 Mini_Cini API listening on http://localhost:${port}`);
  console.log(`📊 Health check: http://localhost:${port}/health`);
});