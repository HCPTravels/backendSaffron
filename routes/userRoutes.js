const express = require("express");
const router = express.Router();
const {
  createUser,
  loginUser,
  deleteUser,
  userAddress 
} = require("../controllers/userController");
const authUser = require("../middlewares/authUsers");

// ✅ Correct syntax
router.post("/signup", createUser);
router.post("/login", loginUser);
router.delete("/deleteUser", authUser, deleteUser);
router.get("/useraddress", authUser, userAddress)
module.exports = router;
