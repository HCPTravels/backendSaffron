const express = require("express");
const {
  addToCart,
  getCart,
  updateQuantity,
  removeItem,
  clearCart,
} = require("../controllers/cartController");
const authUser = require("../middlewares/authUsers"); // 👈 new single-purpose middleware

const router = express.Router();

router.post("/add", authUser, addToCart); // ✅ no role array
router.get("/getcartproduct", authUser, getCart); // ✅ cleaner, safer
router.patch("/updatequantity/:productId", authUser, updateQuantity);
router.delete("/removeitem/:productId", authUser, removeItem);
router.delete("/clear", authUser, clearCart);

module.exports = router;
