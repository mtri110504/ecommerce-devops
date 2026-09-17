import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (!token) {
      navigate("/login");
      return;
    }

    if (user?.role !== "admin") {
      navigate("/");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5001/api/orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Không thể lấy danh sách đơn hàng"
        );
      }

      setOrders(data);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, status) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:5001/api/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Cập nhật thất bại");
        return;
      }

      alert("Cập nhật trạng thái thành công!");

      fetchOrders();
    } catch (error) {
      console.error(error);
      alert("Không thể kết nối đến server");
    }
  };

  if (loading) {
    return (
      <div className="container">
        <h2>Đang tải đơn hàng...</h2>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Quản lý đơn hàng</h1>

      {error && <p>{error}</p>}

      {orders.map((order) => (
        <div className="order-card" key={order.id}>
          <h3>Đơn hàng #{order.id}</h3>

          <p>Khách hàng: {order.username}</p>
          <p>Email: {order.email}</p>

          <p>
            Tổng tiền:{" "}
            {Number(order.total_amount).toLocaleString("vi-VN")} ₫
          </p>

          <p>Trạng thái hiện tại: {order.status}</p>

          <select
            value={order.status}
            onChange={(e) =>
              updateStatus(order.id, e.target.value)
            }
          >
            <option value="pending">Chờ xác nhận</option>
            <option value="confirmed">Đã xác nhận</option>
            <option value="shipping">Đang giao</option>
            <option value="completed">Hoàn thành</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>
      ))}
    </div>
  );
}

export default AdminOrders;