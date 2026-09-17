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
    <div className="container">
      <h1>Đơn hàng của tôi</h1>

      {orders.length === 0 ? (
        <>
          <p>Bạn chưa có đơn hàng nào.</p>
          <Link to="/">Mua hàng ngay</Link>
        </>
      ) : (
        <div>
          {orders.map((order) => (
            <div className="order-card" key={order.id}>
              <h3>Đơn hàng #{order.id}</h3>

              <p>
                Tổng tiền:{" "}
                <strong>
                  {Number(order.total_amount).toLocaleString(
                    "vi-VN"
                  )}{" "}
                  ₫
                </strong>
              </p>

              <p>
                Trạng thái:{" "}
                <strong>{order.status}</strong>
              </p>

              <p>
                Ngày đặt:{" "}
                {new Date(order.created_at).toLocaleString(
                  "vi-VN"
                )}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyOrders;