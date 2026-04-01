const express = require("express");
const pool = require("../db/pool");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

// #55 GET /topics (public) - newest first, excludes soft-deleted
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT
        t.id,
        t.title,
        t.created_at,
        t.updated_at,
        u.id AS author_id,
        u.username AS author_username
      FROM topics t
      JOIN users u ON u.id = t.user_id
      WHERE t.deleted_at IS NULL
      ORDER BY t.created_at DESC
      LIMIT 100
      `
    );

    res.json({ topics: rows });
  } catch (err) {
    res.status(500).json({ error: "server_error", message: err.message });
  }
});

// #56 GET /topics/:id (public) - excludes soft-deleted
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: "validation_error", message: "invalid topic id" });
    }

    const [rows] = await pool.query(
      `
      SELECT
        t.id,
        t.title,
        t.body,
        t.created_at,
        t.updated_at,
        u.id AS author_id,
        u.username AS author_username
      FROM topics t
      JOIN users u ON u.id = t.user_id
      WHERE t.id = ? AND t.deleted_at IS NULL
      LIMIT 1
      `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "not_found", message: "topic not found" });
    }

    res.json({ topic: rows[0] });
  } catch (err) {
    res.status(500).json({ error: "server_error", message: err.message });
  }
});

// #54 POST /topics (protected) - create new topic
router.post("/", requireAuth, async (req, res) => {
  try {
    const { title, body } = req.body ?? {};
    if (!title || !body) {
      return res.status(400).json({ error: "validation_error", message: "title and body are required" });
    }

    const cleanTitle = String(title).trim();
    const cleanBody = String(body).trim();

    if (cleanTitle.length < 3 || cleanTitle.length > 150) {
      return res.status(400).json({ error: "validation_error", message: "title must be 3-150 chars" });
    }
    if (cleanBody.length < 1) {
      return res.status(400).json({ error: "validation_error", message: "body cannot be empty" });
    }

    const userId = req.session.user.id;

    const [result] = await pool.query(
      "INSERT INTO topics (user_id, title, body) VALUES (?, ?, ?)",
      [userId, cleanTitle, cleanBody]
    );

    res.status(201).json({
      id: result.insertId,
      title: cleanTitle,
      body: cleanBody,
      user_id: userId
    });
  } catch (err) {
    res.status(500).json({ error: "server_error", message: err.message });
  }
});

module.exports = router;