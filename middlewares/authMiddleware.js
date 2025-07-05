// authMiddleware.js
const Seller = require('../modals/Seller');
const jwt = require('jsonwebtoken');

module.exports = async function (req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const seller = await Seller.findById(decoded.id);
    if (!seller) throw new Error("Seller not found");
    req.seller = seller; // 👈 attaches seller to request
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};