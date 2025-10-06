
const jwt = require("jsonwebtoken");
const { getDB } = require("@myorg/shared-db");
const { comparePassword } = require("../utils/hash");

// POST /auth/login
async function login(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required" });
  }
  try {
    const pool = getDB();
    // find user (MySQL style)
    const [rows] = await pool.query("SELECT * FROM users WHERE username = ?", [username]);
    if (rows.length === 0) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    const user = rows[0];

    // check password
    const match = await comparePassword(password, user.password_hash);
    if (!match) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    // --- THE SIMPLEST FIX ---
    // Set the user object on the request. 
    // The audit middleware will read this when res.on("finish") is called.
    req.user = { id: user.id, username: user.username, role: user.role };
    // -------------------------

    // generate JWT
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1m" }
    );

    return res.json({
      message: "Login successful",
      token,
      user: { id: user.id, username: user.username, role: user.role }
    });
  } catch (err) {
    console.error("Login error:", err.message);
    return res.status(500).json({ error: "Server error" });
  }
}


module.exports = { login };
