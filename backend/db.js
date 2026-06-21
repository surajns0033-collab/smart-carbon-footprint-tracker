// db.js – SQLite database initialization and helper functions
import path from 'path';
import sqlite3Init from 'sqlite3';
import { fileURLToPath } from 'url';

const sqlite3 = sqlite3Init.verbose();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database file located in the backend folder
const DB_PATH = path.resolve(__dirname, 'data.sqlite');

export const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Failed to open SQLite database:', err.message);
    process.exit(1);
  }
  console.log('Connected to SQLite database at', DB_PATH);
});

// Helper function to safely add a column if it doesn't exist
const addColumnSafe = (tableName, columnName, columnDefinition) => {
  db.all(`PRAGMA table_info(${tableName});`, [], (err, columns) => {
    if (err) {
      console.error(`Error checking columns for table ${tableName}:`, err);
      return;
    }
    const exists = columns.some(col => col.name === columnName);
    if (!exists) {
      db.run(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnDefinition};`, (alterErr) => {
        if (alterErr) {
          console.error(`Error adding column ${columnName} to ${tableName}:`, alterErr.message);
        } else {
          console.log(`Successfully added column ${columnName} to ${tableName}`);
        }
      });
    }
  });
};

// Create tables if they do not exist
const init = () => {
  // Users table – stores profile and auth info (email placeholder)
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      name TEXT,
      country TEXT,
      state TEXT,
      city TEXT,
      householdSize INTEGER,
      createdAt TEXT DEFAULT (datetime('now')),
      updatedAt TEXT DEFAULT (datetime('now'))
    );`, (err) => {
      if (!err) {
        // Safe column additions for users
        addColumnSafe('users', 'xp', 'INTEGER DEFAULT 0');
        addColumnSafe('users', 'level', 'INTEGER DEFAULT 1');
        addColumnSafe('users', 'rank', 'INTEGER DEFAULT 0');
        addColumnSafe('users', 'profile_picture', 'TEXT');
      }
    });

    // Activities table – each logged activity
    db.run(`CREATE TABLE IF NOT EXISTS activities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      category TEXT,
      subCategory TEXT,
      amount REAL,
      unit TEXT,
      emissionKg REAL,
      timestamp TEXT DEFAULT (datetime('now')),
      FOREIGN KEY(userId) REFERENCES users(id)
    );`, (err) => {
      if (!err) {
        // Safe column additions for activities
        addColumnSafe('activities', 'vehicle_type', 'TEXT');
        addColumnSafe('activities', 'fuel_type', 'TEXT');
        addColumnSafe('activities', 'distance', 'REAL');
        addColumnSafe('activities', 'energy_kwh', 'REAL');
        addColumnSafe('activities', 'steps', 'INTEGER');
      }
    });

    // Datasets table – normalized emission factor data
    db.run(`CREATE TABLE IF NOT EXISTS datasets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      source TEXT,
      sector TEXT,
      country TEXT,
      region TEXT,
      year INTEGER,
      factor REAL,
      lastUpdated TEXT,
      confidence REAL
    );`);

    // Leaderboard aggregates
    db.run(`CREATE TABLE IF NOT EXISTS leaderboard (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      scope TEXT, -- global, country, state, city
      scopeValue TEXT, -- e.g., "India" for country
      totalReducedKg REAL,
      totalXP INTEGER,
      lastUpdated TEXT
    );`);

    // XP rules table for flexible scoring
    db.run(`CREATE TABLE IF NOT EXISTS xp_rules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      activity_type TEXT NOT NULL,
      points INTEGER NOT NULL,
      description TEXT
    );`, (err) => {
      if (!err) {
        // Populate default XP rules (run only if empty)
        db.get(`SELECT COUNT(*) as cnt FROM xp_rules;`, [], (ruleErr, row) => {
          if (!ruleErr && row && row.cnt === 0) {
            const stmt = db.prepare(`INSERT INTO xp_rules (activity_type, points, description) VALUES (?, ?, ?);`);
            stmt.run('transport_km', 10, 'Points per kilometer driven');
            stmt.run('home_energy_kwh', 5, 'Points per kWh of home energy');
            stmt.run('steps', 1, 'Points per step');
            stmt.finalize();
          }
        });
      }
    });

    // Location hierarchy tables
    db.run(`CREATE TABLE IF NOT EXISTS countries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      code TEXT
    );`);
    db.run(`CREATE TABLE IF NOT EXISTS states (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      country_id INTEGER,
      name TEXT NOT NULL,
      code TEXT,
      FOREIGN KEY(country_id) REFERENCES countries(id)
    );`);
    db.run(`CREATE TABLE IF NOT EXISTS cities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      state_id INTEGER,
      name TEXT NOT NULL,
      FOREIGN KEY(state_id) REFERENCES states(id)
    );`);
  });

  console.log('Database tables structure verification queued.');
};

init();

// Export helper functions for queries
export const run = (sql, params = []) => new Promise((resolve, reject) => {
  db.run(sql, params, function (err) {
    if (err) reject(err);
    else resolve(this);
  });
});

export const get = (sql, params = []) => new Promise((resolve, reject) => {
  db.get(sql, params, (err, row) => {
    if (err) reject(err);
    else resolve(row);
  });
});

export const all = (sql, params = []) => new Promise((resolve, reject) => {
  db.all(sql, params, (err, rows) => {
    if (err) reject(err);
    else resolve(rows);
  });
});
