// ============================================================================
// PREPAXIS BACKEND SERVER
// ============================================================================
// Express.js server that handles resume review API requests
// Connects to MySQL database to store and retrieve resume review data
// ============================================================================

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory of the current file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from backend/.env file (go up from dist to backend folder)
const envPath = path.resolve(__dirname, '..', '.env');
dotenv.config({ path: envPath });

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5001;

// MySQL connection pool (manages multiple database connections efficiently)
let pool: any;

// ============================================================================
// DATABASE INITIALIZATION
// ============================================================================
/**
 * Connects to MySQL database and creates the resumeReviews table if needed
 */
async function initializeDatabase() {
  try {
    // Create a MySQL connection pool with configuration from .env
    pool = await mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER || 'prepaxis',
      password: process.env.DB_PASSWORD || 'prepaxis123',
      database: process.env.DB_NAME || 'prepaxis',
      waitForConnections: true,
      connectionLimit: 10, // Max 10 connections
      queueLimit: 0, // No limit on queued requests
    });

    console.log('✅ MySQL connected');

    // Create table if it doesn't exist (idempotent - safe to run multiple times)
    const connection = await pool.getConnection();

    await connection.query(`
      CREATE TABLE IF NOT EXISTS resumeReviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId VARCHAR(255) NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        atsScore INT NOT NULL,
        fileName VARCHAR(255) NOT NULL,
        summary LONGTEXT,
        suggestions JSON,
        INDEX idx_userId (userId),
        INDEX idx_timestamp (timestamp)
      ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
    `);

    connection.release();
    console.log('✅ Database initialized successfully');
    console.log(`📁 Database: ${process.env.DB_NAME || 'prepaxis'}`);
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  }
}

// ============================================================================
// MIDDLEWARE SETUP
// ============================================================================
// Enable CORS for frontend communication
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);

// Parse incoming JSON requests
app.use(express.json());

// ============================================================================
// API ROUTES
// ============================================================================

/**
 * Health check endpoint
 * GET /api/health
 * Returns: { status: 'Backend is running ✅' }
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running ✅' });
});

/**
 * Store a new resume review in the database
 * POST /api/resume-reviews
 * Body: { userId, atsScore, fileName, summary, suggestions }
 * Returns: { success: true, data: { id, userId, atsScore, fileName, summary, suggestions, timestamp } }
 */
app.post('/api/resume-reviews', async (req, res) => {
  try {
    const { userId, atsScore, fileName, summary, suggestions } = req.body;

    // Validate required fields
    if (!userId || !atsScore || !fileName || !summary || !suggestions) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    // Get a connection from the pool
    const connection = await pool.getConnection();

    // Insert the new resume review into the database
    const [result] = await connection.query(
      'INSERT INTO resumeReviews (userId, atsScore, fileName, summary, suggestions) VALUES (?, ?, ?, ?, ?)',
      [userId, atsScore, fileName, summary, JSON.stringify(suggestions)]
    );

    connection.release();

    // Return success with the inserted review data
    res.status(201).json({
      success: true,
      data: {
        id: result.insertId,
        userId,
        atsScore,
        fileName,
        summary,
        suggestions,
        timestamp: new Date(),
      },
    });
  } catch (error) {
    console.error('Error storing review:', error);
    res.status(500).json({ error: 'Failed to store review' });
  }
});

/**
 * Fetch all resume reviews for a user
 * GET /api/resume-reviews?userId=USER_ID&limit=5
 * Query params: userId (required), limit (optional, default 5)
 * Returns: { success: true, data: [ { id, userId, timestamp, atsScore, fileName, summary, suggestions }, ... ] }
 */
