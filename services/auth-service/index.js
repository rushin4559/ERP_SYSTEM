// index.js (CommonJS)
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./src/routes/auth.js");
const adminRoutes = require("./src/routes/admin.js");
const userRoutes = require("./src/routes/user.js");
const pool = require("./src/db.js");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// mount routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);

// basic health
app.get("/", (req, res) => res.send("Auth Service Running 🚀"));

// DB-health endpoint (useful for k8s / checks)
app.get("/health", async (req, res) => {
  try {
    const conn = await pool.getConnection();
    await conn.query("SELECT 1");
    conn.release();
    return res.json({ db: "ok" });
  } catch (err) {
    return res.status(500).json({ db: "error", message: err.message });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Server error" });
});

const PORT = process.env.PORT || 4000;

// Start only after DB connection succeeds
async function start() {
  try {
    const conn = await pool.getConnection();
    await conn.query("SELECT 1");
    conn.release();
    console.log("✅ MySQL Database connected successfully!");
    const server = app.listen(PORT, () =>
      console.log(`Auth Service running on port ${PORT}`)
    );

    // graceful shutdown
    const shutdown = async () => {
      console.log("Shutting down...");
      server.close();
      try { await pool.end(); } catch (e) { /* ignore */ }
      process.exit(0);
    };
    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (err) {
    console.error("❌ MySQL Database connection failed:", err.message);
    process.exit(1);
  }
}

start();
