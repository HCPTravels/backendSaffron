const express = require("express");
const router = express.Router();

const authUser = require("../middlewares/authUsers");

const {
  addReview,
  getReviews,
  deleteReview,
  updateReview,
} = require("../controllers/reviewsController");

// Routes for reviews
router.post("/add", authUser, addReview);
router.get("/get/:productId", authUser, getReviews);
router.delete("/delete/:reviewId", authUser, deleteReview);
router.put("/update/:reviewId", authUser, updateReview);

module.exports = router;
