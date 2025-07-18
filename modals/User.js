const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: function () {
      return !this.googleId; // Required only if not Google
    },
  },
  lastName: {
    type: String,
    required: function () {
      return !this.googleId;
    },
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
  },
  contactNumber: {
    type: String,
    required: function () {
      return !this.googleId;
    },
  },
  password: {
    type: String,
    required: function () {
      return !this.googleId; // Optional for Google
    },
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true, // Allows multiple nulls while enforcing uniqueness when defined
  },
  profileImage: {
    type: String,
  },
  provider: {
    type: String,
    default: "local", // "google" for Google users
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SellerProduct'
  }],
  addresses: [
    {
      firstName: String,
      lastName: String,
      email: String,
      phone: String,
      address: String,
      city: String,
      state: String,
      pincode: String,
      landmark: String
    }
  ]
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
