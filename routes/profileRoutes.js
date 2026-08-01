const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware/auth');
const profileController = require('../controllers/profileController');

router.get('/', isLoggedIn, profileController.getProfile);
router.post('/update', isLoggedIn, profileController.updateProfile);
router.post('/change-password', isLoggedIn, profileController.changePassword);

module.exports = router;