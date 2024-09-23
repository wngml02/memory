var mysql = require("mysql2");
var pw = require("./secret.json");
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: pw.password,
    database: 'memory'
});
connection.connect();

connection.query('SELECT * from memory_group', (error, rows, fields) => {
    if (error) throw error;
    console.log('User info is: ', rows);
});

connection.end();