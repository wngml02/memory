const mysql = require("mysql2/promise");
const pw = require("./secret.json");

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: pw.password,
    database: 'memory'
});

module.exports = db;