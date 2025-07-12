const ContactUs = require("../controllers/ContactController")
const express = require('express')
const router = express.Router();

router.post("/message", ContactUs);
module.exports = router;

