const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./src/config/db.js");
const residentRoutes = require("./src/routes/residentRoutes");
const authorityRoutes = require("./src/routes/authorityRoutes");
const mailRoutes = require("./src/routes/mailRoutes");
const dashboardRoutes = require("./src/routes/dashboardRoutes");
const alertRoutes = require("./src/routes/alertRoutes.js");
const http = require("http");
const path = require("path");

dotenv.config()

// Initialize express app
const app = express();


// Database connection
connectDB();

// Middleware
app.use(express.json());
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    process.env.FRONTEND_URL || "https://sentinel-iq-mu.vercel.app"
  ],
  credentials: true
}));



// Serve static files
app.use("/data", express.static(path.join(__dirname, "data")));

// Routes

app.use("/api/alerts", alertRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/residents", residentRoutes);
app.use("/api/authorities", authorityRoutes);
app.use("/api/mail", mailRoutes);

// Health check & root route (so browser doesn't show "Cannot GET /")
app.get("/", (req, res) => {
  res.json({
    status: "✅ SentinelIQ Backend is Live",
    version: "1.0.0",
    routes: [
      "/api/alerts/fetch-alerts",
      "/api/alerts/fetch-alert-count",
      "/api/dashboard",
      "/api/residents",
      "/api/authorities",
      "/api/mail"
    ]
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Start server
const PORT = process.env.PORT || 5000;
// Allow the server to be accessible from the local network
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT} (Local)`);
  // Start MongoDB Change Stream watching
  const { watchAlerts } = require("./src/services/caseService.js");
  watchAlerts();
});