const fs = require('fs');
const path = require('path');
const { pool } = require('../config/db.config');

async function initializeDatabase() {
    try {
        const sqlScript = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8');
        await pool.query(sqlScript);
        console.log('Database tables initialized successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
        throw error;
    }
}

module.exports = initializeDatabase;
