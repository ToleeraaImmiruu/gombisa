const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const env = require("./config/env");
const webhookRoutes = require("./routes/webhook.routes");
const checkoutRoutes = require("./routes/checkout.routes");
const errorHandler = require("./middleware/errorHandler");

const app = express();
app.use(helmet());
app.use(cors({ origin: env.clientUrl }));

// 1. Webhook FIRST: it needs the raw body, before express.json()
app.use("/webhook", webhookRoutes);

// 2. JSON for everything else
app.use(express.json({ limit: "100kb" }));
app.use("/api", rateLimit({ windowMs: 15 * 60 * 1000, limit: 100 }));
app.use("/api/checkout", checkoutRoutes);

app.get("/health", (_req, res) => res.send("ok"));

app.use(errorHandler);
module.exports = app;
