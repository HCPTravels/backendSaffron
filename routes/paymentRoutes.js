const express = require("express");
const {
  createOrder,
  verifyPayment,
  getOrders,
  deleteOrder,
} = require("../controllers/paymentController");
const authUser = require("../middlewares/authUsers"); // 👈 new single-purpose middleware

const router = express.Router();

router.post("/create-order", authUser, createOrder);
router.post("/verify-payment", authUser, verifyPayment);
router.get("/getAllOrders", authUser, getOrders);
router.delete("/deleteOrder/:id", authUser, deleteOrder);

module.exports = router;
