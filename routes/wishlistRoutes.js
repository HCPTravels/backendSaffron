const express = require('express');
const router = express.Router();

// ✅ Fix: properly import the middleware
const authUser = require('../middlewares/authUsers');

// ✅ Fix: correct spelling of 'wishlistController'
const wishlistController = require('../controllers/wishlistController');

// ✅ Routes
router.post("/add/:productId", authUser, wishlistController.addToWishlist);
router.delete("/delete/:productId", authUser, wishlistController.removeFromWishlist);
router.get("/get", authUser, wishlistController.getWishlist);
router.post("/toggle", authUser, wishlistController.toggleWishlist);

module.exports = router;
