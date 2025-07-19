// routes/auth.routes.js
const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const router = express.Router();

// 🔹 Step 1: Start Google login
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

// 🔹 Step 2: Google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "http://localhost:5173/login?error=oauth_failed",
  }),
  (req, res) => {
    console.log("Google callback reached"); // Debug log
    console.log("User:", req.user); // Debug log
    try {
      const user = req.user;

      const token = jwt.sign(
        {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          username: user.username,
          contactNumber: user.contactNumber,
          role: user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );
      console.log("Token generated:", token);
      console.log("User Retrived:", user);
      // ✅ (Optional) CORS header to allow the browser redirect
      res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
      res.setHeader("Access-Control-Allow-Credentials", "true");

      // 🔁 Redirect to frontend with token
      res.redirect(`${process.env.CLIENT_URL}/login-success?token=${token}`);
    } catch (error) {
      console.error("OAuth callback error:", error);
      res.redirect("http://localhost:5173/login?error=server_error");
    }
  }
);

module.exports = router;
