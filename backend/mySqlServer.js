//使用此檔案開啟後端伺服器
// require('dotenv').config();
const dotenv = require('dotenv');

dotenv.config();
const express = require('express');

// const mysql = require('mysql2/promise');
const path = require('path');
const mysql = require('mysql');
const mysqlProductRouter = require('./routes/mysqlProduct.js');
const mysqlUsersRouter = require('./routes/mysqlUsers.js');
const mysqlOrderRouter = require('./routes/orderRoute.js');
const bodyParser = require('body-parser'); // 引入 body-parser 用于解析请求体
const cors = require('cors'); // 引入 cors 用于处理跨域请求

const nodemailer = require('nodemailer');
const emailValidator = require('email-validator');

const app = express();
app.use(cors());
app.use(bodyParser.json()); // 使用 body-parser 解析 JSON 请求体
// const productRouter = require('./routes/showAllProduct.js');
//訂閱
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
  extended: true
}));
//訂閱
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
    console.error('數據庫查詢錯誤:', error);
    throw error;
  }
}

// 添加路由
app.get('/', (req, res) => {
  return res.json('資料庫測試中');
});

app.get('/products', async (req, res) => {
  const sql = 'SELECT * FROM products WHERE onSale = 1';
  try {
    const results = await executeQuery(sql);
    console.log('==========丁丁 SQL指令執行OK');
    // console.log(results);
    return res.json(results);
  } catch (error) {
    console.error('數據庫查詢錯誤:', error);
    return res.status(500).json({
      error: 'Internal server error'
    });
  }
});

app.get('/products/:category', async (req, res) => {
  const category = req.params.category;
  const sql = 'SELECT * FROM products where category = ? and onSale = 1';

  try {
    const results = await executeQuery(sql, [category]);
    console.log('==========丁丁 SQL指令執行OK');
    // console.log(results);
    return res.json(results);
  } catch (error) {
    console.error('數據庫查詢錯誤:', error);
    return res.status(500).json({
      error: 'Internal server error'
    });
  }
});

app.get('/:_id', async (req, res) => {
  const _id = req.params._id;
  const sql = 'SELECT * FROM products where _id = ? and onSale = 1';

  try {
    const results = await executeQuery(sql, [_id]);
    console.log('==========丁丁 SQL指令執行OK');
    // console.log(results);
    return res.json(results);
  } catch (error) {
    console.error('數據庫查詢錯誤:', error);
    return res.status(500).json({
      error: 'Internal server error'
    });
  }
});

///卡片
app.post('/save-card-info', (req, res) => {
  const {
    userId,
    cardType,
    cardContent,
    selectedProduct
  } = req.body;

  // 把卡片資訊 產品資訊存入資料庫
  const sql =
    'INSERT INTO cards (user_id, card_type, card_content, selected_product) VALUES (?, ?, ?, ?)';
  db.query(
    sql,
    [userId, cardType, cardContent, selectedProduct],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({
          message: 'Internal Server Error'
        });
      } else {
        res
          .status(200)
          .json({
            message: 'Card and product information saved successfully'
          });
      }
    }
  );
});



//訂閱功能
app.post('/subscribe', async (req, res) => {
  const email = req.body.email;
  console.log(email);
  // 驗證郵件地址格式
  if (!emailValidator.validate(email)) {
    res.status(400).send('無效的郵件地址');
    return;
  }

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.MAIL_USER = 'eliotworkmail@gmail.com',
      pass: process.env.MAIL_PASS = 'myza ffmq yyid xlpq'
    }
  });

  const mailOptions = {
    from: process.env.MAIL_USER = 'eliotworkmail@gmail.com',
    to: email,
    subject: '拾月菓-訂閱確認',
    text: `親愛的拾月菓（Shiyue Guo）的忠實顧客，

      感謝您訂閱拾月菓的最新消息！我們非常高興您加入我們的大家庭。
      
      您將第一個獲得以下好處：
      
      獨家折扣和促銷信息：您將獲得我們最新的促銷信息，包括折扣和特別優惠。
      
      新產品發布通知：無需等待，我們將直接通知您我們的新產品發布。
      
      活動邀請：不定期，我們會為我們的忠實顧客舉辦特別活動，您將被邀請參加。
      
      再次感謝您對拾月菓的支持。如果您有任何問題或建議，請隨時聯繫我們。
      
      祝您擁有美味的日式果子時光！
      
      拾月菓團隊`
  };


  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send('訂閱失敗');
    } else {
      console.log('Email sent: ' + info.response);
      // 改成使用alert 提示訂閱成功
      // res.redirect('/');
      res.status(200).send('<script>alert("訂閱成功"); window.location.href = "https://last-frontendfinal.onrender.com/";</script>');

      // 之後把網頁轉回首頁


    }
  });
});

app.use(express.static('public'));
//訂閱功能

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