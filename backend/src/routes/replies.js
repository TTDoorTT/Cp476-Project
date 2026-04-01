const express = require("express");
const pool = require("../db/pool");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

// #64 GET /topics/:topicId/replies (public) - ordered oldest->newest, excludes soft-deleted
router.get("/topics/:topicId/replies", async (req, res) => {
  try {
    const topicId = Number(req.params.topicId);
    if (!Number.isInteger(topicId) || topicId <= 0) {
      return res.status(400).json({ error: "validation_error", message: "invalid topic id" });
    }

    // Optional: ensure topic exists and not deleted
    const [topicRows] = await pool.query(
      "SELECT id FROM topics WHERE id = ? AND deleted_at IS NULL LIMIT 1",
      [topicId]
    );
    if (topicRows.length === 0) {
      return res.status(404).json({ error: "not_found", message: "topic not found" });
    }

    const [rows] = await pool.query(
      `
      SELECT
        r.id,
        r.body,
        r.created_at,
        r.updated_at,
        u.id AS author_id,
        u.username AS author_username
      FROM replies r
      JOIN users u ON u.id = r.user_id
      WHERE r.topic_id = ? AND r.deleted_at IS NULL
      ORDER BY r.created_at ASC
      `,
      [topicId]
    );

    res.json({ replies: rows });
  } catch (err) {
    res.status(500).json({ error: "server_error", message: err.message });
  }
});

// #63 POST /topics/:topicId/replies (protected) - create reply
router.post("/topics/:topicId/replies", requireAuth, async (req, res) => {
  try {
    const topicId = Number(req.params.topicId);
    if (!Number.isInteger(topicId) || topicId <= 0) {
      return res.status(400).json({ error: "validation_error", message: "invalid topic id" });
    }

    const { body } = req.body ?? {};
    if (!body) {
      return res.status(400).json({ error: "validation_error", message: "body is required" });
    }
    const cleanBody = String(body).trim();
    if (cleanBody.length === 0) {
      return res.status(400).json({ error: "validation_error", message: "body cannot be empty" });
    }

    // Ensure topic exists and not deleted
    const [topicRows] = await pool.query(
      "SELECT id FROM topics WHERE id = ? AND deleted_at IS NULL LIMIT 1",
      [topicId]
    );
    if (topicRows.length === 0) {
      return res.status(404).json({ error: "not_found", message: "topic not found" });
    }

    const userId = req.session.user.id;

    const [result] = await pool.query(
      "INSERT INTO replies (topic_id, user_id, body) VALUES (?, ?, ?)",
      [topicId, userId, cleanBody]
    );

    res.status(201).json({
      id: result.insertId,
      topic_id: topicId,
      user_id: userId,
      body: cleanBody
    });
  } catch (err) {
    res.status(500).json({ error: "server_error", message: err.message });
  }
});

module.exports = router;