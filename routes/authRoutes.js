const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/signup', authController.getSignup);
router.post('/signup', authController.postSignup);
router.post('/signup/verify', authController.verifySignupOTP);

router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);

router.get('/logout', authController.logout);

router.get('/forgot-password', authController.getForgotPassword);
router.post('/forgot-password', authController.postForgotPassword);

router.get('/verify-otp', authController.getVerifyOTP);
router.post('/verify-otp', authController.postVerifyOTP);

module.exports = router;