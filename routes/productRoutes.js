const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { createSellerProduct , getSellerProducts, deleteProduct} = require("../controllers/SellerProductController");

router.post("/create", authMiddleware, createSellerProduct);
router.get("/get", authMiddleware, getSellerProducts);
router.delete("/delete/:productId", authMiddleware, deleteProduct);

// test route
router.get("/test", (req, res) => {
  res.send("✅ product route is working");
});

module.exports = router;