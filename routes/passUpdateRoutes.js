const express = require('express');
const router = express.Router();
const PassUpdateController = require('../controllers/PassUpdateController');
const authUser = require('../middlewares/authUsers');

router.put('/new-password', authUser, PassUpdateController);
module.exports = router;
