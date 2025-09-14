const express = require("express");
const router = express.Router();
const { requireAuth } = require("@myorg/shared-auth");
const { audit } = require("@myorg/shared-audit");
const { updateProfile, changePassword } = require("../controllers/userController");

// PUT /user/profile → update own username
router.put("/profile",
  requireAuth,
  audit("PROFILE_UPDATE"),
  updateProfile
);

// PUT /user/change-password → update own password
router.put("/change-password",
  requireAuth,
  audit("CHANGE_PASSWORD"),
  changePassword
);

module.exports = router;
