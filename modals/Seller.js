const mongoose = require('mongoose');

const SellerSchema = new mongoose.Schema({
    firstName: { type: String, required: true , },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    contactNumber: { type: String, required: true },
    password: { type: String, required: true },
    businessName: { type: String, required: true }, // ✅ lowercase
    businessType: { type: String, required: true }, // ✅ lowercase
    
  });

const Seller = mongoose.model('Seller', SellerSchema);
module.exports = Seller;