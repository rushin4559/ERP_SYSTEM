const bcrypt = require("bcryptjs");
const pool = require("../db");
const { hashPassword } = require("../utils/hash");

// POST /admin/create-user
async function createUser(req, res) {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ error: "Username, password and role required" });
  }

  if (!["admin", "user"].includes(role)) {
    return res.status(400).json({ error: "Invalid role. Must be 'admin' or 'user'." });
  }

  try {
    // check if username already exists
    const [exists] = await pool.query("SELECT id FROM users WHERE username = ?", [username]);
    if (exists.length > 0) {
      return res.status(400).json({ error: "Username already taken" });
    }

    // hash password
    const hash = await hashPassword(password);

    // insert user
    const [result] = await pool.query(
      "INSERT INTO users (username, password_hash, role, created_at) VALUES (?, ?, ?, NOW())",
      [username, hash, role]
    );

    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: result.insertId,
        username,
        role,
        created_at: new Date().toISOString()
      }
    });
  } catch (err) {
    console.error("Create user error:", err.message);
    return res.status(500).json({ error: "Server error" });
  }
}

// GET /admin/users
async function listUsers(req, res) {
  try {
    // select only safe fields (no password hash!)
    const [rows] = await pool.query(
      "SELECT id, username, role, created_at FROM users ORDER BY created_at DESC"
    );

    return res.json({
      users: rows
    });
  } catch (err) {
    console.error("List users error:", err.message);
    return res.status(500).json({ error: "Server error" });
  }
}

// PUT /admin/update-user/:id
async function updateUser(req, res) {
  const userId = req.params.id;
  const { username, role } = req.body;

  if (!username && !role) {
    return res.status(400).json({ error: "At least one field (username or role) required" });
  }

  if (role && !["admin", "user"].includes(role)) {
    return res.status(400).json({ error: "Invalid role. Must be 'admin' or 'user'." });
  }

  try {
    // check if user exists
    const [existing] = await pool.query("SELECT id FROM users WHERE id = ?", [userId]);
    if (existing.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // if username provided, check duplicate
    if (username) {
      const [checkDup] = await pool.query(
        "SELECT id FROM users WHERE username = ? AND id <> ?",
        [username, userId]
      );
      if (checkDup.length > 0) {
        return res.status(400).json({ error: "Username already taken" });
      }
    }

    // build dynamic update
    let fields = [];
    let values = [];

    if (username) {
      fields.push("username = ?");
      values.push(username);
    }

    if (role) {
      fields.push("role = ?");
      values.push(role);
    }

    values.push(userId);

    const query = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;
    await pool.query(query, values);

    // fetch updated user
    const [updatedUser] = await pool.query(
      "SELECT id, username, role, created_at FROM users WHERE id = ?",
      [userId]
    );

    return res.json({
      message: "User updated successfully",
      user: updatedUser[0]
    });
  } catch (err) {
    console.error("Update user error:", err.message);
    return res.status(500).json({ error: "Server error" });
  }
}

// DELETE /admin/delete-user/:id
async function deleteUser(req, res) {
  const userId = req.params.id;

  try {
    // check if user exists
    const [existing] = await pool.query("SELECT id, username FROM users WHERE id = ?", [userId]);
    if (existing.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // delete user
    await pool.query("DELETE FROM users WHERE id = ?", [userId]);

    return res.json({
      message: "User deleted successfully",
      deletedUser: existing[0]   // पहिला user object
    });
  } catch (err) {
    console.error("Delete user error:", err.message);
    return res.status(500).json({ error: "Server error" });
  }
}

module.exports = { createUser, listUsers, updateUser, deleteUser };
