const User = require('../models/User');
const Portfolio = require('../models/Portfolio');
const Transaction = require('../models/Transaction');

exports.getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    const stocks = await Portfolio.find({ userId: req.session.userId });

    let totalInvestment = 0;
    let currentValue = 0;

    stocks.forEach(stock => {
      totalInvestment += stock.buyPrice * stock.quantity;
      currentValue += stock.currentPrice * stock.quantity;
    });

    res.render('dashboard', {
      user,
      stocks,
      totalInvestment: totalInvestment.toFixed(2),
      currentValue: currentValue.toFixed(2),
      profitLoss: (currentValue - totalInvestment).toFixed(2)
    });

  } catch (err) {
    console.log('Dashboard error:', err.message);
    res.send('Something went wrong loading your dashboard.');
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    const transactions = await Transaction.find({ userId: req.session.userId });
    res.render('transactions', { user, transactions });
  } catch {
    res.send('Transactions load error.');
  }
};