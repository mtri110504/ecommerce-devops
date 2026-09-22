import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Không thể lấy sản phẩm");
        }

        return response.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError("Không thể kết nối đến Backend");
        setLoading(false);
      });
  }, []);

  return (
    <>
      <section className="hero">
        <div className="hero-content">

          <div className="hero-text">
            <span className="hero-label">
              CLOUDTECH STORE
            </span>

            <h1>
              Công nghệ cho
              <span> cuộc sống hiện đại.</span>
            </h1>

            <p>
              Khám phá laptop, smartphone và phụ kiện
              công nghệ với mức giá hấp dẫn.
            </p>

            <a href="#products" className="hero-button">
              Khám phá sản phẩm →
            </a>
          </div>

          <div className="hero-visual">
            <div className="tech-circle">
              <span>💻</span>
              <span>📱</span>
              <span>🎧</span>
            </div>
          </div>

        </div>
      </section>

      <section className="features">

        <div className="feature">
          <span>🚚</span>
          <div>
            <strong>Giao hàng nhanh</strong>
            <p>Giao hàng toàn quốc</p>
          </div>
        </div>

        <div className="feature">
          <span>🛡️</span>
          <div>
            <strong>Sản phẩm chính hãng</strong>
            <p>Cam kết chất lượng</p>
          </div>
        </div>

        <div className="feature">
          <span>☁️</span>
          <div>
            <strong>CloudTech</strong>
            <p>Công nghệ hiện đại</p>
          </div>
        </div>

      </section>

      <main
        className="products-section"
        id="products"
      >
        <div className="section-heading">
          <span>SẢN PHẨM</span>
          <h2>Sản phẩm nổi bật</h2>
          <p>
            Những sản phẩm công nghệ dành cho bạn
          </p>
        </div>

        {loading && (
          <p className="status-message">
            Đang tải sản phẩm...
          </p>
        )}

        {error && (
          <p className="status-message">
            {error}
          </p>
        )}

        {!loading && !error && (
          <div className="product-grid">

            {products.map((product) => (
              <article
                className="product-card"
                key={product.id}
              >
                <div className="product-image">
                {product.image_url ? (
                    <img
                    src={product.image_url}
                    alt={product.name}
                    onError={(e) => {
                        console.error(
                        "Không tải được ảnh:",
                        product.image_url
                        );

                        e.currentTarget.style.display = "none";
                    }}
                    />
                ) : (
                    <span className="product-placeholder">
                    💻
                    </span>
                )}

                {product.stock > 0 ? (
                    <span className="stock-badge">
                    Còn hàng
                    </span>
                ) : (
                    <span className="stock-badge out">
                    Hết hàng
                    </span>
                )}
                </div>

                <div className="product-info">
                  <span className="product-category">
                    CÔNG NGHỆ
                  </span>

                  <h3>{product.name}</h3>

                  <p className="product-stock">
                    Còn {product.stock} sản phẩm
                  </p>

                  <div className="product-bottom">
                    <span className="price">
                      {Number(product.price)
                        .toLocaleString("vi-VN")}{" "}
                      ₫
                    </span>

                    <Link
                      to={`/products/${product.id}`}
                    >
                      Chi tiết →
                    </Link>
                  </div>
                </div>
              </article>
            ))}

          </div>
        )}
      </main>

      <footer className="footer">
        <strong>☁ CloudTech Store</strong>

        <p>
          Đồ án hệ thống bán hàng trực tuyến tích hợp
          CI/CD và công nghệ container trên AWS.
        </p>

        <span>© 2026 CloudTech Store</span>
      </footer>
    </>
  );
}

export default ProductList;