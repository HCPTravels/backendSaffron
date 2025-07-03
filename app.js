const express = require("express");
const app = express();
const connectDB = require("./config/db");
const routes = require("./routes");
const cors = require("cors");
require("dotenv").config();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api", routes); // Route: /api/email/send-otp

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
