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
    const result = await sendOTPEmail(email, otp, "New User", "verification");
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
  
  try {
   
    const { email, otp } = req.body;

    if (!email || !otp) {
      console.log("8. Missing email or OTP");
      return res.status(400).json({ 
        success: false,
        message: "Email and OTP are required" 
      });
    }

    // // Add a test query first to check database connection
    // try {
    //   const testQuery = await Otp.findOne({ email });
    // } catch (dbError) {
    //   console.error("12. Database connection test failed:", dbError);
    //   return res.status(500).json({
    //     success: false,
    //     message: "Database connection failed",
    //     error: dbError.message
    //   });
    // }

    const otpData = await Otp.findOne({ email, otp, used: false });

    if (!otpData) {
      console.log("No OTP found with these criteria");
      
      // Let's check what OTPs exist for this email
      const allOtpsForEmail = await Otp.find({ email }).sort({ createdAt: -1 });
      console.log("All OTPs for this email:", allOtpsForEmail);
      
      return res.status(400).json({ 
        success: false,
        message: "Invalid OTP" 
      });
    }

    if (otpData.expiresAt < new Date()) {
      console.log("20. OTP has expired");
      return res.status(400).json({ 
        success: false,
        message: "OTP has expired" 
      });
    }

    otpData.used = true;
    await Otp.deleteOne({ _id: otpData._id });

    res.status(200).json({ 
      success: true,
      message: "OTP verified successfully",
      verified: true,
      email: email
    });


  } catch (err) {
    
    res.status(500).json({ 
      success: false,
      message: "Failed to verify OTP", 
      error: err.message 
    });
  }
  
};

module.exports = { sendOtp, verifyOtp };