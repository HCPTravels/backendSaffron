const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const authRole = require("../middlewares/authUsers");

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
router.get("/get/pending", authRole(['admin']), getPendingProducts);
router.patch("/approve/:id", authRole(['admin']), approvedProduct);

// User + Admin can see approved products
router.get("/approved/product", authRole(['admin', 'user']), getApprovedProducts);

// Test route
router.get("/test", (req, res) => {
  res.send("✅ product route is working");
});

module.exports = router;