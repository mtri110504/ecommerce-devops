import { useState } from "react";
import { Link } from "react-router-dom";

function Cart() {
  const [cart, setCart] = useState(() => {
    return JSON.parse(localStorage.getItem("cart") || "[]");
  });

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return;

    const newCart = cart.map((item) =>
      item.id === id
        ? { ...item, quantity }
        : item
    );

    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const removeItem = (id) => {
    const newCart = cart.filter((item) => item.id !== id);

    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const total = cart.reduce(
    (sum, item) =>
      sum + Number(item.price) * item.quantity,
    0
  );

  const handleOrder = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Bạn cần đăng nhập trước khi đặt hàng!");
    window.location.href = "/login";
    return;
  }

  try {
    const items = cart.map((item) => ({
      product_id: item.id,
      quantity: item.quantity,
    }));

    const response = await fetch(
      "http://localhost:5001/api/orders",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ items }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Đặt hàng thất bại");
      return;
    }

    alert("Đặt hàng thành công!");

    localStorage.removeItem("cart");
    setCart([]);
  } catch (error) {
    console.error(error);
    alert("Không thể kết nối đến server");
  }
    };

  if (cart.length === 0) {
    return (
      <div className="container">
        <h1>Giỏ hàng</h1>
        <p>Giỏ hàng đang trống.</p>
        <Link to="/">Tiếp tục mua hàng</Link>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Giỏ hàng</h1>

      {cart.map((item) => (
        <div className="cart-item" key={item.id}>
          <div>
            <h3>{item.name}</h3>

            <p>
              {Number(item.price).toLocaleString("vi-VN")} ₫
            </p>
          </div>

          <div>
            <button
              onClick={() =>
                updateQuantity(item.id, item.quantity - 1)
              }
            >
              -
            </button>

            <span> {item.quantity} </span>

            <button
              onClick={() =>
                updateQuantity(item.id, item.quantity + 1)
              }
            >
              +
            </button>

            <button onClick={() => removeItem(item.id)}>
              Xóa
            </button>
          </div>
        </div>
      ))}

      <h2>
        Tổng tiền: {total.toLocaleString("vi-VN")} ₫
      </h2>

      <button onClick={handleOrder}>
        Đặt hàng
      </button>
    </div>
  );
}

export default Cart;