const express = require("express");
const pool = require("../db/pool");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

// GET /me/topics
router.get("/topics", requireAuth, async (req, res) => {
  try {
    const userId = req.session.user.id;

    const [rows] = await pool.query(
      `
      SELECT
        t.id,
        t.title,
        t.body,
        t.created_at,
        t.updated_at
      FROM topics t
      WHERE t.user_id = ?
        AND t.deleted_at IS NULL
      ORDER BY t.created_at DESC
      LIMIT 200
      `,
      [userId]
    );

    res.json({ topics: rows });
  } catch (err) {
    res.status(500).json({ error: "server_error", message: err.message });
  }
});

// GET /me/replies
router.get("/replies", requireAuth, async (req, res) => {
  try {
    const userId = req.session.user.id;

    const [rows] = await pool.query(
      `
      SELECT
        r.id,
        r.topic_id,
        r.body,
        r.created_at,
        r.updated_at,
        t.title AS topic_title
      FROM replies r
      JOIN topics t ON t.id = r.topic_id
      WHERE r.user_id = ?
        AND r.deleted_at IS NULL
      ORDER BY r.created_at DESC
      LIMIT 300
      `,
      [userId]
    );

    res.json({ replies: rows });
  } catch (err) {
    res.status(500).json({ error: "server_error", message: err.message });
  }
});

module.exports = router;