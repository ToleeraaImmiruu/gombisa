const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const { createCheckout } = require("../controllers/checkout.controller");

const router = express.Router();
router.post("/", requireAuth, createCheckout);

module.exports = router;
