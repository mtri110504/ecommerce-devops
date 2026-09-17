const express = require("express");

const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

const {
  verifyToken,
  verifyAdmin,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Customer tạo đơn hàng
router.post("/", verifyToken, createOrder);

// Customer xem đơn hàng của chính mình
router.get("/my-orders", verifyToken, getMyOrders);

// Admin xem tất cả đơn hàng
router.get(
  "/",
  verifyToken,
  verifyAdmin,
  getAllOrders
);

// Admin cập nhật trạng thái đơn hàng
router.put(
  "/:id/status",
  verifyToken,
  verifyAdmin,
  updateOrderStatus
);

module.exports = router;