const express = require("express");
const router = express.Router();
const { requireAuth, requireAdmin } = require("@myorg/shared-auth");
const { audit } = require("@myorg/shared-audit");
const {
  createUser,
  listUsers,
  updateUser,
  deleteUser
} = require("../controllers/adminController");

// POST /admin/create-user
router.post("/create-user",
  requireAuth, requireAdmin,
  audit("CREATE_USER"),
  createUser
);

// GET /admin/users
router.get("/users",
  requireAuth, requireAdmin,
  listUsers
);

// PUT /admin/update-user/:id
router.put("/update-user/:id",
  requireAuth, requireAdmin,
  audit("UPDATE_USER"),
  updateUser
);

// DELETE /admin/delete-user/:id
router.delete("/delete-user/:id",
  requireAuth, requireAdmin,
  audit("DELETE_USER"),
  deleteUser
);

module.exports = router;
