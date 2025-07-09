// const passport = require("passport");
// const GoogleStrategy = require("passport-google-oauth20").Strategy;
// const User = require("../modals/User");

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: "/auth/google/callback",
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         const existingUser = await User.findOne({ googleId: profile.id });

//         if (existingUser) return done(null, existingUser);

//         const [firstName, ...lastNameParts] = profile.displayName.split(" ");

//         const newUser = await User.create({
//           googleId: profile.id,
//           email: profile.emails[0].value,
//           firstName,
//           lastName: lastNameParts.join(" "),
//           profileImage: profile.photos[0].value,
//           provider: "google",
//         });

//         return done(null, newUser);
//       } catch (error) {
//         return done(error, false);
//       }
//     }
//   )
// );

// // Save user ID to session
// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// // Retrieve full user from session
// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await User.findById(id);
//     done(null, user);
//   } catch (err) {
//     done(err, null);
//   }
// });
