// routes/transaksi.js
const express = require("express");
const router = express.Router();
const db = require("./connection");

router.get("/dashboard", (req, res) => {
  const masukSql = "SELECT IFNULL(SUM(jumlah),0) AS total_masuk FROM transaksi WHERE jenis = 'masuk'";
  const keluarSql = "SELECT IFNULL(SUM(jumlah),0) AS total_keluar FROM transaksi WHERE jenis = 'keluar'";
  db.query(masukSql, (err, masukResults) => {
    if (err) return res.status(500).json({ error: err.message });
    db.query(keluarSql, (err, keluarResults) => {
      if (err) return res.status(500).json({ error: err.message });
      const total_masuk = masukResults[0].total_masuk;
      const total_keluar = keluarResults[0].total_keluar;
      const saldo = total_masuk - total_keluar;
      res.json({ total_masuk, total_keluar, saldo });
    });
  });
});

router.get("/", (req, res) => {
  const search = req.query.search || "";
  let sql = `
    SELECT 
      t.id,
      t.tanggal,
      t.no_bukti,
      t.diterima_dari,
      CONCAT(a.no_akun, ' ', a.nama_akun) AS untuk_keperluan,
      t.jumlah,
      t.jenis
    FROM transaksi t
    LEFT JOIN akun a ON t.untuk_keperluan = a.no_akun
  `;
  let params = [];
  if (search) {
    sql += " WHERE t.no_bukti LIKE ? OR t.diterima_dari LIKE ? OR CONCAT(a.no_akun, ' ', a.nama_akun) LIKE ?";
    const likeSearch = "%" + search + "%";
    params = [likeSearch, likeSearch, likeSearch];
  }
  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

router.post("/", (req, res) => {
  const { tanggal, no_bukti, diterima_dari, untuk_keperluan, jumlah, jenis } = req.body;
  if (!tanggal || !no_bukti || !diterima_dari || !untuk_keperluan || !jumlah || !jenis) {
    return res.status(400).json({ error: "All fields are required" });
  }
  const query = `
    INSERT INTO transaksi 
    (tanggal, no_bukti, diterima_dari, untuk_keperluan, jumlah, jenis)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.query(query, [tanggal, no_bukti, diterima_dari, untuk_keperluan, jumlah, jenis], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({
      id: results.insertId,
      tanggal,
      no_bukti,
      diterima_dari,
      untuk_keperluan,
      jumlah,
      jenis,
    });
  });
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { tanggal, no_bukti, diterima_dari, untuk_keperluan, jumlah, jenis } = req.body;
  if (!tanggal || !no_bukti || !diterima_dari || !untuk_keperluan || !jumlah || !jenis) {
    return res.status(400).json({ error: "All fields are required" });
  }
  const query = `
    UPDATE transaksi 
    SET tanggal = ?, no_bukti = ?, diterima_dari = ?, untuk_keperluan = ?, jumlah = ?, jenis = ?
    WHERE id = ?
  `;
  db.query(query, [tanggal, no_bukti, diterima_dari, untuk_keperluan, jumlah, jenis, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({
      id,
      tanggal,
      no_bukti,
      diterima_dari,
      untuk_keperluan,
      jumlah,
      jenis,
    });
  });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM transaksi WHERE id = ?";
  db.query(query, [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(204).send();
  });
});

module.exports = router;

