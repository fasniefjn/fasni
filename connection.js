// db/connection.js
const mysql = require("mysql2");

let db;

try {
  db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "dana_kas",
  });

  db.connect((err) => {
    if (err) {
      console.warn("Skipping MySQL connection during Jenkins build:", err.message);
      return;
    }
    console.log("Connected to MySQL database.");
  });
} catch (err) {
  console.warn("MySQL connection skipped:", err.message);
}

module.exports = db;
