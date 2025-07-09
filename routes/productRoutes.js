const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const authUsers = require("../middlewares/authUsers");
const authAdmin = require("../middlewares/authAdmin")

const {
  createSellerProduct,
  getSellerProducts,
  deleteProduct,
  getPendingProducts,
  approvedProduct,
  getApprovedProducts
} = require("../controllers/SellerProductController");

// Seller routes (authenticated user)
router.post("/create", authMiddleware, createSellerProduct);
router.get("/get", authMiddleware, getSellerProducts);
router.delete("/delete/:productId", authMiddleware, deleteProduct);

// Admin-only routes
router.get("/get/pending", authAdmin, getPendingProducts);
router.patch("/approve/:id", authAdmin, approvedProduct);

// User + Admin can see approved products
router.get("/approved/product", authUsers, getApprovedProducts);

// Test route
router.get("/test", (req, res) => {
  res.send("✅ product route is working");
});

module.exports = router;