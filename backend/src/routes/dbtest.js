const express = require("express");
const pool = require("../db/pool");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 AS ok");
    res.json({ db: "ok", result: rows[0] });
  } catch (err) {
    res.status(500).json({ error: "db_error", message: err.message });
  }
});

module.exports = router;