const ForgetOtp = require("../controllers/ForgetOtp")
const express = require("express")
const router = express.Router();
const {ForgetOtpSend, verifyForgetOtp} = ForgetOtp

router.post("/send-forget-otp", ForgetOtpSend)
router.post("/verify-forget-otp", verifyForgetOtp);
module.exports = router;