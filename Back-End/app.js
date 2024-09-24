var mysql = require("mysql2");
var pw = require("./secret.json");
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: pw.password,
    database: 'memory'
});

// MySQL 연결 테스트
db.connect((err) => {
    if (err) throw err;
    console.log('MySQL connected...');
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});