const SellerProduct = require('../modals/SellerProduct');
const Seller = require('../modals/Seller');

const createSellerProduct = async (req, res) => {
    try {
        const { name, grade, price, description, images, stock, origin } = req.body;

        if (!name || !grade || !price || !description || !images || !stock || !origin) {
            return res.status(400).json({ success: false, error: "All fields are mandatory" });
        }

        const newProduct = await SellerProduct.create({
            name,
            grade,
            price,
            description,
            images,
            stock,
            origin,
            seller: req.seller._id // Assuming req.seller is set by an authentication middleware
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
}

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
                error: "Seller not authenticated" 
            });
        }

        console.log("Searching for products with seller ID:", req.seller._id);
        
        // Only fetch products for the authenticated seller
        const products = await SellerProduct.find({ seller: req.seller._id })
            .populate('seller', 'firstName lastName email');

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
                seller: product.seller
            });
        });

        const response = {
            success: true,
            products,
            count: products.length,
            sellerId: req.seller._id
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
            details: err.message
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
            return res.status(400).json({ success: false, error: "Product ID is required" });
        }

        // Check if product exists and user has permission
        const product = await SellerProduct.findById(productId);

        if (!product) {
            return res.status(404).json({ success: false, error: "Product not found" });
        }

        if (product.seller.toString() !== req.seller._id.toString()) {
            return res.status(403).json({ success: false, error: "You are not authorized to delete this product" });
        }

        // ✅ Use findByIdAndDelete instead
        const deletedProduct = await SellerProduct.findByIdAndDelete(productId);
        
        if (!deletedProduct) {
            return res.status(500).json({ success: false, error: "Failed to delete product" });
        }

        return res.status(200).json({ 
            success: true, 
            message: "Product deleted successfully",
            deletedProductId: productId
        });

    } catch (err) {
        console.error("Error deleting product:", err);
        return res.status(500).json({ success: false, error: "Server error" });
    }
};

module.exports = {
    createSellerProduct,
    getSellerProducts,
    deleteProduct
};  