const mongoose = require("mongoose")

const ForgetOtpSchema = new mongoose.Schema({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 300 } // 5 mins expiry
})

module.exports = mongoose.model("ForgetOtp", ForgetOtpSchema);

