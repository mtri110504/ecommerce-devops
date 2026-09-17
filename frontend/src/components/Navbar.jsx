import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        CloudTech Store
      </Link>

      <div className="nav-links">
        <Link to="/">Sản phẩm</Link>
        <Link to="/cart">Giỏ hàng</Link>

        {!token ? (
          <>
            <Link to="/login">Đăng nhập</Link>
            <Link to="/register">Đăng ký</Link>
          </>
        ) : (
          <>
            <Link to="/my-orders">Đơn hàng của tôi</Link>

            {user?.role === "admin" && (
              <>
                <Link to="/admin/products">
                  Quản lý sản phẩm
                </Link>
                <Link to="/admin/orders">
                  Quản lý đơn hàng
                </Link>
              </>
            )}
            <span>Xin chào, {user?.username}</span>

            <button onClick={handleLogout}>
              Đăng xuất
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;