app.get('/api/resume-reviews', async (req, res) => {
  try {
    const userId = req.query.userId as string;
    const limit = parseInt(req.query.limit as string) || 5;

    // Validate userId parameter
    if (!userId) {
      res.status(400).json({ error: 'userId query parameter is required' });
      return;
    }

    // Get a connection from the pool
    const connection = await pool.getConnection();

    // Query reviews for this user, ordered by newest first, with limit
    const [rows] = await connection.query(
      'SELECT id, userId, timestamp, atsScore, fileName, summary, suggestions FROM resumeReviews WHERE userId = ? ORDER BY timestamp DESC LIMIT ?',
      [userId, limit]
    );

    connection.release();

    // Parse suggestions JSON and format the response
    const reviews = (rows as any[]).map((row) => ({
      id: row.id,
      userId: row.userId,
      timestamp: new Date(row.timestamp),
      atsScore: row.atsScore,
      fileName: row.fileName,
      summary: row.summary,
      suggestions: typeof row.suggestions === 'string' ? JSON.parse(row.suggestions) : row.suggestions || [],
    }));

    res.json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

/**
 * Get a specific resume review by ID
 * GET /api/resume-reviews/:id?userId=USER_ID
 * Params: id (review ID)
 * Query params: userId (required for security - verify ownership)
 * Returns: { success: true, data: { id, userId, timestamp, atsScore, fileName, summary, suggestions } }
 */
app.get('/api/resume-reviews/:id', async (req, res) => {
  try {
    const userId = req.query.userId as string;
    const reviewId = parseInt(req.params.id);

    // Validate userId parameter
    if (!userId) {
      res.status(400).json({ error: 'userId query parameter is required' });
      return;
    }

    // Get a connection from the pool
    const connection = await pool.getConnection();

    // Query the specific review (ensure user owns it)
    const [rows] = await connection.query(
      'SELECT id, userId, timestamp, atsScore, fileName, summary, suggestions FROM resumeReviews WHERE id = ? AND userId = ?',
      [reviewId, userId]
    );

    connection.release();

    // Check if review exists
    if ((rows as any[]).length === 0) {
      res.status(404).json({ error: 'Review not found' });
      return;
    }

    // Parse and return the review data
    const row = (rows as any[])[0];
    res.json({
      success: true,
      data: {
        id: row.id,
        userId: row.userId,
        timestamp: new Date(row.timestamp),
        atsScore: row.atsScore,
        fileName: row.fileName,
        summary: row.summary,
        suggestions: typeof row.suggestions === 'string' ? JSON.parse(row.suggestions) : row.suggestions || [],
      },
    });
  } catch (error) {
    console.error('Error fetching review:', error);
    res.status(500).json({ error: 'Failed to fetch review' });
  }
});

/**
 * Delete a resume review
 * DELETE /api/resume-reviews/:id?userId=USER_ID
 * Params: id (review ID)
 * Query params: userId (required for security - verify ownership before deleting)
 * Returns: { success: true, message: 'Review deleted successfully' }
 */
app.delete('/api/resume-reviews/:id', async (req, res) => {
  try {
    const userId = req.query.userId as string;
    const reviewId = parseInt(req.params.id);

    // Validate userId parameter
    if (!userId) {
      res.status(400).json({ error: 'userId query parameter is required' });
      return;
    }

    // Get a connection from the pool
    const connection = await pool.getConnection();

    // Delete the review (ensure user owns it)
    const [result] = await connection.query(
      'DELETE FROM resumeReviews WHERE id = ? AND userId = ?',
      [reviewId, userId]
    );

    connection.release();

    // Check if a row was actually deleted
    if ((result as any).affectedRows === 0) {
      res.status(404).json({ error: 'Review not found' });
      return;
    }

    res.json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ error: 'Failed to delete review' });
  }
});

// ============================================================================
// SERVER STARTUP
// ============================================================================
/**
 * Initialize database and start the Express server
 */
async function startServer() {
  try {
    // Initialize the database connection
    await initializeDatabase();

    // Start listening for incoming requests
    app.listen(PORT, () => {
      console.log(`🚀 Backend server running on http://localhost:${PORT}`);
      console.log(`✅ API ready at http://localhost:${PORT}/api`);
      console.log(`📝 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();
