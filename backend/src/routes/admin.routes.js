const express = require("express");
const { listUsers, setRole, deleteUser } = require("../controllers/admin.controller");

const router = express.Router();
router.get("/users", listUsers);
router.patch("/users/:id/role", setRole);
router.delete("/users/:id", deleteUser);

module.exports = router;
