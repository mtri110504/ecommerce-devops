const db = require("../db");

exports.createOrder = async (req, res) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const userId = req.user.id;
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        message: "Đơn hàng phải có ít nhất một sản phẩm",
      });
    }

    let totalAmount = 0;

    for (const item of items) {
      const [products] = await connection.query(
        "SELECT id, price, stock FROM products WHERE id = ?",
        [item.product_id]
      );

      if (products.length === 0) {
        await connection.rollback();

        return res.status(404).json({
          message: `Không tìm thấy sản phẩm ID ${item.product_id}`,
        });
      }

      const product = products[0];

      if (product.stock < item.quantity) {
        await connection.rollback();

        return res.status(400).json({
          message: `Sản phẩm ID ${item.product_id} không đủ hàng`,
        });
      }

      totalAmount += Number(product.price) * item.quantity;
    }

    const [orderResult] = await connection.query(
      `INSERT INTO orders (user_id, total_amount)
       VALUES (?, ?)`,
      [userId, totalAmount]
    );

    const orderId = orderResult.insertId;

    for (const item of items) {
      const [products] = await connection.query(
        "SELECT price FROM products WHERE id = ?",
        [item.product_id]
      );

      const price = products[0].price;

      await connection.query(
        `INSERT INTO order_items
         (order_id, product_id, quantity, price)
         VALUES (?, ?, ?, ?)`,
        [orderId, item.product_id, item.quantity, price]
      );

      await connection.query(
        `UPDATE products
         SET stock = stock - ?
         WHERE id = ?`,
        [item.quantity, item.product_id]
      );
    }

    await connection.commit();

    res.status(201).json({
      message: "Tạo đơn hàng thành công",
      order_id: orderId,
      total_amount: totalAmount,
    });
  } catch (error) {
    await connection.rollback();

    console.error(error);

    res.status(500).json({
      message: "Lỗi tạo đơn hàng",
    });
  } finally {
    connection.release();
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const [orders] = await db.query(
      `SELECT *
       FROM orders
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [userId]
    );

    res.json(orders);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Lỗi lấy danh sách đơn hàng",
    });
  }
};

// Admin - lấy tất cả đơn hàng
exports.getAllOrders = async (req, res) => {
  try {
    const [orders] = await db.query(`
      SELECT
        orders.id,
        orders.user_id,
        users.username,
        users.email,
        orders.total_amount,
        orders.status,
        orders.created_at
      FROM orders
      JOIN users ON orders.user_id = users.id
      ORDER BY orders.created_at DESC
    `);

    res.json(orders);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Lỗi lấy danh sách đơn hàng",
    });
  }
};

// Admin - cập nhật trạng thái đơn hàng
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatus = [
      "pending",
      "confirmed",
      "shipping",
      "completed",
      "cancelled",
    ];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Trạng thái đơn hàng không hợp lệ",
      });
    }

    const [result] = await db.query(
      `UPDATE orders
       SET status = ?
       WHERE id = ?`,
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Không tìm thấy đơn hàng",
      });
    }

    res.json({
      message: "Cập nhật trạng thái đơn hàng thành công",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Lỗi cập nhật đơn hàng",
    });
  }
};