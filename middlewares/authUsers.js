const jwt = require('jsonwebtoken');
const User = require('../modals/User');

const authRole = (allowedRoles = []) => {
  return async function (req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (!user) return res.status(404).json({ message: "User not found" });

      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
      }

      req.user = user;
      next();
    } catch (err) {
      console.error("Error in authRole middleware:", err);
      return res.status(500).json({ message: 'Server error' });
    }
  };
};

module.exports = authRole;