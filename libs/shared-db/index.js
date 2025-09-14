const mysql = require("mysql2/promise");

let pool = null;

/**
 * Initialize the database connection pool.
 * Call this ONCE at microservice startup.
 * @param {object} config { host, user, password, database, connectionLimit }
 */
function initDB(config) {
  if (!pool) {
    pool = mysql.createPool({
      host: config.host,
      user: config.user,
      password: config.password,
      database: config.database,
      waitForConnections: true,
      connectionLimit: config.connectionLimit || 10,
    });
    console.log(`[shared-db] Connected to database: ${config.database}`);
  }
  return pool;
}

/**
 * Get the active pool (after initDB has been called).
 */
function getDB() {
  if (!pool) {
    throw new Error("[shared-db] DB not initialized. Call initDB first.");
  }
  return pool;
}

/**
 * Close the pool (for graceful shutdown or testing).
 */
async function closeDB() {
  if (pool) {
    await pool.end();
    pool = null;
    console.log("[shared-db] Connection pool closed.");
  }
}

module.exports = {
  initDB,
  getDB,
  closeDB,
};
