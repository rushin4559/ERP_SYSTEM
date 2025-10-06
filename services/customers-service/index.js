const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");

// Import the single router for this service
const customerRoutes = require("./src/routes/customer.js");

// Import shared libraries
const { initDB } = require("@myorg/shared-db");
const { initAudit } = require("@myorg/shared-audit");

// --- Initialization ---

// 1. Initialize the database connection pool once
// We use DB_PASS here to match the user's provided auth-service example structure
const pool = initDB({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS, 
    database: process.env.DB_NAME,
    connectionLimit: 15 // Slightly higher connection limit for heavy data service
});

// 2. Give the active database pool to the auditing library
initAudit(pool);


const app = express();

// --- Middleware Setup ---
app.use(cors());
app.use(express.json());

// 3. Mount routes
// All customer endpoints start with /api/customers
app.use("/api/customers", customerRoutes);

// --- Health and Utility Endpoints ---

// Basic service health check
app.get("/", (req, res) => res.send("Customers Service Running 🚀"));

// Database-health endpoint (crucial for monitoring)
app.get("/health", async (req, res) => {
    try {
        const conn = await pool.getConnection();
        await conn.query("SELECT 1"); // Simple query to check connection
        conn.release();
        return res.json({ service: "ok", db: "ok" });
    } catch (err) {
        return res.status(503).json({ service: "ok", db: "error", message: "DB Connection Failed" });
    }
});

// --- Error Handlers ---

// 404 Not Found handler
app.use((req, res) => {
    res.status(404).json({ error: "Endpoint not found in Customers Service" });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(`Global Error Handler: ${err.message}`, err);
    res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
});

const PORT = process.env.PORT || 3001; // Use 3001, distinct from Auth Service (4000)

// --- Server Startup ---

// Start the server only after a successful DB connection test
async function start() {
    try {
        // Test connection before starting the listener
        const conn = await pool.getConnection();
        await conn.query("SELECT 1");
        conn.release();
        console.log("✅ MySQL Database connected successfully!");
        
        const server = app.listen(PORT, '0.0.0.0', () =>
            console.log(`Customers Service running on port ${PORT}`)
        );

        // Graceful shutdown procedure
        const shutdown = async () => {
            console.log("Shutting down Customers Service...");
            server.close();
            try { await pool.end(); } catch (e) { console.error("Error closing pool:", e.message); }
            process.exit(0);
        };
        
        process.on("SIGINT", shutdown); // Catch Ctrl+C
        process.on("SIGTERM", shutdown); // Catch Kubernetes/Docker stop signals

    } catch (err) {
        console.error("❌ Critical: MySQL Database connection failed. Exiting:", err.message);
        // Exit process if DB connection fails
        process.exit(1); 
    }
}

start();
