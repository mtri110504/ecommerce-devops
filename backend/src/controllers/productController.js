const db = require("../db");

// GET all products
exports.getProducts = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM products ORDER BY id DESC");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi lấy danh sách sản phẩm" });
  }
};

// GET product by id
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      "SELECT * FROM products WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi lấy sản phẩm" });
  }
};

// POST product
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, image_url } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({
        message: "Tên và giá sản phẩm là bắt buộc",
      });
    }

    const [result] = await db.query(
      `INSERT INTO products
      (name, description, price, stock, image_url)
      VALUES (?, ?, ?, ?, ?)`,
      [
        name,
        description || null,
        price,
        stock || 0,
        image_url || null,
      ]
    );

    res.status(201).json({
      message: "Thêm sản phẩm thành công",
      id: result.insertId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi thêm sản phẩm" });
  }
};

// PUT product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, image_url } = req.body;

    const [result] = await db.query(
      `UPDATE products
       SET name = ?,
           description = ?,
           price = ?,
           stock = ?,
           image_url = ?
       WHERE id = ?`,
      [name, description, price, stock, image_url, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Không tìm thấy sản phẩm",
      });
    }

    res.json({
      message: "Cập nhật sản phẩm thành công",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Lỗi cập nhật sản phẩm",
    });
  }
};

// DELETE product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      "DELETE FROM products WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Không tìm thấy sản phẩm",
      });
    }

    res.json({
      message: "Xóa sản phẩm thành công",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Lỗi xóa sản phẩm",
    });
  }
};