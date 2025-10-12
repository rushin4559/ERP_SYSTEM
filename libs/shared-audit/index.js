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
        const username = req.user ? req.user.username : null; // get username from authenticated user
        console.log(`Auditing action: ${action} by user: ${username}`);
        await pool.query(
          `INSERT INTO ${tableName} (username, action, service, status, created_at) 
           VALUES (?, ?, ?, ?, NOW())`,
          [username, action, req.baseUrl, res.statusCode]
        );
        console.log(`Audit log created for action: ${action} by user: ${username}`);
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
