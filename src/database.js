const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Caminho do banco de dados
const DB_PATH = path.join(__dirname, '../data/analytics.db');

let db = null;

/**
 * Inicializa o banco de dados SQLite
 */
function initDatabase() {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('Error opening database:', err);
        reject(err);
        return;
      }

      console.log('📦 Database connected');

      // Cria tabela de visualizações
      db.run(`
        CREATE TABLE IF NOT EXISTS views (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          page TEXT NOT NULL,
          user_agent TEXT,
          ip TEXT,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) {
          console.error('Error creating table:', err);
          reject(err);
          return;
        }

        // Cria índice para melhorar performance
        db.run(`
          CREATE INDEX IF NOT EXISTS idx_page ON views(page)
        `, (err) => {
          if (err) {
            console.error('Error creating index:', err);
            reject(err);
            return;
          }

          console.log('✅ Database initialized successfully');
          resolve();
        });
      });
    });
  });
}

/**
 * Insere uma nova visualização
 */
function insertView(page, userAgent, ip) {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO views (page, user_agent, ip)
      VALUES (?, ?, ?)
    `;

    db.run(query, [page, userAgent, ip], function(err) {
      if (err) {
        reject(err);
        return;
      }

      resolve({
        id: this.lastID,
        page,
        userAgent,
        ip,
        timestamp: new Date().toISOString()
      });
    });
  });
}

/**
 * Retorna total de visualizações
 */
function getTotalViews() {
  return new Promise((resolve, reject) => {
    db.get('SELECT COUNT(*) as total FROM views', (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(row.total);
    });
  });
}

/**
 * Retorna visualizações por página
 */
function getViewsByPage() {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT page, COUNT(*) as views
      FROM views
      GROUP BY page
      ORDER BY views DESC
    `;

    db.all(query, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }

      const pages = {};
      rows.forEach(row => {
        pages[row.page] = row.views;
      });

      resolve(pages);
    });
  });
}

/**
 * Retorna estatísticas de uma página específica
 */
function getPageStats(page) {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT COUNT(*) as views
      FROM views
      WHERE page = ?
    `;

    db.get(query, [page], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      resolve({
        page,
        views: row.views
      });
    });
  });
}

/**
 * Retorna visualizações recentes
 */
function getRecentViews(limit = 10) {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT * FROM views
      ORDER BY timestamp DESC
      LIMIT ?
    `;

    db.all(query, [limit], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(rows);
    });
  });
}

/**
 * Fecha a conexão com o banco
 */
function closeDatabase() {
  return new Promise((resolve, reject) => {
    if (db) {
      db.close((err) => {
        if (err) {
          reject(err);
          return;
        }
        console.log('Database connection closed');
        resolve();
      });
    } else {
      resolve();
    }
  });
}

module.exports = {
  initDatabase,
  insertView,
  getTotalViews,
  getViewsByPage,
  getPageStats,
  getRecentViews,
  closeDatabase
};