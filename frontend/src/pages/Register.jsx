import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch(
        "http://localhost:5001/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Đăng ký thất bại");
        return;
      }

      alert("Đăng ký thành công!");
      navigate("/login");
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
          <span className="auth-brand">
            ☁ CLOUDTECH STORE
          </span>

          <h1>
            Tham gia
            <br />
            CloudTech.
          </h1>

          <p>
            Tạo tài khoản để bắt đầu mua sắm
            các sản phẩm công nghệ và quản lý
            đơn hàng của bạn.
          </p>

          <div className="auth-features">
            <span>✓ Đăng ký hoàn toàn miễn phí</span>
            <span>✓ Quản lý đơn hàng dễ dàng</span>
            <span>✓ Trải nghiệm mua sắm hiện đại</span>
          </div>
        </div>
      </section>

      <section className="auth-form-section">
        <div className="auth-form-container">

          <span className="auth-label">
            TẠO TÀI KHOẢN
          </span>

          <h2>Đăng ký</h2>

          <p className="auth-subtitle">
            Chỉ mất vài giây để bắt đầu
          </p>

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >
            <label>Tên người dùng</label>

            <input
              type="text"
              placeholder="Nguyễn Văn A"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
              required
            />

            <label>Email</label>

            <input
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />

            <label>Mật khẩu</label>

            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />

            {message && (
              <div className="auth-message">
                {message}
              </div>
            )}

            <button
              className="auth-submit"
              type="submit"
            >
              Tạo tài khoản →
            </button>
          </form>

          <p className="auth-switch">
            Đã có tài khoản?{" "}
            <a href="/login">
              Đăng nhập
            </a>
          </p>

          <div className="auth-security">
            🔒 Mật khẩu được mã hóa và bảo vệ
          </div>

        </div>
      </section>

    </div>
  </main>
);
}

export default Register;