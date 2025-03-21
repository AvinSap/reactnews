process.env.NODE_ENV = 'test';
require('dotenv').config({ path: '.env.test' });

const { pool } = require('../config/db.config');

// Clear database before each test
beforeEach(async () => {
  await pool.query('DELETE FROM users');
  await pool.query('ALTER SEQUENCE users_id_seq RESTART WITH 1');
});

// Close database connection after all tests
afterAll(async () => {
  await pool.end();
});
