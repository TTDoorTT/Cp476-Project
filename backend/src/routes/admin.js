const express = require("express");
const pool = require("../db/pool");
const requireAdmin = require("../middleware/requireAdmin");

const router = express.Router();

// GET /admin/deleted-topics
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

// POST /admin/topics/:id/restore
router.post("/topics/:id/restore", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res
        .status(400)
        .json({ error: "validation_error", message: "invalid topic id" });
    }

    const [rows] = await pool.query(
      `
      SELECT id, deleted_at
      FROM topics
      WHERE id = ?
      LIMIT 1
      `,
      [id]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ error: "not_found", message: "topic not found" });
    }

    if (rows[0].deleted_at === null) {
      return res.status(400).json({
        error: "validation_error",
        message: "topic is not deleted",
      });
    }

    await pool.query(
      `
      UPDATE topics
      SET deleted_at = NULL
      WHERE id = ?
      `,
      [id]
    );

    return res.json({ message: "topic restored", id });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "server_error", message: err.message });
  }
});

// GET /admin/deleted-replies
router.get("/deleted-replies", requireAdmin, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT
        r.id,
        r.topic_id,
        r.body,
        r.created_at,
        r.updated_at,
        r.deleted_at,
        t.title AS topic_title,
        u.id AS author_id,
        u.username AS author_username
      FROM replies r
      JOIN topics t ON t.id = r.topic_id
      JOIN users u ON u.id = r.user_id
      WHERE r.deleted_at IS NOT NULL
      ORDER BY r.deleted_at DESC
      LIMIT 300
      `
    );

    return res.json({ replies: rows });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "server_error", message: err.message });
  }
});

// POST /admin/replies/:id/restore
router.post("/replies/:id/restore", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res
        .status(400)
        .json({ error: "validation_error", message: "invalid reply id" });
    }

    const [rows] = await pool.query(
      `
      SELECT id, deleted_at
      FROM replies
      WHERE id = ?
      LIMIT 1
      `,
      [id]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ error: "not_found", message: "reply not found" });
    }

    if (rows[0].deleted_at === null) {
      return res.status(400).json({
        error: "validation_error",
        message: "reply is not deleted",
      });
    }

    await pool.query(
      `
      UPDATE replies
      SET deleted_at = NULL
      WHERE id = ?
      `,
      [id]
    );

    return res.json({ message: "reply restored", id });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "server_error", message: err.message });
  }
});

// GET /admin/users
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