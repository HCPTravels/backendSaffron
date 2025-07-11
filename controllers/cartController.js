const Cart = require("../modals/Cart.js");

const addToCart = async (req, res) => {
  const userId = req.user._id;
  const { productId, quantity } = req.body;

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [{ productId, quantity }] });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }
    }

    await cart.save();
    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getCart = async (req, res) => {
  const userId = req.user._id;

  try {
    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart) {
      return res.status(200).json({ items: [] }); // Return empty if no cart
    }

    // ✅ Filter out corrupted items with missing product
    const filteredItems = cart.items.filter((item) => item.productId !== null);

    res.status(200).json({ items: filteredItems });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateQuantity = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;
    const { quantity } = req.body;
    console.log("userid", userId);

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    item.quantity = quantity;
    await cart.save();

    res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error("Error updating cart quantity:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// NEW: Remove item endpoint
const removeItem = async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.params;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    await cart.save();

    res.json({
      success: true,
      cart: await Cart.findOne({ userId }).populate("items.productId"),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log("🧹 Clearing cart for user:", userId);

    // Check if cart exists
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      console.log("⚠️ No cart found");
      return res.status(404).json({ message: "Cart not found" });
    }

    // Clear the items array
    cart.items = [];
    await cart.save();

    console.log("✅ Cart cleared successfully");
    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    console.error("❌ Error clearing cart:", error);
    res
      .status(500)
      .json({ message: "Error clearing cart", error: error.message });
  }
};

module.exports = {
  addToCart,
  getCart,
  updateQuantity, // Export the new functions
  removeItem,
  clearCart,
};
