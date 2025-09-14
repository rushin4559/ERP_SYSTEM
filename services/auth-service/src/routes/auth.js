const express = require("express");
const router = express.Router();
const { audit } = require("@myorg/shared-audit");
const { login } = require("../controllers/authController");

// POST /auth/login
router.post("/login", audit("LOGIN"), login);

module.exports = router;
