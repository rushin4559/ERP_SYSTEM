const express = require("express");
const router = express.Router();
const { audit } = require("../middleware/audit");
const { login, logout } = require("../controllers/authController");

// POST /auth/login
router.post("/login", login);


module.exports = router;
