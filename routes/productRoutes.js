const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const authUsers = require("../middlewares/authUsers");
const authAdmin = require("../middlewares/authAdmin");
const upload = require('../middlewares/multer');
const authUserOrAdmin = require('../middlewares/authUserOrAdmin')


const {
  createSellerProduct,
  getSellerProducts,
  deleteProduct,
  getPendingProducts,
  approvedProduct,
  getApprovedProducts,
  getApprovedProductsById,
  rejectProduct,
  getRejectedProduct 

} = require("../controllers/SellerProductController");

// Seller routes (authenticated user)
router.post("/create", authMiddleware,upload.array('images', 5), createSellerProduct);
router.get("/get", authMiddleware, getSellerProducts);
router.delete("/delete/:productId", authMiddleware, deleteProduct);

// Admin-only routes
router.get("/get/pending", authAdmin, getPendingProducts);
router.patch("/approve/:id", authAdmin, approvedProduct);
router.patch("/reject/:id", authAdmin, rejectProduct);
// User + Admin can see approved products
router.get("/approved/product", authUserOrAdmin, getApprovedProducts);
router.get("/approved/product/:id", authUsers, getApprovedProductsById);
router.get("/rejected/product",authAdmin, getRejectedProduct )

// Test route
router.get("/test", (req, res) => {
  res.send("✅ product route is working");
});

module.exports = router;
