const { pool } = require('../../config/db.config');
const bcrypt = require('bcryptjs');

const createTestUser = async (userData = {}) => {
  const defaultUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    role: 'user'
  };

  const user = { ...defaultUser, ...userData };
  const hashedPassword = await bcrypt.hash(user.password, 10);

  const result = await pool.query(
    'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
    [user.name, user.email, hashedPassword, user.role]
  );

  return result.rows[0];
};

module.exports = {
  createTestUser
};
