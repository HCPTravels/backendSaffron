const User = require("../modals/User");

const editAddress = async (req, res) => {
    try{
        const { userId, addressId, addressData } = req.body;
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({ success: false, error: "User not found" });
        }
        const address = user.addresses.find(address => address._id.toString() === addressId);
        if(!address){
            return res.status(404).json({ success: false, error: "Address not found" });
        }
        user.addresses.push(addressData);
        await user.save();
        return res.status(200).json({ success: true, message: "Address added successfully" });

    }catch(err){
        console.error("Error editing address:", err);
        return res.status(500).json({ success: false, error: "Server error" });
    }
}

const getAddresses = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }
        
        return res.status(200).json({ 
            success: true, 
            addresses: user.addresses || [] 
        });
    } catch (err) {
        console.error("Error fetching addresses:", err);
        return res.status(500).json({ success: false, error: "Server error" });
    }
}

module.exports = {
    editAddress,
    getAddresses
}