const express = require("express");

const healthRouter = require("./routes/health");
const dbTestRouter = require("./routes/dbtest");

const app = express();
app.use(express.json());

app.use("/health", healthRouter);
app.use("/db-test", dbTestRouter);

app.use((req, res) => {
  res.status(404).json({ error: "not_found", message: "Route not found" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});