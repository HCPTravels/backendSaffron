const express = require("express");
const router = express.Router();

const userRoutes = require("./userRoutes");
const emailRoutes = require("./emailOtpRoutes");
const sellerRoutes = require("./sellerRoutes");
const productRoutes = require("./productRoutes");
const authRoutes = require("./authRoutes"); // ✅ Add this line
const cartRoutes = require("../routes/cartRoutes");
const paymentRoutes = require("./paymentRoutes"); // ✅ Import payment routes
const uploadRoutes = require("../routes/uploadRoutes")
const contactRoutes = require("../routes/contactRoutes")
const wishlistRoutes = require("./wishlistRoutes");

router.use("/user", userRoutes);
router.use("/email", emailRoutes);
router.use("/seller", sellerRoutes);
router.use("/product", productRoutes);
router.use("/auth", authRoutes); // ✅ Mount Google auth routes here
router.use("/cart", cartRoutes);
router.use("/payment", paymentRoutes); // ✅ Mount payment routes here
router.use("/image", uploadRoutes)
router.use("/contact", contactRoutes)
router.use("/wishlist", wishlistRoutes)

module.exports = router;
