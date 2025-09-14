const express = require("express");
const jwt = require("jsonwebtoken");
const { requireAuth, requireAdmin } = require("../index");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const SECRET = process.env.JWT_SECRET || "mysecret";

// Dummy route → anyone with token
app.get("/profile", requireAuth, (req, res) => {
  res.json({ message: `Hello ${req.user.name}`, user: req.user });
});

// Admin-only route
app.get("/admin", requireAuth, requireAdmin, (req, res) => {
  res.json({ message: "Welcome admin!" });
});

// Fake login (to generate token)
app.get("/login", (req, res) => {
  const token = jwt.sign({ name: "Rushi", role: "admin" }, SECRET, {
    expiresIn: "1h",
  });
  res.json({ token });
});

app.listen(5000, () => console.log("Test server running on http://localhost:5000"));
