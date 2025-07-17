const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../modals/Orders");
const Cart = require('../modals/Cart');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Step 1: Create Razorpay Order (NO DB order here)
const createOrder = async (req, res) => {
  const { amount, currency } = req.body;
  console.log("body", req.body);

  const options = {
    amount: Math.round(Number(amount) * 100), // Ensure integer value in paise
    currency: currency,
    receipt: `rcpt_${Date.now()}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error("Error creating Razorpay order", error);
    res.status(500).send("Unable to create order");
  }
};

// Step 2: Verify Payment Signature and Create DB Order
// ... existing code ...
const verifyPayment = async (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature, items } = req.body;
  const userId = req.user._id;
  const userEmail = req.user.email;

  const generated_signature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  const isValid = generated_signature === razorpay_signature;

  if (isValid) {
    try {
      // Map items to flatten productId and price if needed
      const orderItems = items.map(item => ({
        productId: item.productId._id || item.productId, // handle both populated and id-only
        quantity: item.quantity,
        price: item.productId.price || item.price // support both structures
      }));

      // Calculate total amount robustly
      const totalAmount = orderItems.reduce((sum, item) => sum + ((item.price || 0) * item.quantity), 0);

      // Create order in DB after payment is verified
      const order = await Order.create({
        userId,
        userEmail,
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        amount: totalAmount,
        currency: "INR",
        status: "PAID",
        items: orderItems, // save the flattened items
      });

      // Clear cart after payment
      await Cart.findOneAndUpdate(
        { userId },
        { $set: { items: [] } }
      );

      return res.json({ success: true, order });
    } catch (err) {
      console.error("Error during post-payment handling:", err);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  } else {
    return res
      .status(400)
      .json({ success: false, message: "Invalid signature" });
  }
};
// ... existing code ...

const getOrders = async (req, res) => {
  const userId = req.user._id;

  try {
    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .populate("items.productId"); // Populate product details for each item
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders", error);
    res.status(500).send("Unable to fetch orders");
  }
};

const deleteOrder = async (req, res) => {
  const orderId = req.params.id;

  try {
    const order = await Order.findByIdAndDelete(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order", error);
    res.status(500).send("Unable to delete order");
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  getOrders,
  deleteOrder,
};