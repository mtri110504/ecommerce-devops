import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    fetch("http://localhost:5001/api/orders/my-orders", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Không thể lấy đơn hàng"
          );
        }

        return data;
      })
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError(error.message);
        setLoading(false);
      });
  }, [navigate]);

  if (loading) {
    return (
      <div className="container">
        <h2>Đang tải đơn hàng...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <h2>{error}</h2>
      </div>
    );
  }

  return (
    <main className="orders-page">
    <div className="orders-container">
      <div className="page-header">
        <div>
          <span className="page-label">TÀI KHOẢN</span>
          <h1>Đơn hàng của tôi</h1>
          <p>
            Theo dõi và quản lý các đơn hàng của bạn.
          </p>
        </div>

        <Link to="/" className="continue-shopping">
          + Tiếp tục mua hàng
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="empty-orders">
          <div>📦</div>
          <h2>Chưa có đơn hàng</h2>
          <p>
            Bạn chưa thực hiện đơn hàng nào tại
            CloudTech Store.
          </p>

          <Link to="/">
            Khám phá sản phẩm
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <article
              className="modern-order-card"
              key={order.id}
            >
              <div className="order-card-header">
                <div>
                  <span className="order-number">
                    ĐƠN HÀNG
                  </span>

                  <h3>#{order.id}</h3>
                </div>

                <span
                  className={`order-status status-${order.status}`}
                >
                  {order.status === "pending" &&
                    "Chờ xác nhận"}

                  {order.status === "confirmed" &&
                    "Đã xác nhận"}

                  {order.status === "shipping" &&
                    "Đang giao hàng"}

                  {order.status === "completed" &&
                    "Hoàn thành"}

                  {order.status === "cancelled" &&
                    "Đã hủy"}
                </span>
              </div>

              <div className="order-card-body">
                <div className="order-data">
                  <span>Ngày đặt hàng</span>

                  <strong>
                    {new Date(
                      order.created_at
                    ).toLocaleString("vi-VN")}
                  </strong>
                </div>

                <div className="order-data">
                  <span>Trạng thái</span>
                  <strong>{order.status}</strong>
                </div>

                <div className="order-data">
                  <span>Tổng thanh toán</span>

                  <strong className="order-price">
                    {Number(
                      order.total_amount
                    ).toLocaleString("vi-VN")}{" "}
                    ₫
                  </strong>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  </main>
  );
}

export default MyOrders;