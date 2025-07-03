const { sendOTPEmail } = require("../services/mailService"); // ✅ Changed to sendOTPEmail (capital OTP)
// Add debug logging right after the import
console.log("DEBUG: sendOTPEmail type:", typeof sendOTPEmail);
console.log("DEBUG: sendOTPEmail:", sendOTPEmail);

const User = require("../modals/User");
const Otp = require("../modals/OtpModal");

const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res
        .status(401)
        .json({ message: "User already exists. Please log in." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // Optional: clear previous unverified OTPs
    await Otp.deleteMany({ email, used: false });

    const otpData = new Otp({
      email,
      otp,
      expiresAt,
      used: false, // ✅ Fix: you must define this field
    });

    await otpData.save();

    // Add another debug log right before calling the function
    console.log("About to call sendOTPEmail with:", email, otp);
    console.log("sendOTPEmail function check:", typeof sendOTPEmail);
    
    // Enhanced debugging for email service
    console.log("=== CALLING EMAIL SERVICE ===");
    console.log("Calling sendOTPEmail...");
    
    // ✅ Actually send the email - changed function name to match export
    const result = await sendOTPEmail(email, otp);
    
    console.log("Email service result:", result);
    console.log("Result type:", typeof result);
    console.log("Result success:", result?.success);
    console.log("Result message:", result?.message);
    console.log("Result error:", result?.error);
    console.log("==============================");
    
    // Handle the result properly since your service returns an object
    if (!result.success) {
      console.error("Email service failed:", result.error);
      throw new Error(result.error || result.message);
    }

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("Error sending OTP:", err);
    console.error("Error details:", {
      message: err.message,
      stack: err.stack,
      name: err.name
    });
    res.status(500).json({ message: "Failed to send OTP", error: err.message });
  }
};

// verify otp
const verifyOtp = async (req, res) => {
  try {
    console.log("=== VERIFY OTP DEBUG ===");
    console.log("Request received");
    console.log("Request body:", req.body);
    console.log("Request headers:", req.headers);
    console.log("Content-Type:", req.headers['content-type']);
    
    const { email, otp } = req.body;
    
    console.log("Extracted email:", email);
    console.log("Extracted otp:", otp);
    console.log("Email type:", typeof email);
    console.log("OTP type:", typeof otp);

    if (!email || !otp) {
      console.log("❌ Validation failed - missing email or otp");
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    console.log("✅ Validation passed, proceeding with OTP verification");
    
    const otpData = await Otp.findOne({ email, otp, used: false });
    console.log("OTP data from DB:", otpData);

    if (!otpData) {
      console.log("❌ No OTP data found");
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (otpData.expiresAt < new Date()) {
      console.log("❌ OTP expired");
      return res.status(400).json({ message: "OTP has expired" });
    }

    otpData.used = true;
    await otpData.save();

    console.log("✅ OTP verified successfully");
    res.status(200).json({ message: "OTP verified successfully" });
  } catch (err) {
    console.error("Error verifying OTP:", err);
    res.status(500).json({ message: "Failed to verify OTP", error: err.message });
  }
};

module.exports = { sendOtp, verifyOtp };