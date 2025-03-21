const { Pool } = require('pg');

const isTest = process.env.NODE_ENV === 'test';

// Load appropriate environment variables
require('dotenv').config({
  path: isTest ? '.env.test' : '.env'
});

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// connection test
pool.on("connect", () => {
  console.log("Database connected successfully");
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

module.exports = { pool };
