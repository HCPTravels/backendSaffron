const mongoose = require('mongoose')

const Contact = new mongoose.Schema({
    name:{type:String, required:true},
    email:{type:String, required:true},
    contact:{type:String, required:true},
    pincode:{type:String, required:true},
    message:{type:String}
})

const ContactUs = mongoose.model("Contact", Contact); 
module.exports = ContactUs;