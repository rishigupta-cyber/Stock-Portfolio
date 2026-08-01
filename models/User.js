const { getPool } = require('../config/db');

function mapUser(row) {
  if (!row) return null;
  return {
    _id: row.id,
    name: row.name,
    email: row.email,
    password: row.password,
    otp: row.otp,
    otpExpiry: row.otp_expiry,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    save: async function () {
      await getPool().query(
        'UPDATE users SET name = ?, email = ?, password = ?, otp = ?, otp_expiry = ? WHERE id = ?',
        [this.name, this.email, this.password, this.otp || null, this.otpExpiry || null, this._id]
      );
      return this;
    }
  };
}

exports.findById = async (id) => {
  const [rows] = await getPool().query('SELECT * FROM users WHERE id = ?', [id]);
  return mapUser(rows[0]);
};

exports.findOne = async ({ email, excludeId }) => {
  if (excludeId) {
    const [rows] = await getPool().query('SELECT * FROM users WHERE email = ? AND id != ?', [email, excludeId]);
    return mapUser(rows[0]);
  }
  const [rows] = await getPool().query('SELECT * FROM users WHERE email = ?', [email]);
  return mapUser(rows[0]);
};

exports.create = async ({ name, email, password }) => {
  const [result] = await getPool().query(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, email, password]
  );
  return exports.findById(result.insertId);
};

exports.findByIdAndUpdate = async (id, { name, email }) => {
  await getPool().query('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, id]);
};
