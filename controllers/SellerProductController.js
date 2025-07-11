const SellerProduct = require('../modals/SellerProduct');
const Seller = require('../modals/Seller');
const cloudinary = require('../utils/cloudinary');

const createSellerProduct = async (req, res) => {
  try {
    const { name, grade, price, description, stock, origin } = req.body;

    if (!name || !grade || !price || !description || !stock || !origin || !req.files) {
      return res.status(400).json({ success: false, error: "All fields are mandatory including images" });
    }

    // Upload each file to Cloudinary and collect URLs
    const imageUploadPromises = req.files.map(file => {
      const base64Image = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
      return cloudinary.uploader.upload(base64Image, { folder: 'products' });
    });

    const uploadResults = await Promise.all(imageUploadPromises);
    const imageUrls = uploadResults.map(result => result.secure_url);

    const newProduct = await SellerProduct.create({
      name,
      grade,
      price,
      description,
      images: imageUrls,
      stock,
      origin,
      seller: req.seller._id // Assumes authentication middleware sets this
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: newProduct
    });

  } catch (err) {
    console.error("Error creating product:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};
// Updated backend function - replace your existing getSellerProducts function
const getSellerProducts = async (req, res) => {
  try {
    console.log("=== GET SELLER PRODUCTS DEBUG ===");
    console.log("Request Headers:", req.headers);
    console.log("Authenticated Seller ID:", req.seller?._id);
    console.log("Seller Object:", req.seller);

    // Check if seller is authenticated
    if (!req.seller || !req.seller._id) {
      console.error("No seller found in request");
      return res.status(401).json({
        success: false,
        error: "Seller not authenticated",
      });
    }

    console.log("Searching for products with seller ID:", req.seller._id);

    // Only fetch products for the authenticated seller
    const products = await SellerProduct.find({
      seller: req.seller._id,
    }).populate("seller", "firstName lastName email");

    console.log("Raw products from DB:", products);
    console.log("Number of products found:", products.length);

    // Log each product details
    products.forEach((product, index) => {
      console.log(`Product ${index + 1}:`, {
        id: product._id,
        name: product.name,
        price: product.price,
        stock: product.stock,
        grade: product.grade,
        origin: product.origin,
        images: product.images,
        seller: product.seller,
      });
    });

    const response = {
      success: true,
      products,
      count: products.length,
      sellerId: req.seller._id,
    };

    console.log("Sending response:", response);

    return res.status(200).json(response);
  } catch (err) {
    console.error("=== ERROR IN GET SELLER PRODUCTS ===");
    console.error("Error message:", err.message);
    console.error("Error stack:", err.stack);
    console.error("Full error:", err);

    return res.status(500).json({
      success: false,
      error: "Server error",
      details: err.message,
    });
  }
};

// Make sure your route is set up correctly
// Example route setup:
// router.get('/seller/products', authenticateToken, getSellerProducts);

const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res
        .status(400)
        .json({ success: false, error: "Product ID is required" });
    }

    // Check if product exists and user has permission
    const product = await SellerProduct.findById(productId);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, error: "Product not found" });
    }

    if (product.seller.toString() !== req.seller._id.toString()) {
      return res.status(403).json({
        success: false,
        error: "You are not authorized to delete this product",
      });
    }

    // ✅ Use findByIdAndDelete instead
    const deletedProduct = await SellerProduct.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res
        .status(500)
        .json({ success: false, error: "Failed to delete product" });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      deletedProductId: productId,
    });
  } catch (err) {
    console.error("Error deleting product:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};
// get all producst fro the admin review

const getPendingProducts = async (req, res) => {
  try {
    const pendingProducts = await SellerProduct.find({
      status: "pending",
    }).populate("seller");
    res.json(pendingProducts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something Went wrong" });
  }
};

const approvedProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await SellerProduct.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.status !== "pending") {
      return res.status(400).json({ message: "Product is already processed" });
    }

    const sellerPrice = parseFloat(product.price);
    const marginPercentage = 20; // 💰 your default margin percentage
    const marginAmount = (marginPercentage / 100) * sellerPrice;
    const finalPrice = sellerPrice + marginAmount;

    product.status = "approved";
    product.margin = marginAmount;
    product.finalPrice = finalPrice;

    await product.save();

    res.json({
      message: "Product approved successfully",
      product,
    });
  } catch (err) {
    console.error("Approve error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const getApprovedProducts = async (req, res) => {
  try {
    const approvedProduct = await SellerProduct.find({
      status: "approved",
    }).populate("seller");
    res.json(approvedProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};


const rejectProduct = async(req, res) => {
    try{
        const {id} = req.params;
        const {rejectionReason} = req.body;
        const product = await SellerProduct.findById(id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        product.status = "rejected";
        product.rejectComment = rejectionReason || "No reason provided";
        await product.save();

        res.json({
            message: "Product rejected successfully",
            product,
          });

    }catch(err){
        console.error(err)
    }
}

const getApprovedProductsById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await SellerProduct.findById(id).populate("seller");

    if (!product || product.status !== "approved") {
      return res
        .status(404)
        .json({ message: "Product not found or not approved" });
    }

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const getRejectedProduct = async(req, res) =>{
    try{
        const rejectedProduct = await SellerProduct.find({
            status: 'rejected',
        })
        res.json(rejectedProduct)

    }catch(err){
        console.error(err)
        res.status(500).json({message:"Something Went Wrong"})
    }
}

module.exports = {
  createSellerProduct,
  getSellerProducts,
  deleteProduct,
  getPendingProducts,
  approvedProduct,
  getApprovedProducts,
  getApprovedProductsById,
  rejectProduct,
  getRejectedProduct 
};
