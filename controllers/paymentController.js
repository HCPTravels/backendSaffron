const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../modals/Orders");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Step 1: Create Razorpay Order
const createOrder = async (req, res) => {
  const userId = req.user._id;
  const userEmail = req.user.email;
  const { amount, currency } = req.body;
  console.log("body", req.body);

  options = {
    amount: amount * 100, // Ensure integer value
    currency: currency,
    receipt: `rcpt_${Date.now()}`,
  };

  try {
    const order = await razorpay.orders.create(options);

    await Order.create({
      userId: userId,
      userEmail: userEmail,
      razorpayOrderId: order.id,
      amount: amount,
      currency: currency,
      status: "CREATED",
    });

    res.json(order);
  } catch (error) {
    console.error("Error creating Razorpay order", error);
    res.status(500).send("Unable to create order");
  }
};

// Step 2: Verify Payment Signature
const verifyPayment = async (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
    req.body;

  const generated_signature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  const isValid = generated_signature === razorpay_signature;

  if (isValid) {
    // ✅ Save payment info in Orders collection
    await Order.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        status: "PAID",
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
      }
    );

    return res.json({ success: true });
  } else {
    return res
      .status(400)
      .json({ success: false, message: "Invalid signature" });
  }
};

const getOrders = async (req, res) => {
  const userId = req.user._id;

  try {
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
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
