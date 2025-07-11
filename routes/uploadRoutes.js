const express = require('express');
const router = express.Router();
const upload = require('../middlewares/multer');
const  uploadImage  = require('../controllers/cloudinaryController');

router.post('/upload', upload.single('image'), uploadImage);

module.exports = router;