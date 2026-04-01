const express = require("express");
const pool = require("../db/pool");
const bcrypt = require("bcrypt");

const router = express.Router();

// POST /auth/register
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body ?? {};

    if (!username || !email || !password) {
      return res.status(400).json({
        error: "validation_error",
        message: "username, email, and password are required"
      });
    }

    const cleanUsername = String(username).trim();
    const cleanEmail = String(email).trim().toLowerCase();
    const cleanPassword = String(password);

    if (cleanUsername.length < 3 || cleanUsername.length > 50) {
      return res.status(400).json({ error: "validation_error", message: "username must be 3-50 chars" });
    }
    if (cleanEmail.length < 5 || cleanEmail.length > 254 || !cleanEmail.includes("@")) {
      return res.status(400).json({ error: "validation_error", message: "email must be valid" });
    }
    if (cleanPassword.length < 6) {
      return res.status(400).json({ error: "validation_error", message: "password must be at least 6 chars" });
    }

    const [existing] = await pool.query(
      "SELECT id FROM users WHERE username = ? OR email = ? LIMIT 1",
      [cleanUsername, cleanEmail]
    );
    if (existing.length > 0) {
      return res.status(409).json({ error: "conflict", message: "username or email already exists" });
    }

    const passwordHash = await bcrypt.hash(cleanPassword, 10);

    const [result] = await pool.query(
      "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
      [cleanUsername, cleanEmail, passwordHash]
    );

    return res.status(201).json({
      id: result.insertId,
      username: cleanUsername,
      email: cleanEmail,
      role: "user"
    });
  } catch (err) {
    return res.status(500).json({ error: "server_error", message: err.message });
  }
});

// POST /auth/login
router.post("/login", async (req, res) => {
  try {
    const { identifier, password } = req.body ?? {};

    if (!identifier || !password) {
      return res.status(400).json({
        error: "validation_error",
        message: "identifier and password are required"
      });
    }

    const cleanIdentifier = String(identifier).trim().toLowerCase();
    const cleanPassword = String(password);

    // Find user by username OR email
    const [rows] = await pool.query(
      "SELECT id, username, email, password_hash, role FROM users WHERE username = ? OR email = ? LIMIT 1",
      [cleanIdentifier, cleanIdentifier]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "unauthorized", message: "invalid credentials" });
    }

    const user = rows[0];
    const ok = await bcrypt.compare(cleanPassword, user.password_hash);

    if (!ok) {
      return res.status(401).json({ error: "unauthorized", message: "invalid credentials" });
    }

    // Save session
    req.session.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    };

    return res.json({ message: "ok", user: req.session.user });
  } catch (err) {
    return res.status(500).json({ error: "server_error", message: err.message });
  }
});

// GET /auth/me
router.get("/me", (req, res) => {
  if (!req.session?.user) {
    return res.status(401).json({ error: "unauthorized", message: "not logged in" });
  }
  return res.json({ user: req.session.user });
});

module.exports = router;