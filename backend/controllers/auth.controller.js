const { pool } = require('../config/db.config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authController = {
  register: async (req, res) => {
    let { name, email, password, role } = req.body;
    // Set default role if not provided
    role = role || 'user';

    try {
      // Check if user already exists
      const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      if (userExists.rows.length > 0) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create user
      const result = await pool.query(
        'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
        [name, email, hashedPassword, role]
      );

      // Generate JWT
      const token = jwt.sign(
        { id: result.rows[0].id },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      res.status(201).json({
        user: result.rows[0],
        token
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  login: async (req, res) => {
    const { email, password } = req.body;

    try {
      // Check user exists
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      if (result.rows.length === 0) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Verify password
      const isValid = await bcrypt.compare(password, result.rows[0].password);
      if (!isValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate JWT
      const token = jwt.sign(
        { id: result.rows[0].id },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      res.json({
        user: {
          id: result.rows[0].id,
          name: result.rows[0].name,
          email: result.rows[0].email,
          role: result.rows[0].role
        },
        token
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateProfile: async (req, res) => {
    const { name, email } = req.body;
    const userId = req.user.id;

    try {
      // Check if email is already taken by another user
      if (email !== req.user.email) {
        const emailExists = await pool.query('SELECT * FROM users WHERE email = $1 AND id != $2', [email, userId]);
        if (emailExists.rows.length > 0) {
          return res.status(400).json({ message: 'Email already in use' });
        }
      }

      // Update user profile
      const result = await pool.query(
        'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING id, name, email',
        [name, email, userId]
      );

      res.json({
        user: result.rows[0],
        message: 'Profile updated successfully'
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getProfile: async (req, res) => {
    try {
      const result = await pool.query(
        'SELECT id, name, email, created_at as "joinDate" FROM users WHERE id = $1',
        [req.user.id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({
        user: result.rows[0]
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = authController;
