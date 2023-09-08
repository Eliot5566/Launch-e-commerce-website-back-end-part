const mysql = require('mysql2');

// 创建一个 MySQL 数据库连接池
const pool = mysql.createPool({
  host: '34.81.103.49',
  user: 'root',
  password: '123456',
  //這裡的port是mysql的port 不是後端伺服器的port
  port: 3306,
  database: 'japan',
});

// 创建 MySQL 表结构
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to MySQL database: ' + err.message);
    return;
  }

  const createTableQuery = `
    CREATE TABLE orderlist (
      id INT AUTO_INCREMENT PRIMARY KEY,
      orderItems JSON NOT NULL,
      fullName VARCHAR(255) NOT NULL,
      address VARCHAR(255) NOT NULL,
      city VARCHAR(255) NOT NULL,
      postalCode VARCHAR(20) NOT NULL,
      country VARCHAR(255) NOT NULL,
      paymentMethod VARCHAR(255) NOT NULL,
      paymentResult JSON,
      itemsPrice DECIMAL(10, 2) NOT NULL,
      shippingPrice DECIMAL(10, 2) NOT NULL,
      taxPrice DECIMAL(10, 2) ,
      totalPrice DECIMAL(10, 2) NOT NULL,
      userId INT NOT NULL,
      isPaid BOOLEAN DEFAULT false,
      paidAt DATETIME,
      isDelivered BOOLEAN DEFAULT false,
      deliveredAt DATETIME,
      createdAt DATETIME NOT NULL,
      updatedAt DATETIME NOT NULL
    )
  `;

  connection.query(createTableQuery, (err, results) => {
    if (err) {
      console.error('Error creating MySQL table: ' + err.message);
    } else {
      console.log('MySQL table "orders" created successfully.');
    }
    connection.release();
  });
});

// 导出 MySQL 数据库连接池
module.exports = pool;