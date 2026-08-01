const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware/auth');
const portfolioController = require('../controllers/portfolioController');

router.get('/', isLoggedIn, portfolioController.getPortfolio);
router.get('/add', isLoggedIn, portfolioController.getAddStock);
router.post('/add', isLoggedIn, portfolioController.postAddStock);
router.get('/edit/:id', isLoggedIn, portfolioController.getEditStock);
router.post('/edit/:id', isLoggedIn, portfolioController.postEditStock);
router.post('/sell/:id', isLoggedIn, portfolioController.sellStock);
router.post('/delete/:id', isLoggedIn, portfolioController.deleteStock);

module.exports = router;