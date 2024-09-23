var mysql = require("mysql2");
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'user',
    password: 'minseok0326!',
    database: 'memory'
});
connection.connect();

connection.query('SELECT * from Users', (error, rows, fields) => {
    if (error) throw error;
    console.log('User info is: ', rows);
});

connection.end();