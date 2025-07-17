const express = require("express");
const router = express.Router();
const ForgetPassword = require("../controllers/ForgetPassword");

router.post("/password", ForgetPassword);

module.exports = router;