const { pool } = require("../config/db.config");

const newsController = {
  getAllNews: async (req, res) => {
    try {
      const { search } = req.query;
      let query = "SELECT * FROM news";
      let params = [];

      if (search) {
        query += " WHERE LOWER(title) LIKE LOWER($1) OR LOWER(content) LIKE LOWER($1)";
        params = [`%${search}%`];
      }

      query += " ORDER BY created_at DESC";
      const result = await pool.query(query, params);
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getNewsById: async (req, res) => {
    const { id } = req.params;
    try {
      const result = await pool.query("SELECT * FROM news WHERE id = $1", [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ message: "News not found" });
      }
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createNews: async (req, res) => {
    const { title, content, imageUrl, status } = req.body;
    try {
      const result = await pool.query(
        "INSERT INTO news (title, content, image_url, status) VALUES ($1, $2, $3, $4) RETURNING *",
        [title, content, imageUrl, status]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateNews: async (req, res) => {
    const { id } = req.params;
    const { title, content, imageUrl, status } = req.body;
    try {
      const result = await pool.query(
        "UPDATE news SET title = $1, content = $2, image_url = $3, status = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *",
        [title, content, imageUrl, status, id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ message: "News not found" });
      }
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteNews: async (req, res) => {
    const { id } = req.params;
    try {
      const result = await pool.query(
        "DELETE FROM news WHERE id = $1 RETURNING *",
        [id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ message: "News not found" });
      }
      res.json({ message: "News deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getPublishedNews: async (req, res) => {
    try {
      const { search } = req.query;
      let query = "SELECT * FROM news WHERE status = 'published'";
      let params = [];

      if (search) {
        query += " AND (LOWER(title) LIKE LOWER($1) OR LOWER(content) LIKE LOWER($1))";
        params = [`%${search}%`];
      }

      query += " ORDER BY created_at DESC";
      const result = await pool.query(query, params);
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = newsController;
