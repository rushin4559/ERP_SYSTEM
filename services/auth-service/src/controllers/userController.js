const { getDB } = require("@myorg/shared-db")
const { comparePassword, hashPassword } = require("../utils/hash");

// PUT /user/profile → update own username
async function updateProfile(req, res) {
  const userId = req.user.id;
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  try {
    const pool = getDB();
    // check if username already exists
    const [exists] = await pool.query(
      "SELECT id FROM users WHERE username = ? AND id <> ?",
      [username, userId]
    );

    if (exists.length > 0) {
      return res.status(400).json({ error: "Username already taken" });
    }

    await pool.query(
      "UPDATE users SET username = ? WHERE id = ?",
      [username, userId]
    );

    return res.json({ message: "Profile updated successfully", username });
  } catch (err) {
    console.error("Profile update error:", err.message);
    return res.status(500).json({ error: "Server error" });
  }
}


// PUT /user/change-password → update own password
async function changePassword(req, res) {
  const userId = req.user.id;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: "Current and new password required" });
  }

  try {
    const pool = getDB();
    // get current hash
    const [rows] = await pool.query(
      "SELECT password_hash FROM users WHERE id = ?",
      [userId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = rows[0];
    const match = await comparePassword(currentPassword, user.password_hash);
    if (!match) {
      return res.status(400).json({ error: "Current password incorrect" });
    }

    const newHash = await hashPassword(newPassword);
    await pool.query(
      "UPDATE users SET password_hash = ? WHERE id = ?",
      [newHash, userId]
    );

    return res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("Password change error:", err.message);
    return res.status(500).json({ error: "Server error" });
  }
}


module.exports = { updateProfile, changePassword };
