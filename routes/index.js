const express = require("express");
const router = express.Router();
const userRoutes = require("./userRoutes");
const emailRoutes = require("./emailOtpRoutes");
const sellerRoutes = require("./sellerRoutes");

router.use("/user", userRoutes);
router.use("/email", emailRoutes);
router.use("/seller", sellerRoutes);

module.exports = router;
