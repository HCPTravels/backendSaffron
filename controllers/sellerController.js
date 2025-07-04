const Seller = require('../modals/Seller');
const bcrypt = require('bcrypt');
const generateToken = require('../utils/generateToken');

const createSeller = async (req, res) => {
    try{
        const { firstName, lastName, email, contactNumber, password, businessName, businessType } = req.body;

        if (!firstName || !lastName || !email || !contactNumber || !password || !businessName || !businessType) {
            return res.status(400).json({ success: false, error: "All fields are mandatory" });
        }

        const existingSeller = await Seller.findOne({ email });
        if (existingSeller) {
            return res.status(409).json({ success: false, error: "Email already in use" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newSeller = await Seller.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password: hashedPassword,
            businessName,
            businessType
        });

        const token = generateToken(newSeller._id);

        return res.status(201).json({
            success: true,
            message: "Seller created",
            token,
            seller: {
                id: newSeller._id,
                firstName: newSeller.firstName,
                lastName: newSeller.lastName,
                email: newSeller.email,
                contactNumber: newSeller.contactNumber,
                BusinessName: newSeller.BusinessName,
                BusinessType: newSeller.BusinessType
            }
        });

    }catch(err) {
        console.error("Error creating seller:", err);
        return res.status(500).json({ success: false, error: "Server error" });
    }   
}

const loginSeller = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Both fields are required" });
        }

        const seller = await Seller.findOne({ email });
        if (!seller) {
            return res.status(404).json({ success: false, message: "Seller not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, seller.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const token = generateToken(seller._id);

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            seller: {
                id: seller._id,
                firstName: seller.firstName,
                lastName: seller.lastName,
                email: seller.email,
                contactNumber: seller.contactNumber,
                BusinessName: seller.BusinessName,
                BusinessType: seller.BusinessType
            }
        });

    } catch (err) {
        console.error("Error logging in seller:", err);
        return res.status(500).json({ success: false, error: "Server error" });
    }
};  

module.exports = {
    createSeller,
    loginSeller
};