const review = require("../modals/reviews");

// Add a new review
const addReview = async (req, res) => {
  const { productId, rating, comment, title } = req.body;
  const userId = req.user?._id;

  // Basic validation
  if (!productId || !rating || !comment || !title) {
    return res.status(400).json({
      success: false,
      message: "Product ID, rating, and comment are required.",
    });
  }

  try {
    const newReview = new review({
      productId,
      userId,
      rating,
      comment,
      title,
    });

    await newReview.save();
    res.status(201).json({ success: true, review: newReview });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all reviews for a product
const getReviews = async (req, res) => {
  const { productId } = req.params;

  if (!productId) {
    return res.status(400).json({
      success: false,
      message: "Product ID is required in params.",
    });
  }

  try {
    const reviews = await review
      .find({ productId })
      .populate("userId", "firstName lastName email role");

    // ✅ Return success with empty array if no reviews
    res.status(200).json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a review
const deleteReview = async (req, res) => {
  const { reviewId } = req.params;

  if (!reviewId) {
    return res
      .status(400)
      .json({ success: false, message: "Review ID is required." });
  }

  try {
    const reviewToDelete = await review.findById(reviewId);

    if (!reviewToDelete) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found." });
    }

    await reviewToDelete.deleteOne();
    res
      .status(200)
      .json({ success: true, message: "Review deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a review
const updateReview = async (req, res) => {
  const { reviewId } = req.params;
  const { rating, comment, title } = req.body;
  const userId = req.user?._id;

  if (!reviewId || (!rating && !comment && !title)) {
    return res.status(400).json({
      success: false,
      message:
        "Review ID and at least one field (rating/comment) are required.",
    });
  }

  try {
    const reviewToUpdate = await review.findOne({ _id: reviewId, userId });

    if (!reviewToUpdate) {
      return res.status(404).json({
        success: false,
        message: "Review not found or you are not authorized to update it.",
      });
    }

    if (rating) reviewToUpdate.rating = rating;
    if (comment) reviewToUpdate.comment = comment;
    if (title) reviewToUpdate.title = title;
    reviewToUpdate.updatedAt = Date.now();

    await reviewToUpdate.save();

    res.status(200).json({ success: true, review: reviewToUpdate });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  addReview,
  getReviews,
  deleteReview,
  updateReview,
};
