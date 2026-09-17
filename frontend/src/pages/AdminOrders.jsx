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
  <main className="admin-page">
    <div className="admin-container">

      <div className="admin-header">
        <div>
          <span className="page-label">
            ADMIN DASHBOARD
          </span>

          <h1>Quản lý đơn hàng</h1>

          <p>
            Theo dõi và cập nhật trạng thái đơn hàng.
          </p>
        </div>

        <div className="admin-stat">
          <span>Tổng đơn hàng</span>
          <strong>{orders.length}</strong>
        </div>
      </div>

      {error && (
        <div className="admin-error">
          {error}
        </div>
      )}

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Khách hàng</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Ngày đặt</th>
              <th>Cập nhật</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>
                  <strong>#{order.id}</strong>
                </td>

                <td>
                  <div className="customer-cell">
                    <strong>
                      {order.username}
                    </strong>

                    <span>
                      {order.email}
                    </span>
                  </div>
                </td>

                <td className="admin-price">
                  {Number(
                    order.total_amount
                  ).toLocaleString("vi-VN")}{" "}
                  ₫
                </td>

                <td>
                  <span
                    className={`order-status status-${order.status}`}
                  >
                    {order.status}
                  </span>
                </td>

                <td>
                  {order.created_at
                    ? new Date(
                        order.created_at
                      ).toLocaleDateString(
                        "vi-VN"
                      )
                    : "—"}
                </td>

                <td>
                  <select
                    className="status-select"
                    value={order.status}
                    onChange={(e) =>
                      updateStatus(
                        order.id,
                        e.target.value
                      )
                    }
                  >
                    <option value="pending">
                      Chờ xác nhận
                    </option>

                    <option value="confirmed">
                      Đã xác nhận
                    </option>

                    <option value="shipping">
                      Đang giao
                    </option>

                    <option value="completed">
                      Hoàn thành
                    </option>

                    <option value="cancelled">
                      Đã hủy
                    </option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  </main>
  );
}

export default AdminOrders;