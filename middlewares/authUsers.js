const jwt = require("jsonwebtoken");
const User = require("../modals/User");

const authUser = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role !== "user") {
      return res.status(403).json({ message: "Forbidden: User access only" });
    }

    req.user = user;
    req.email = user.email; // Store email in request for later use
    next();
  } catch (err) {
    console.error("authUser error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = authUser;
