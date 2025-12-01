// routes/akun.js
const express = require("express");
const router = express.Router();
const db = require("./connection");

router.get("/", (req, res) => {
  db.query("SELECT * FROM akun", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

router.post("/", (req, res) => {
  const { no_akun, nama_akun } = req.body;
  if (!no_akun || !nama_akun) {
    return res.status(400).json({ error: "no_akun and nama_akun are required" });
  }
  const query = "INSERT INTO akun (no_akun, nama_akun) VALUES (?, ?)";
  db.query(query, [no_akun, nama_akun], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ no_akun, nama_akun });
  });
});

router.put("/:no_akun", (req, res) => {
  const { no_akun } = req.params;
  const { nama_akun } = req.body;
  if (!nama_akun) {
    return res.status(400).json({ error: "nama_akun is required" });
  }
  const query = "UPDATE akun SET nama_akun = ? WHERE no_akun = ?";
  db.query(query, [nama_akun, no_akun], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ no_akun, nama_akun });
  });
});

router.delete("/:no_akun", (req, res) => {
  const { no_akun } = req.params;
  const query = "DELETE FROM akun WHERE no_akun = ?";
  db.query(query, [no_akun], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(204).send();
  });
});

module.exports = router;

