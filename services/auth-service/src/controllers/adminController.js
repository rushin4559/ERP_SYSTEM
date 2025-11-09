const { getDB } = require("@myorg/shared-db")
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
    const pool = getDB();
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
    const pool = getDB();

    let {
      page = 1,
      limit = 10,
      username,
      role,
      created_at_min,
      created_at_max,
      sort_by = "created_at",
      order = "desc",
    } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;

    // Base query components
    let baseQuery = "SELECT id, username, role, created_at FROM users";
    let countQuery = "SELECT COUNT(*) as total FROM users";

    // Filters array for WHERE clauses
    const filters = [];
    const params = [];

    // Build filters and params
    if (username) {
      filters.push("username LIKE ?");
      params.push(`%${username}%`);
    }
    if (role) {
      filters.push("role = ?");
      params.push(role);
    }
    if (created_at_min) {
      filters.push("created_at >= ?");
      params.push(created_at_min);
    }
    if (created_at_max) {
      filters.push("created_at <= ?");
      params.push(created_at_max);
    }

    // Compose WHERE clause if any filters exist
    const whereClause = filters.length ? " WHERE " + filters.join(" AND ") : "";

    // Finalize queries with filters
    const finalQuery = `${baseQuery}${whereClause} ORDER BY ${sort_by} ${order} LIMIT ? OFFSET ?`;
    const finalCountQuery = `${countQuery}${whereClause}`;

    // Add pagination params at the end for LIMIT and OFFSET
    const queryParams = [...params, limit, offset];

    // Execute main query
    const [rows] = await pool.query(finalQuery, queryParams);

    // Execute count query to get total records matching filters
    const [countResult] = await pool.query(finalCountQuery, params);
    const total = countResult[0].total;

    return res.status(200).json({
      success: true,
      users: rows,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("List users error:", err);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
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
    const pool = getDB();
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
    const pool = getDB();
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

async function deleteMultipleUsers(req, res) {
  const { ids } = req.body; // expect { ids: [1,2,3] }

  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: "Invalid request" });
  }

  try {
    const pool = getDB();
    // check if users exist
    const [existing] = await pool.query("SELECT id, username FROM users WHERE id IN (?)", [ids]);
    if (existing.length === 0) {
      return res.status(404).json({ error: "No users found" });
    }

    // delete users
    await pool.query("DELETE FROM users WHERE id IN (?)", [ids]);

    return res.json({
      message: "Users deleted successfully",
      deletedUsers: existing
    });
  } catch (err) {
    console.error("Delete multiple users error:", err.message);
    return res.status(500).json({ error: "Server error" });
  }
}

module.exports = { createUser, listUsers, updateUser, deleteUser, deleteMultipleUsers };
