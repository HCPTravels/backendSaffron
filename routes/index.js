const express = require("express");
const router = express.Router();
const userRoutes = require("./userRoutes");
const emailRoutes = require("./emailOtpRoutes");

router.use("/user", userRoutes);
router.use("/email", emailRoutes);

module.exports = router;
