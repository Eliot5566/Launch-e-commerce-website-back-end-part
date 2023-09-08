// const express = require('express');
// const mysql = require('mysql2/promise');
// const productRouter = express.Router();

// // 請根據你的 MySQL 連接設定進行修改
// const db = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'japan',
//   port: 8080,
// });

// // 路由处理程序 - 获取所有产品
// productRouter.get('/', async (req, res) => {
//   try {
//     const connection = await db.getConnection();
//     const [products] = await connection.query('SELECT * FROM products');
//     connection.release();
//     res.send(products);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({
//       message: 'Internal Server Error',
//     });
//   }
// });

// // 路由处理程序 - 根据产品 slug 获取产品
// productRouter.get('/_id', async (req, res) => {
//   try {
//     const connection = await db.getConnection();
//     const [product] = await connection.query(
//       'SELECT * FROM products WHERE _id = ?',
//       [req.params._id]
//     );
//     connection.release();

//     if (product.length > 0) {
//       res.send(product[0]);
//     } else {
//       res.status(404).send({
//         message: 'Product Not Found',
//       });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({
//       message: 'Internal Server Error',
//     });
//   }
// });

// // 路由处理程序 - 根据产品 ID 获取产品
// productRouter.get('/:id', async (req, res) => {
//   try {
//     const connection = await db.getConnection();
//     const [product] = await connection.query(
//       'SELECT * FROM products WHERE _id = ?',
//       [req.params.id]
//     );
//     connection.release();

//     if (product.length > 0) {
//       res.send(product[0]);
//     } else {
//       res.status(404).send({
//         message: 'Product Not Found',
//       });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({
//       message: 'Internal Server Error',
//     });
//   }
// });

// module.exports = productRouter;
