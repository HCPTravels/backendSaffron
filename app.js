const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./config/db");
const routes = require("./routes"); // this auto-loads index.js

require("dotenv").config();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api", routes); // ✅ route: /api/product/create

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));