// app.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
const akunRoutes = require("./routes/akun");
const transaksiRoutes = require("./routes/transaksi");

app.get("/", (req, res) => {
  res.send("Fasni Efwa Juniar<br><h1>MI 4A</h1>");
});

app.use("/api/akun", akunRoutes);
app.use("/api/transaksi", transaksiRoutes);
app.use("/api", transaksiRoutes); // untuk /api/dashboard

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
