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

    await Otp.deleteMany({ email, used: false });

    const otpData = new Otp({
      email,
      otp,
      expiresAt,
      used: false,
    });

    await otpData.save();

    // ✅ Add this:
    const result = await sendOTPEmail(email, otp);

    if (!result.success) {
      console.error("Email service failed:", result.error);
      throw new Error(result.error || result.message);
    }

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("Error sending OTP:", err);
    res.status(500).json({ message: "Failed to send OTP", error: err.message });
  }
};

// verify otp
const verifyOtp = async (req, res) => {
  console.log("=== BACKEND VERIFY OTP DEBUG START ===");
  
  try {
    console.log("1. Request body:", req.body);
    console.log("2. Request body type:", typeof req.body);
    console.log("3. Request body keys:", Object.keys(req.body || {}));
    
    const { email, otp } = req.body;

    console.log("4. Extracted email:", email);
    console.log("5. Extracted otp:", otp);
    console.log("6. Email type:", typeof email);
    console.log("7. OTP type:", typeof otp);

    if (!email || !otp) {
      console.log("8. Missing email or OTP");
      return res.status(400).json({ 
        success: false,
        message: "Email and OTP are required" 
      });
    }

    console.log("9. About to query database for OTP");
    console.log("10. Query params:", { email, otp, used: false });

    // Add a test query first to check database connection
    try {
      const testQuery = await Otp.findOne({ email });
      console.log("11. Test query result (all OTPs for this email):", testQuery);
    } catch (dbError) {
      console.error("12. Database connection test failed:", dbError);
      return res.status(500).json({
        success: false,
        message: "Database connection failed",
        error: dbError.message
      });
    }

    const otpData = await Otp.findOne({ email, otp, used: false });
    console.log("13. OTP query result:", otpData);

    if (!otpData) {
      console.log("14. No OTP found with these criteria");
      
      // Let's check what OTPs exist for this email
      const allOtpsForEmail = await Otp.find({ email }).sort({ createdAt: -1 });
      console.log("15. All OTPs for this email:", allOtpsForEmail);
      
      return res.status(400).json({ 
        success: false,
        message: "Invalid OTP" 
      });
    }

    console.log("16. OTP found, checking expiration");
    console.log("17. OTP expires at:", otpData.expiresAt);
    console.log("18. Current time:", new Date());
    console.log("19. Is expired?", otpData.expiresAt < new Date());

    if (otpData.expiresAt < new Date()) {
      console.log("20. OTP has expired");
      return res.status(400).json({ 
        success: false,
        message: "OTP has expired" 
      });
    }

    console.log("21. Marking OTP as used");
    otpData.used = true;
    await Otp.deleteOne({ _id: otpData._id });
    console.log("22. OTP marked as used successfully");

    console.log("23. Sending success response");
    res.status(200).json({ 
      success: true,
      message: "OTP verified successfully",
      verified: true,
      email: email
    });

    console.log("24. Success response sent");

  } catch (err) {
    console.error("=== BACKEND ERROR ===");
    console.error("Error type:", err.constructor.name);
    console.error("Error message:", err.message);
    console.error("Error stack:", err.stack);
    console.error("=== END BACKEND ERROR ===");
    
    res.status(500).json({ 
      success: false,
      message: "Failed to verify OTP", 
      error: err.message 
    });
  }
  
  console.log("=== BACKEND VERIFY OTP DEBUG END ===");
};

module.exports = { sendOtp, verifyOtp };