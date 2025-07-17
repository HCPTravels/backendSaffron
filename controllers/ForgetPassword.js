const User = require("../modals/User");
const bcrypt = require("bcrypt");

const ForgetPassword = async (req, res) => {
  try {
    console.log("Reset password request received:", { email: req.body.email });
    
    const { email, newPassword, confirmPassword } = req.body;

    // Validation
    if (!email || !newPassword || !confirmPassword) {
      console.log("Missing required fields");
      return res.status(400).json({ 
        success: false, 
        message: "All fields are required." 
      });
    }

    if (newPassword !== confirmPassword) {
      console.log("Passwords do not match");
      return res.status(400).json({ 
        success: false, 
        message: "Passwords do not match." 
      });
    }

    // Password strength validation (optional)
    if (newPassword.length < 6) {
      console.log("Password too short");
      return res.status(400).json({ 
        success: false, 
        message: "Password must be at least 6 characters long." 
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found:", email);
      return res.status(404).json({ 
        success: false, 
        message: "User not found." 
      });
    }

    console.log("User found, updating password");

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    console.log("Password updated successfully");

    return res.status(200).json({ 
      success: true, 
      message: "Password reset successfully." 
    });

  } catch (err) {
    console.error("ForgetPassword Error:", err);
    return res.status(500).json({ 
      success: false, 
      message: "Password reset failed.", 
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
};

module.exports = ForgetPassword;