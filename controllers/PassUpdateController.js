const User = require('../modals/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authUser = require("../middlewares/authUsers");


const PassUpdateController = async(req, res) =>{
    try{
        const user = req.user; // Get the authenticated user from the request
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: "Current and new passwords are required" });
        }
        // Check if the current password matches
        const isMatch = await bcrypt.compare(currentPassword, user.password)
        if (!isMatch) {
            return res.status(401).json({ message: "Current password is incorrect" });
        }
        // Hash the new password
        const hashedNewPassword = await bcrypt.hash(newPassword,10);
        // Update the user's password
        user.password = hashedNewPassword;
        await user.save();
        res.status(200).json({ message: "Password updated successfully" });
    }catch (error) {
        console.error("Error updating password:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

module.exports = PassUpdateController;