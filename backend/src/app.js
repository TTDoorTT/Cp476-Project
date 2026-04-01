const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const authRouter = require("./routes/auth");
const topicsRouter = require("./routes/topics");
const repliesRouter = require("./routes/replies");
require("dotenv").config();

const express = require("express");

const healthRouter = require("./routes/health");
const dbTestRouter = require("./routes/dbtest");

const app = express();
app.use(express.json());

app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
  credentials: true
}));

app.use(cookieParser());

app.use(session({
  secret: process.env.SESSION_SECRET || "dev_secret_change_later",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: "lax"
  }
}));

app.use("/health", healthRouter);
app.use("/db-test", dbTestRouter);

app.get("/session-test", (req, res) => {
  req.session.views = (req.session.views || 0) + 1;
  res.json({ views: req.session.views });
});
app.use("/auth", authRouter);

const requireAuth = require("./middleware/requireAuth");

app.get("/protected-test", requireAuth, (req, res) => {
  res.json({ ok: true, user: req.session.user });
});

app.use("/topics", topicsRouter);

app.use("/", repliesRouter);

app.use((req, res) => {
  res.status(404).json({ error: "not_found", message: "Route not found" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});