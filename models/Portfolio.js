const { getPool } = require('../config/db');

function mapStock(row) {
  if (!row) return null;
  return {
    _id: row.id,
    userId: row.user_id,
    stockName: row.stock_name,
    quantity: row.quantity,
    buyPrice: Number(row.buy_price),
    currentPrice: Number(row.current_price),
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

exports.find = async ({ userId, search }) => {
  let sql = 'SELECT * FROM portfolio WHERE user_id = ?';
  const params = [userId];
  if (search) {
    sql += ' AND stock_name LIKE ?';
    params.push(`%${search}%`);
  }
  sql += ' ORDER BY created_at DESC';
  const [rows] = await getPool().query(sql, params);
  return rows.map(mapStock);
};

exports.findOne = async ({ _id, userId }) => {
  const [rows] = await getPool().query('SELECT * FROM portfolio WHERE id = ? AND user_id = ?', [_id, userId]);
  return mapStock(rows[0]);
};

exports.create = async ({ userId, stockName, quantity, buyPrice, currentPrice }) => {
  await getPool().query(
    'INSERT INTO portfolio (user_id, stock_name, quantity, buy_price, current_price) VALUES (?, ?, ?, ?, ?)',
    [userId, stockName, quantity, buyPrice, currentPrice]
  );
};

exports.findOneAndUpdate = async ({ _id, userId }, { quantity, currentPrice }) => {
  await getPool().query(
    'UPDATE portfolio SET quantity = ?, current_price = ? WHERE id = ? AND user_id = ?',
    [quantity, currentPrice, _id, userId]
  );
};

exports.findByIdAndDelete = async (id) => {
  await getPool().query('DELETE FROM portfolio WHERE id = ?', [id]);
};

exports.findOneAndDelete = async ({ _id, userId }) => {
  await getPool().query('DELETE FROM portfolio WHERE id = ? AND user_id = ?', [_id, userId]);
};
