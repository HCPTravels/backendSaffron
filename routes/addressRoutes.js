const express = require("express");
const router = express.Router();
const { editAddress, getAddresses } = require("../controllers/AddressController");
const authUser = require("../middlewares/authUsers");

router.post("/edit-address", editAddress);
router.get("/get-addresses", authUser, getAddresses);

module.exports = router;