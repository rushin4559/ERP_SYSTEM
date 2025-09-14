const mysql = require("mysql2/promise");

let pool = null;

/**
 * Initialize audit DB connection pool
 * @param {object} dbPool - The database connection pool
 */
function initAudit(dbPool) {
  pool = dbPool;
}

/**
 * Close audit DB pool (useful for tests/shutdown)
 */
async function closeAudit() {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

/**
 * Express middleware for auditing actions
 * @param {string} action - action name to log
 */
function audit(action, tableName = "audit_logs") {
  return async (req, res, next) => {
    res.on("finish", async () => {
      if (!pool) {
        console.warn("Audit pool not initialized");
        return;
      }

      try {
        const userId = req.user ? req.user.id : null; // from shared-auth
        await pool.query(
          `INSERT INTO ${tableName} (user_id, action, service, status, created_at) 
           VALUES (?, ?, ?, ?, NOW())`,
          [userId, action, req.baseUrl, res.statusCode]
        );
      } catch (err) {
        console.error("Audit log failed:", err.message);
      }
    });

    next();
  };
}

module.exports = {
  initAudit,
  closeAudit,
  audit,
};
