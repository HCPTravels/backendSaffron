const jwt = require('jsonwebtoken');
const User = require('../modals/User');

const authAdmin = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admin access only" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("authAdmin error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = authAdmin;