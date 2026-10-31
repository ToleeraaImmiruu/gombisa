const express = require("express");
const { chapaWebhook, chapaCallback } = require("../controllers/webhook.controller");

const router = express.Router();
router.get("/chapa/callback", chapaCallback);
router.post("/chapa", express.raw({ type: "*/*" }), chapaWebhook); // raw body needed for the signature

module.exports = router;
