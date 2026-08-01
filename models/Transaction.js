const { getPool } = require('../config/db');

function mapTx(row) {
  if (!row) return null;
  return {
    _id: row.id,
    userId: row.user_id,
    stockName: row.stock_name,
    type: row.type,
    quantity: row.quantity,
    price: Number(row.price),
    total: Number(row.total),
    date: row.date
  };
}

exports.create = async ({ userId, stockName, type, quantity, price, total }) => {
  await getPool().query(
    'INSERT INTO transactions (user_id, stock_name, type, quantity, price, total) VALUES (?, ?, ?, ?, ?, ?)',
    [userId, stockName, type, quantity, price, total]
  );
};

exports.find = async ({ userId }) => {
  const [rows] = await getPool().query(
    'SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC',
    [userId]
  );
  return rows.map(mapTx);
};
