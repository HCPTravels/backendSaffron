const User = require("../modals/User");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");

const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, contactNumber, password, role } =
      req.body;

    if (!firstName || !lastName || !email || !contactNumber || !password) {
      return res
        .status(400)
        .json({ success: false, error: "All fields are mandatory" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, error: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      contactNumber,
      password: hashedPassword,
      role: role || "user", // Default role is 'user'
    });

    const token = generateToken(newUser._id);

    return res.status(201).json({
      success: true,
      message: "User created",
      token,
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        contactNumber: newUser.contactNumber,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error("Error creating user:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Both email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials (user not found)",
      });
    }

    // Log user object to inspect password
    console.log("User found:", user);

    if (!user.password) {
      console.error("User has no password saved in DB");
      return res.status(500).json({
        success: false,
        message: "User has no password stored. Try resetting your password.",
      });
    }

    const isMatched = await bcrypt.compare(password, user.password);

    if (!isMatched) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials (wrong password)",
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        contactNumber: user.contactNumber,
        role: user.role, // ← ADD THIS LINE
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user ID is passed in the request object

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, error: "User ID is required" });
    }

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

module.exports = { createUser, loginUser, deleteUser };
