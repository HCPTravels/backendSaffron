const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const UserModel = require("../modals/User.js");
const generateToken = require("../utils/generateToken");

// Remove the module.exports wrapper since we'll initialize directly
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        process.env.GOOGLE_CALLBACK_URL ||
        "http://localhost:5001/auth/google/callback",
      scope: ["profile", "email"],
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        // Extract email and name from profile
        const email = profile.emails[0].value;
        const username = profile.displayName || `user-${Date.now()}`;

        // Check if user exists
        let user = await UserModel.findOne({ email });
        if (user) {
          // Update existing user
          user.googleId = profile.id;
          user.email = profile.emails[0].value;
          (user.username = profile.displayName || profile.name.givenName),
            (user.profilePhoto = profile.photos[0].value); // ✅ Add this
          user.auth_token = generateToken(user._id); // ✅ Important
          await user.save();
          return done(null, user);
        }

        // Create new user
        const newUser = new UserModel({
          email,
          username,
          googleId: profile.id,
          password: "google-auth", // Dummy password
          verified: true,
          profilePhoto: profile.photos[0].value, // ✅ Add this too
          // auth_token: generateToken(profile.id), // ✅ Here too
        });

        await newUser.save();
        return done(null, newUser);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserModel.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
