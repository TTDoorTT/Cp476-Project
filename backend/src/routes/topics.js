const { canManageResource } = require("../utils/authz");
const express = require("express");
const pool = require("../db/pool");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

// #55 GET /topics (public, with pagination/filter/sort)
router.get("/", async (req, res) => {
  try {
    const rawPage = Number(req.query.page ?? 1);
    const rawLimit = Number(req.query.limit ?? 10);
    const q = String(req.query.q ?? "").trim();
    const sort = String(req.query.sort ?? "newest");
    const scope = String(req.query.scope ?? "all");

    const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1;
    const limit =
      Number.isInteger(rawLimit) && rawLimit > 0
        ? Math.min(rawLimit, 50)
        : 10;
    const offset = (page - 1) * limit;

    const where = ["t.deleted_at IS NULL"];
    const params = [];

    if (scope === "mine") {
      if (!req.session?.user) {
        return res
          .status(401)
          .json({ error: "unauthorized", message: "login required for mine filter" });
      }

      where.push("t.user_id = ?");
      params.push(req.session.user.id);
    }

    if (q) {
      where.push("(t.title LIKE ? OR u.username LIKE ?)");
      params.push(`%${q}%`, `%${q}%`);
    }

    let orderBy = "t.created_at DESC";
    if (sort === "oldest") orderBy = "t.created_at ASC";
    if (sort === "title-asc") orderBy = "t.title ASC";
    if (sort === "title-desc") orderBy = "t.title DESC";

    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

    const [countRows] = await pool.query(
      `
      SELECT COUNT(*) AS total
      FROM topics t
      JOIN users u ON u.id = t.user_id
      ${whereSql}
      `,
      params
    );

    const total = Number(countRows[0]?.total ?? 0);
    const totalPages = Math.max(1, Math.ceil(total / limit));

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
      ${whereSql}
      ORDER BY ${orderBy}
      LIMIT ? OFFSET ?
      `,
      [...params, limit, offset]
    );

    res.json({
      topics: rows,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasPrev: page > 1,
        hasNext: page < totalPages,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "server_error", message: err.message });
  }
});

// #56 GET /topics/:id (public) - excludes soft-deleted
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res
        .status(400)
        .json({ error: "validation_error", message: "invalid topic id" });
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
      return res
        .status(404)
        .json({ error: "not_found", message: "topic not found" });
    }

    res.json({ topic: rows[0] });
  } catch (err) {
    res.status(500).json({ error: "server_error", message: err.message });
  }
});

// #57 PUT /topics/:id (protected) - owner/admin only
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res
        .status(400)
        .json({ error: "validation_error", message: "invalid topic id" });
    }

    const { title, body } = req.body ?? {};

    if (!title || !body) {
      return res.status(400).json({
        error: "validation_error",
        message: "title and body are required",
      });
    }

    const cleanTitle = String(title).trim();
    const cleanBody = String(body).trim();

    if (cleanTitle.length < 3 || cleanTitle.length > 150) {
      return res.status(400).json({
        error: "validation_error",
        message: "title must be 3-150 chars",
      });
    }

    if (cleanBody.length < 1) {
      return res.status(400).json({
        error: "validation_error",
        message: "body cannot be empty",
      });
    }

    const [rows] = await pool.query(
      "SELECT id, user_id FROM topics WHERE id = ? AND deleted_at IS NULL LIMIT 1",
      [id]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ error: "not_found", message: "topic not found" });
    }

    const ownerId = rows[0].user_id;

    if (!canManageResource(req.session.user, ownerId)) {
      return res
        .status(403)
        .json({ error: "forbidden", message: "not allowed" });
    }

    await pool.query(
      "UPDATE topics SET title = ?, body = ?, updated_at = NOW() WHERE id = ?",
      [cleanTitle, cleanBody, id]
    );

    return res.json({ message: "ok" });
  } catch (err) {
    return res.status(500).json({ error: "server_error", message: err.message });
  }
});

// #58 DELETE /topics/:id (protected) - soft delete, owner/admin only
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res
        .status(400)
        .json({ error: "validation_error", message: "invalid topic id" });
    }

    const [rows] = await pool.query(
      "SELECT id, user_id FROM topics WHERE id = ? AND deleted_at IS NULL LIMIT 1",
      [id]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ error: "not_found", message: "topic not found" });
    }

    const ownerId = rows[0].user_id;

    if (!canManageResource(req.session.user, ownerId)) {
      return res
        .status(403)
        .json({ error: "forbidden", message: "not allowed" });
    }

    await pool.query("UPDATE topics SET deleted_at = NOW() WHERE id = ?", [id]);

    return res.json({ message: "ok" });
  } catch (err) {
    return res.status(500).json({ error: "server_error", message: err.message });
  }
});

// #54 POST /topics (protected) - create new topic
router.post("/", requireAuth, async (req, res) => {
  try {
    const { title, body } = req.body ?? {};

    if (!title || !body) {
      return res.status(400).json({
        error: "validation_error",
        message: "title and body are required",
      });
    }

    const cleanTitle = String(title).trim();
    const cleanBody = String(body).trim();

    if (cleanTitle.length < 3 || cleanTitle.length > 150) {
      return res.status(400).json({
        error: "validation_error",
        message: "title must be 3-150 chars",
      });
    }

    if (cleanBody.length < 1) {
      return res.status(400).json({
        error: "validation_error",
        message: "body cannot be empty",
      });
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
      user_id: userId,
    });
  } catch (err) {
    res.status(500).json({ error: "server_error", message: err.message });
  }
});

module.exports = router;