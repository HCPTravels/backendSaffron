const express = require("express");
const { addToCart, getCart } = require("../controllers/cartController");
const authUser = require("../middlewares/authUsers"); // 👈 new single-purpose middleware

const router = express.Router();

router.post("/add", authUser, addToCart); // ✅ no role array
router.get("/getcartproduct", authUser, getCart); // ✅ cleaner, safer

module.exports = router;
