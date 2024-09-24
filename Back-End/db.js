const mysql = require("mysql2");
const pw = require("./secret.json");

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: pw.password,
    database: 'memory'
});

db.connect((err) => {
    if (err) throw err;
    console.log('MySQL connected...');
});

module.exports = db;