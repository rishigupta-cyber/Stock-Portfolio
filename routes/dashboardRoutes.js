const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware/auth');
const dashboardController = require('../controllers/dashboardController');

router.get('/', isLoggedIn, dashboardController.getDashboard);
router.get('/transactions', isLoggedIn, dashboardController.getTransactions);

module.exports = router;