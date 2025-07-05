const express = require("express");
const router = express.Router();
const userRoutes = require("./userRoutes");
const emailRoutes = require("./emailOtpRoutes");
const sellerRoutes = require("./sellerRoutes");
const productRoutes = require("./productRoutes");

router.use("/user", userRoutes);
router.use("/email", emailRoutes);
router.use("/seller", sellerRoutes);
router.use("/product", productRoutes); // ✅ now /api/product/...
module.exports = router;
