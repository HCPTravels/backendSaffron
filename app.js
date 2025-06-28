const express = require("express");
const app = express();
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const cors = require("cors");
app.use(cors());

require("dotenv").config();

// DB connection
connectDB();

// Middleware
app.use(express.json()); // For parsing JSON bodies

// Route mounting
app.use("/api/users", userRoutes); // So your full route is /api/users/signup

// Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
