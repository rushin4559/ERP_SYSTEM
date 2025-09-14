const dotenv = require("dotenv");
dotenv.config();

const { initDB } = require("@myorg/shared-db")

// 1. init pool once
const pool = initDB({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "Keshrushi@45",
  database: process.env.DB_NAME || "erpdb",
});
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
