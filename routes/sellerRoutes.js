const sellerController = require('../controllers/sellerController');
const express = require('express');
const router = express.Router();

// Route to create a new seller
router.post('/create', sellerController.createSeller);  
// Route for seller login
router.post('/login', sellerController.loginSeller);

module.exports = router;