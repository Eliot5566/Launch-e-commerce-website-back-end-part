//使用此檔案開啟後端伺服器
// require('dotenv').config();
const dotenv = require('dotenv');

dotenv.config();
const express = require('express');

// const mysql = require('mysql2/promise');
const path = require('path');
const mysql = require('mysql');
const mysqlProductRouter = require('./routes/mysqlProduct.js');
const mysqlSeedRouter = require('./routes/mysqlSeedRoures.js');
const mysqlUsersRouter = require('./routes/mysqlUsers.js');
const mysqlOrderRouter = require('./routes/orderRoute.js');
const bodyParser = require('body-parser'); // 引入 body-parser 用于解析请求体
const cors = require('cors'); // 引入 cors 用于处理跨域请求

const app = express();
app.use(cors());
app.use(bodyParser.json()); // 使用 body-parser 解析 JSON 请求体
// const productRouter = require('./routes/showAllProduct.js');

// MySQL 連線設定 只需要const db 不用調用 是因為在mysqlProduct.js中已經調用了
//mysqlProduct.js 會調用mysql2/promise 這個套件
// const db = mysql.createPool({
//   host: process.env.DB_HOST || 'localhost',
//   user: process.env.DB_USER || 'root',
//   password: process.env.DB_PASSWORD || '',
//   database: process.env.DB_NAME || 'japan',
//   port: process.env.DB_PORT || 8080, // 請根據您的 MySQL 設定修改 port
// });

const db = mysql.createConnection({
  host: '34.81.103.49',
  user: 'root',
  password: '123456',
  //這裡的port是mysql的port 不是後端伺服器的port
  port: 3306,
  database: 'japan',
});
// MySQL连接测试
db.connect(function (err) {
  if (err) {
    console.log('==========瓜瓜 資料庫有問題');
    console.log(err);
  } else {
    console.log('==========丁丁 資料庫ok');
  }
});

// 创建一个函数来执行查询并返回一个 Promise
function queryAsync(sql, params) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (error, results, fields) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(results);
    });
  });
}

// 修改 executeQuery，使用 async/await 等待查询完成
async function executeQuery(sql, params) {
  try {
    const results = await queryAsync(sql, params);
    return results;
  } catch (error) {
    console.error('数据库查询错误:', error);
    throw error;
  }
}

// 添加路由
app.get('/', (req, res) => {
  return res.json('資料庫測試中');
});

app.get('/products', async (req, res) => {
  const sql = 'SELECT * FROM products';
  try {
    const results = await executeQuery(sql);
    console.log('==========丁丁 SQL指令執行OK');
    console.log(results);
    return res.json(results);
  } catch (error) {
    console.error('数据库查询错误:', error);
    return res.status(500).json({
      error: 'Internal server error'
    });
  }
});

app.get('/products/:category', async (req, res) => {
  const category = req.params.category;
  const sql = 'SELECT * FROM products where category = ?';

  try {
    const results = await executeQuery(sql, [category]);
    console.log('==========丁丁 SQL指令執行OK');
    console.log(results);
    return res.json(results);
  } catch (error) {
    console.error('数据库查询错误:', error);
    return res.status(500).json({
      error: 'Internal server error'
    });
  }
});

app.get('/:_id', async (req, res) => {
  const _id = req.params._id;
  const sql = 'SELECT * FROM products where _id = ?';

  try {
    const results = await executeQuery(sql, [_id]);
    console.log('==========丁丁 SQL指令執行OK');
    console.log(results);
    return res.json(results);
  } catch (error) {
    console.error('数据库查询错误:', error);
    return res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// 使用 express.json() 中介軟體來解析 JSON 格式的請求主體
app.use(express.json());
// 使用 express.urlencoded() 中介軟體來解析 URL 編碼的請求主體
app.use(express.urlencoded({
  extended: true
}));

app.get('/api/keys/paypal', (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || 'sb');
});
// app.use('/api/seed', seedRouter);
// 設定路由 /api/products 使用 mysqlProductRouter
app.use('/api/products', mysqlProductRouter);

// 設定路由 /api/users 使用 mysqlUsersRouter
app.use('/api/users', mysqlUsersRouter);

app.use('/api/orders', mysqlOrderRouter);

// const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, '/frontend/build')));
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/frontend/build/index.html'))
);
// 将路由与主应用程序关联

app.use((err, req, res, next) => {
  res.status(500).send({
    message: err.message
  });
});

const port = process.env.PORT || 10000;

app.listen(port, () => {
  console.log(`後端伺服器MySQL 啟動於 http://localhost:${port}`);
});