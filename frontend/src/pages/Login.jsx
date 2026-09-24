import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Đăng nhập thất bại");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/");
    } catch (error) {
      console.error(error);
      setMessage("Không thể kết nối đến server");
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-wrapper">
        <section className="auth-banner">
          <div className="auth-banner-content">
            <span className="auth-brand">☁ CLOUDTECH STORE</span>

            <h1>
              Chào mừng
              <br />
              bạn trở lại.
            </h1>

            <p>
              Đăng nhập để mua sắm, theo dõi đơn hàng và trải nghiệm các sản
              phẩm công nghệ tại CloudTech Store -demo.
            </p>

            <div className="auth-features">
              <span>✓ Mua sắm nhanh chóng</span>
              <span>✓ Theo dõi đơn hàng</span>
              <span>✓ Sản phẩm công nghệ chính hãng</span>
            </div>
          </div>
        </section>

        <section className="auth-form-section">
          <div className="auth-form-container">
            <span className="auth-label">ĐĂNG NHẬP</span>

            <h2>Đăng nhập tài khoản</h2>

            <p className="auth-subtitle">Nhập thông tin tài khoản của bạn</p>

            <form className="auth-form" onSubmit={handleSubmit}>
              <label>Email</label>

              <input
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <label>Mật khẩu</label>

              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              {message && <div className="auth-message">{message}</div>}

              <button className="auth-submit" type="submit">
                Đăng nhập →
              </button>
            </form>

            <p className="auth-switch">
              Chưa có tài khoản? <a href="/register">Đăng ký ngay</a>
            </p>

            <div className="auth-security">
              🔒 Thông tin đăng nhập được bảo mật
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Login;
