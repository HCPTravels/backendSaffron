const ForgetOtp = require("../modals/ForgetOtp")
const User = require("../modals/User")
const {sendOTPEmail} = require("../services/mailService")

const ForgetOtpSend = async (req, res) => {
    try {
      const { email } = req.body;
  
      const existingUser = await User.findOne({ email });
      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
      // Optional: delete previous OTPs
      await ForgetOtp.deleteMany({ email });
  
      // Save new OTP
      const newOtp = new ForgetOtp({ email, otp });
      await newOtp.save();
  
      // Send OTP email
      const result = await sendOTPEmail(email, otp, existingUser.name, "reset");
        if (!result.success) {
        return res.status(500).json({ message: "Failed to send OTP", error: result.error });
      }
  
      res.status(200).json({ message: "OTP sent successfully to email" });
    } catch (error) {
      console.error("ForgetOtpSend error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };

  const verifyForgetOtp = async (req, res) => {
    try {
      const { email, otp } = req.body;
  
      if (!email || !otp) {
        return res.status(400).json({ message: "Both email and OTP are required." });
      }
  
      const otpData = await ForgetOtp.findOne({ email, otp });
  
      if (!otpData) {
        return res.status(400).json({ message: "Invalid or already used OTP." });
      }
  
      if (otpData.expiresAt < new Date()) {
        await ForgetOtp.deleteOne({ _id: otpData._id }); // optional: clean up expired OTP
        return res.status(400).json({ message: "OTP has expired." });
      }
  
      // Optionally mark as used or delete
      await ForgetOtp.deleteOne({ _id: otpData._id }); // Or: otpData.used = true; await otpData.save();
  
      return res.status(200).json({
        message: "OTP verified successfully.",
        email,
        verified: true
      });
    } catch (err) {
      console.error("Error verifying forgot password OTP:", err);
      return res.status(500).json({
        message: "Failed to verify OTP",
        error: err.message
      });
    }
  };
  
  module.exports = {
    verifyForgetOtp,
    ForgetOtpSend
  };