import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const user = JSON.parse(localStorage.getItem("user") || "null");

  // =========================
  // CART COUNT
  // =========================

  const getCartCount = () => {
    try {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");

      return cart.reduce(
        (total, item) => total + Number(item.quantity || 0),
        0,
      );
    } catch (error) {
      console.error("Lỗi đọc giỏ hàng:", error);
      return 0;
    }
  };

  const [cartCount, setCartCount] = useState(getCartCount());

  // =========================
  // LISTEN CART CHANGES
  // =========================

  useEffect(() => {
    const updateCartCount = () => {
      setCartCount(getCartCount());
    };

    // Event trong cùng tab
    window.addEventListener("cartUpdated", updateCartCount);

    // Nếu cart thay đổi ở tab khác
    window.addEventListener("storage", updateCartCount);

    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);

      window.removeEventListener("storage", updateCartCount);
    };
  }, []);

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  // =========================
  // UI
  // =========================

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* LOGO */}

        <Link to="/" className="logo">
          <span className="logo-icon">☁</span>
          CloudTech
        </Link>

        {/* NAVIGATION */}

        <div className="nav-links">
          <Link to="/">Sản phẩm</Link>

          {/* CART */}

          <Link to="/cart" className="cart-link">
            <span>🛒</span>
            Giỏ hàng
            {cartCount > 0 && (
              <span className="cart-badge">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>

          {/* NOT LOGGED IN */}

          {!token ? (
            <>
              <Link to="/login">Đăng nhập</Link>

              <Link to="/register" className="register-btn">
                Đăng ký
              </Link>
            </>
          ) : (
            <>
              {/* CUSTOMER */}

              <Link to="/my-orders">Đơn hàng</Link>

              {/* ADMIN */}

              {user?.role === "admin" && (
                <>
                  <Link to="/admin/products">Sản phẩm Admin</Link>

                  <Link to="/admin/orders">Đơn hàng Admin</Link>
                </>
              )}

              {/* USER */}

              <span className="welcome">👤 {user?.username}</span>

              <button
                type="button"
                className="logout-btn"
                onClick={handleLogout}
              >
                Đăng xuất
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
