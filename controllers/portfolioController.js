const User = require('../models/User');
const Portfolio = require('../models/Portfolio');
const Transaction = require('../models/Transaction');

exports.getPortfolio = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    let stocks = await Portfolio.find({ userId: req.session.userId, search: req.query.search });

    if (req.query.filter === 'profit') {
      stocks = stocks.filter(s => s.currentPrice > s.buyPrice);
    } else if (req.query.filter === 'loss') {
      stocks = stocks.filter(s => s.currentPrice < s.buyPrice);
    }
    res.render('portfolio', { user, stocks, search: req.query.search || '', filter: req.query.filter || '' });
  } catch {
    res.send('Portfolio load error.');
  }
};
exports.getAddStock = async (req, res) => {
  const user = await User.findById(req.session.userId);
  res.render('add-stock', { user, error: null });
};
exports.postAddStock = async (req, res) => {
  const { stockName, quantity, buyPrice, currentPrice } = req.body;
  try {
      await Portfolio.create({
      userId: req.session.userId,
      stockName,
      quantity: Number(quantity),
      buyPrice: Number(buyPrice),
      currentPrice: Number(currentPrice)
    });
    await Transaction.create({
      userId: req.session.userId,
      stockName,
      type: 'BUY',
      quantity: Number(quantity),
      price: Number(buyPrice),
      total: Number(quantity) * Number(buyPrice)
    });

    res.redirect('/portfolio');

  } catch {
    const user = await User.findById(req.session.userId);
    res.render('add-stock', { user, error: 'Error adding stock. Try again.' });
  }
};

exports.getEditStock = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    const stock = await Portfolio.findOne({ _id: req.params.id, userId: req.session.userId });
    if (!stock) return res.redirect('/portfolio');
    res.render('edit-stock', { user, stock, error: null });
  } catch {
    res.redirect('/portfolio');
  }
};

exports.postEditStock = async (req, res) => {
  try {
    await Portfolio.findOneAndUpdate(
      { _id: req.params.id, userId: req.session.userId },
      { quantity: Number(req.body.quantity), currentPrice: Number(req.body.currentPrice) }
    );
    res.redirect('/portfolio');
  } catch {
    res.redirect('/portfolio');
  }
};

exports.sellStock = async (req, res) => {
  try {
    const stock = await Portfolio.findOne({ _id: req.params.id, userId: req.session.userId });
    if (!stock) return res.redirect('/portfolio');

    await Transaction.create({
      userId: req.session.userId,
      stockName: stock.stockName,
      type: 'SELL',
      quantity: stock.quantity,
      price: stock.currentPrice,
      total: stock.quantity * stock.currentPrice
    });

    await Portfolio.findByIdAndDelete(req.params.id);
    res.redirect('/portfolio');

  } catch {
    res.redirect('/portfolio');
  }
};

exports.deleteStock = async (req, res) => {
  try {
    await Portfolio.findOneAndDelete({ _id: req.params.id, userId: req.session.userId });
    res.redirect('/portfolio');
  } catch {
    res.redirect('/portfolio');
  }
};