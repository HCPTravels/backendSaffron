const mongoose = require('mongoose');

const sellerProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  grade: { type: String, required: true },
  price: { type: String, required: true },
  description: { type: String, required: true },
  images: { type: Array, required: true },
  stock: { type: String, required: true },
  origin: { type: String, required: true },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seller',
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  margin: {
    type: Number,
    default: 0,
  },
  finalPrice: {  // ✅ corrected key
    type: Number,
  },
  rejectComment:{
    type:String
  },
}, { timestamps: true });

const SellerProduct = mongoose.model('SellerProduct', sellerProductSchema);
module.exports = SellerProduct;