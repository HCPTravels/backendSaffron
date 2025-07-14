const User = require('../modals/User');
const SellerProduct = require('../modals/SellerProduct');

exports.addToWishlist = async (req, res) => {
  const { productId } = req.params;
  const user = req.user;

  if (!user.wishlist.includes(productId)) {
    user.wishlist.push(productId);
    await user.save();
    return res.status(200).json({ message: 'Product added to wishlist' });
  }

  res.status(200).json({ message: 'Product already in wishlist' });
};

exports.removeFromWishlist = async (req, res) => {
  const { productId } = req.params;
  const user = req.user;

  user.wishlist = user.wishlist.filter(
    (id) => id.toString() !== productId.toString()
  );
  await user.save();

  res.status(200).json({ message: 'Product removed from wishlist' });
};

exports.getWishlist = async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist');
  res.status(200).json(user.wishlist);
};


exports.toggleWishlist = async (req, res) => {
    const { productId } = req.body;
    const user = req.user;

    if (!productId) {
        return res.status(400).json({ message: 'Product ID is required' });
    }

    const index = user.wishlist.findIndex(
        (id) => id.toString() === productId.toString()
    );

    if (index > -1) {
        // Remove from wishlist
        user.wishlist.splice(index, 1);
        await user.save();
        return res.status(200).json({ message: 'Removed from wishlist', status: 'removed' });
    } else {
        // Add to wishlist
        user.wishlist.push(productId);
        await user.save();
        return res.status(200).json({ message: 'Added to wishlist', status: 'added' });
    }
};
