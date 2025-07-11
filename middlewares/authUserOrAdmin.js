const jwt = require('jsonwebtoken');
const User = require("../modals/User");

const authUserOrAdmin = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(401).json({ message: "User not found" });

    if (user.role === 'admin' || user.role === 'user') {
      req.user = user;
      next();
    } else {
      return res.status(403).json({ message: "Access denied" });
    }
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authUserOrAdmin;