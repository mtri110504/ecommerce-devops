import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(() => {
    return JSON.parse(localStorage.getItem("cart") || "[]");
  });

  // Lưu cart + thông báo cho Navbar cập nhật badge
  const saveCart = (newCart) => {
    setCart(newCart);

    localStorage.setItem("cart", JSON.stringify(newCart));

    window.dispatchEvent(new Event("cartUpdated"));
  };

  // Tăng / giảm số lượng
  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return;

    const newCart = cart.map((item) =>
      item.id === id ? { ...item, quantity } : item,
    );

    saveCart(newCart);
  };

  // Xóa sản phẩm
  const removeItem = (id) => {
    const newCart = cart.filter((item) => item.id !== id);

    saveCart(newCart);
  };

  // Tổng tiền
  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0,
  );

  // Tổng số lượng sản phẩm
  const totalQuantity = cart.reduce(
    (sum, item) => sum + Number(item.quantity),
    0,
  );

  // Đặt hàng
  const handleOrder = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Bạn cần đăng nhập trước khi đặt hàng!");

      navigate("/login");
      return;
    }

    if (cart.length === 0) {
      alert("Giỏ hàng đang trống!");
      return;
    }

    try {
      const items = cart.map((item) => ({
        product_id: item.id,
        quantity: Number(item.quantity),
      }));

      const response = await fetch("http://localhost:5001/api/orders", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          items,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Đặt hàng thất bại");

        return;
      }

      alert("Đặt hàng thành công!");

      // Xóa giỏ hàng
      localStorage.removeItem("cart");

      setCart([]);

      // Cập nhật badge Navbar
      window.dispatchEvent(new Event("cartUpdated"));

      // Chuyển sang đơn hàng
      navigate("/my-orders");
    } catch (error) {
      console.error(error);

      alert("Không thể kết nối đến server");
    }
  };

  // =========================
  // EMPTY CART
  // =========================

  if (cart.length === 0) {
    return (
      <main className="cart-page">
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>

          <h1>Giỏ hàng đang trống</h1>

          <p>Bạn chưa thêm sản phẩm nào vào giỏ hàng.</p>

          <Link to="/" className="shop-button">
            Khám phá sản phẩm
          </Link>
        </div>
      </main>
    );
  }

  // =========================
  // CART
  // =========================

  return (
    <main className="cart-page">
      <div className="cart-container">
        {/* HEADER */}

        <div className="cart-heading">
          <div>
            <span>GIỎ HÀNG</span>

            <h1>Giỏ hàng của bạn</h1>

            <p>{totalQuantity} sản phẩm trong giỏ hàng</p>
          </div>

          <Link to="/">← Tiếp tục mua hàng</Link>
        </div>

        <div className="cart-layout">
          {/* PRODUCTS */}

          <section className="cart-products">
            {cart.map((item) => (
              <article className="cart-product" key={item.id}>
                {/* IMAGE */}

                <div className="cart-product-image">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <span>💻</span>
                  )}
                </div>

                {/* PRODUCT INFO */}

                <div className="cart-product-info">
                  <h3>{item.name}</h3>

                  <p>{Number(item.price).toLocaleString("vi-VN")} ₫</p>

                  <button
                    type="button"
                    className="remove-button"
                    onClick={() => removeItem(item.id)}
                  >
                    Xóa sản phẩm
                  </button>
                </div>

                {/* QUANTITY */}

                <div className="quantity-control">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    −
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>

                {/* ITEM TOTAL */}

                <strong className="cart-item-total">
                  {(Number(item.price) * Number(item.quantity)).toLocaleString(
                    "vi-VN",
                  )}{" "}
                  ₫
                </strong>
              </article>
            ))}
          </section>

          {/* ORDER SUMMARY */}

          <aside className="order-summary">
            <span className="summary-label">ĐƠN HÀNG</span>

            <h2>Tóm tắt đơn hàng</h2>

            <div className="summary-row">
              <span>Sản phẩm</span>

              <span>{totalQuantity}</span>
            </div>

            <div className="summary-row">
              <span>Tạm tính</span>

              <span>{total.toLocaleString("vi-VN")} ₫</span>
            </div>

            <div className="summary-row">
              <span>Phí vận chuyển</span>

              <span className="free-shipping">Miễn phí</span>
            </div>

            <div className="summary-divider" />

            <div className="summary-total">
              <span>Tổng cộng</span>

              <strong>{total.toLocaleString("vi-VN")} ₫</strong>
            </div>

            <button
              type="button"
              className="checkout-button"
              onClick={handleOrder}
            >
              Đặt hàng →
            </button>

            <p className="secure-text">🔒 Đơn hàng được xử lý an toàn</p>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default Cart;
