const { pool } = require("../config/db.config");

const commentsController = {
  getCommentsByNewsId: async (req, res) => {
    const { newsId } = req.params;
    try {
      const result = await pool.query(
        `SELECT 
          c.id,
          c.text,
          c.created_at,
          c.updated_at,
          c.user_id,
          u.name as user_name
         FROM comments c 
         JOIN users u ON c.user_id = u.id 
         WHERE c.news_id = $1 
         AND c.deleted_at IS NULL 
         ORDER BY c.created_at DESC`,
        [newsId]
      );
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  addComment: async (req, res) => {
    const { newsId } = req.params;
    const text = req.body.text;
    const userId = req.body.userId;

    try {
      // Verify news exists
      const newsExists = await pool.query("SELECT id FROM news WHERE id = $1", [newsId]);
      if (newsExists.rows.length === 0) {
        return res.status(404).json({ message: "News article not found" });
      }

      const result = await pool.query(
        `INSERT INTO comments (news_id, user_id, text) 
         VALUES ($1, $2, $3) 
         RETURNING id, text, created_at, user_id`,
        [newsId, userId, text]
      );

      // Get user name for the response
      const user = await pool.query("SELECT name FROM users WHERE id = $1", [userId]);
      
      const comment = {
        ...result.rows[0],
        user_name: user.rows[0].name
      };

      res.status(201).json(comment);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateComment: async (req, res) => {
    const { newsId, commentId } = req.params;
    const text = req.body.text;
    const userId = req.body.userId;
    
    try {
      const comment = await pool.query(
        `SELECT c.*, u.name as user_name 
         FROM comments c
         JOIN users u ON c.user_id = u.id
         WHERE c.id = $1 AND c.news_id = $2 AND c.deleted_at IS NULL`,
        [commentId, newsId]
      );

      if (comment.rows.length === 0) {
        return res.status(404).json({ message: "Comment not found" });
      }

      // Check if user owns the comment or is admin
      if (comment.rows[0].user_id !== userId && req.user.role !== 'admin') {
        return res.status(403).json({ message: "Unauthorized to edit this comment" });
      }

      const result = await pool.query(
        `UPDATE comments 
         SET text = $1, updated_at = CURRENT_TIMESTAMP 
         WHERE id = $2 AND deleted_at IS NULL 
         RETURNING *`,
        [text, commentId]
      );

      res.json({
        ...result.rows[0],
        user_name: comment.rows[0].user_name
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteComment: async (req, res) => {
    const { newsId, commentId } = req.params;
    const { userId, isAdmin } = req.body;

    try {
      const comment = await pool.query(
        "SELECT * FROM comments WHERE id = $1 AND news_id = $2 AND deleted_at IS NULL",
        [commentId, newsId]
      );

      if (comment.rows.length === 0) {
        return res.status(404).json({ message: "Comment not found" });
      }

      // Check if user owns the comment or is admin
      if (comment.rows[0].user_id !== userId && !isAdmin) {
        return res.status(403).json({ message: "Unauthorized to delete this comment" });
      }

      await pool.query(
        "UPDATE comments SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1",
        [commentId]
      );

      res.json({ message: "Comment deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = commentsController;
