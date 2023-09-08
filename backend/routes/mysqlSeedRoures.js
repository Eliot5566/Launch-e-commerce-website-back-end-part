const express = require('express');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
// const seedRouter = require('./routes/seedRoutes.js');

// const mysql =require('mysql2/promise');
// const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// import data from '../data.js';

const seedRouter = express.Router();

seedRouter.get('/', async (req, res) => {
  try {
    const connection = await mysql.createConnection({
      host: '34.81.103.49',
      user: 'root',
      password: '',
      //這裡的port是mysql的port 不是後端伺服器的port
      port: 3306,
      database: 'japan',
    });

    // 先清空資料表
    await connection.query('DELETE FROM products');
    await connection.query('DELETE FROM users');

    // 插入產品資料
    for (const product of data.products) {
      await connection.query('INSERT INTO products SET ?', product);
    }

    // 插入使用者資料
    for (const user of data.users) {
      // 如果需要加密密碼，這裡可以使用 bcrypt 加密
      const hashedPassword = bcrypt.hashSync(user.password, 10);
      await connection.query(
        'INSERT INTO users (name, email, password, isAdmin) VALUES (?, ?, ?, ?)',
        [user.name, user.email, hashedPassword, user.isAdmin]
      );
    }

    connection.end();

    res.send({
      message: 'Seed data inserted successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: 'Internal Server Error',
    });
  }
});

module.export = seedRouter;
