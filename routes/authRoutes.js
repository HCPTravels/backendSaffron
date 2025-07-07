const express = require("express");
const passport = require("passport");
const generateToken = require("../utils/generateToken");
const router = express.Router();

// Step 1: Trigger Google OAuth
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Step 2: Callback URL
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login", session: false }),
  (req, res) => {
    const user = req.user;
    const token = generateToken(user._id);

    // ✅ Redirect to your frontend with token as query
    const frontendURL = "http://localhost:5173/google-auth"; // You will catch this on frontend
    res.redirect(`${frontendURL}?token=${token}`);
  }
);

// Optional logout
router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
});

module.exports = router;