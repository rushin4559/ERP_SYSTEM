const pool = require("../db");
const { hashPassword } = require("../utils/hash");

(async () => {
  try {
    const passwordHash = await hashPassword("admin123");

    await pool.query(
      "INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)",
      ["admin", passwordHash, "admin"]
    );

    console.log("✅ Admin user created successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error creating admin:", err);
    process.exit(1);
  }
})();
