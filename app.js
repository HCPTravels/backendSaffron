const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./config/db");
const routes = require("./routes"); // this auto-loads index.js
const passport = require("passport");
const session = require("express-session");
require("dotenv").config();

// Initialize DB
connectDB();

// ✅ Configure Passport strategy
require("./config/passport");

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Session middleware (required if using sessions)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
  })
);

// ✅ Initialize passport and session
app.use(passport.initialize());
app.use(passport.session());

// ✅ All API routes (including Google auth)
app.use("/api", routes);          // e.g. /api/user/login
app.use("/auth", require("./routes/authRoutes"));  // e.g. /auth/google

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));