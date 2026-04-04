const express = require("express");
const pool = require("../db/pool");
const requireAdmin = require("../middleware/requireAdmin");

const router = express.Router();

// GET /admin/deleted-topics
// admin only
router.get("/deleted-topics", requireAdmin, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT
        t.id,
        t.title,
        t.body,
        t.created_at,
        t.updated_at,
        t.deleted_at,
        u.id AS author_id,
        u.username AS author_username
      FROM topics t
      JOIN users u ON u.id = t.user_id
      WHERE t.deleted_at IS NOT NULL
      ORDER BY t.deleted_at DESC
      LIMIT 200
      `
    );

    return res.json({ topics: rows });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "server_error", message: err.message });
  }
});

// GET /admin/users
// admin only
router.get("/users", requireAdmin, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT
        id,
        username,
        email,
        role,
        created_at,
        deleted_at
      FROM users
      WHERE deleted_at IS NULL
      ORDER BY created_at DESC
      LIMIT 500
      `
    );

    return res.json({ users: rows });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "server_error", message: err.message });
  }
});

module.exports = router;