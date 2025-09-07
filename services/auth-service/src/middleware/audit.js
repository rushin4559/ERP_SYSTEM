const pool = require("../db");

// function to log action
async function logAction(userId, action, ipAddress) {
  try {
    await pool.query(
      "INSERT INTO audit_logs (user_id, action, ip_address) VALUES (?, ?, ?)",
      [userId, action, ipAddress]
    );
  } catch (err) {
    console.error("Audit log failed:", err.message);
  }
}

// middleware wrapper
function audit(action) {
  return (req, res, next) => {
    // save original res.end
    const originalEnd = res.end;

    res.end = async function (...args) {
      try {
        if (req.user) {
          // log after response is sent
          await logAction(req.user.id, action, req.ip);
        }
      } catch (e) {
        console.error("Audit middleware error:", e.message);
      }
      originalEnd.apply(res, args);
    };

    next();
  };
}

module.exports = { audit, logAction };
