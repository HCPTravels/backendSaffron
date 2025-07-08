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
// ✅ FIXED: Added PATCH method to the allowed methods
app.use(cors({
    origin: [
      // Local development
      'http://localhost:3000',
      'http://localhost:3001', 
      'http://localhost:5173',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
      'http://127.0.0.1:5173',
      // Production domains
      'https://www.kisansaffrononline.com',
      'https://kisansaffrononline.com',  // Without www
      'https://kisansaffrononline.vercel.app'  // If you have a Vercel subdomain
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], // 🔥 Added PATCH here
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    optionsSuccessStatus: 200
}));
  
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