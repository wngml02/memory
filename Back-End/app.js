const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const groupRoutes = require('./routes/groupRoutes'); // 그룹 라우트 불러오기
const db = require('./db'); // 데이터베이스 연결 설정


const app = express();
app.use(bodyParser.json());

// 그룹 관련 API 라우트 설정
app.use('/groups', groupRoutes);


app.listen(3000, () => {
    console.log('Server running on port 3000');
});