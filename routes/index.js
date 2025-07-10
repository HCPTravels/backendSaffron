const express = require("express");
const router = express.Router();

const userRoutes = require("./userRoutes");
const emailRoutes = require("./emailOtpRoutes");
const sellerRoutes = require("./sellerRoutes");
const productRoutes = require("./productRoutes");
const authRoutes = require("./authRoutes"); // ✅ Add this line
const cartRoutes = require("../routes/cartRoutes");
const paymentRoutes = require("./paymentRoutes"); // ✅ Import payment routes

router.use("/user", userRoutes);
router.use("/email", emailRoutes);
router.use("/seller", sellerRoutes);
router.use("/product", productRoutes);
router.use("/auth", authRoutes); // ✅ Mount Google auth routes here
router.use("/cart", cartRoutes);
router.use("/payment", paymentRoutes); // ✅ Mount payment routes here

module.exports = router;
