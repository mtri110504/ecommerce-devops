import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function ProductDetail() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // GET PRODUCT
  // =========================

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/products/${id}`,
        );

        if (!response.ok) {
          throw new Error("Không tìm thấy sản phẩm");
        }

        const data = await response.json();

        setProduct(data);
      } catch (error) {
        console.error(error);

        setError("Không thể tải thông tin sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // =========================
  // ADD TO CART
  // =========================

  const addToCart = () => {
    if (!product || product.stock <= 0) {
      return;
    }

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const existingProduct = cart.find((item) => item.id === product.id);

    if (existingProduct) {
      // Không cho thêm quá số lượng tồn kho
      if (existingProduct.quantity >= product.stock) {
        alert("Số lượng trong giỏ đã đạt số lượng tồn kho!");

        return;
      }

      existingProduct.quantity += 1;

      // Cập nhật luôn ảnh nếu cart cũ chưa có ảnh
      existingProduct.image_url = product.image_url || "";
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url || "",
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    // Navbar cập nhật badge
    window.dispatchEvent(new Event("cartUpdated"));

    alert("Đã thêm sản phẩm vào giỏ hàng!");
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <main className="product-detail-page">
        <div className="product-detail-container">
          <h2>Đang tải sản phẩm...</h2>
        </div>
      </main>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (error) {
    return (
      <main className="product-detail-page">
        <div className="product-detail-container">
          <h2>{error}</h2>

          <Link to="/" className="back-link">
            ← Quay lại sản phẩm
          </Link>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="product-detail-page">
        <div className="product-detail-container">
          <h2>Không tìm thấy sản phẩm</h2>
        </div>
      </main>
    );
  }

  // =========================
  // PRODUCT DETAIL
  // =========================

  return (
    <main className="product-detail-page">
      <div className="product-detail-container">
        <Link to="/" className="back-link">
          ← Quay lại sản phẩm
        </Link>

        <div className="product-detail-card">
          {/* PRODUCT IMAGE */}

          <div className="detail-image">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="detail-product-image"
              />
            ) : (
              <div className="detail-image-placeholder">💻</div>
            )}

            {product.stock > 0 ? (
              <span className="detail-stock-badge">✓ Còn hàng</span>
            ) : (
              <span className="detail-stock-badge out">Hết hàng</span>
            )}
          </div>

          {/* PRODUCT INFORMATION */}

          <div className="detail-content">
            <span className="detail-category">CLOUDTECH • CÔNG NGHỆ</span>

            <h1>{product.name}</h1>

            <div className="detail-rating">
              ★★★★★
              <span>Sản phẩm chính hãng</span>
            </div>

            <p className="detail-price">
              {Number(product.price).toLocaleString("vi-VN")} ₫
            </p>

            <div className="detail-divider" />

            <p className="detail-description">
              {product.description ||
                "Sản phẩm công nghệ chính hãng được phân phối bởi CloudTech Store."}
            </p>

            {/* PRODUCT INFO */}

            <div className="detail-info">
              <div>
                <span>Tình trạng</span>

                <strong>{product.stock > 0 ? "Còn hàng" : "Hết hàng"}</strong>
              </div>

              <div>
                <span>Số lượng còn lại</span>

                <strong>{product.stock}</strong>
              </div>

              <div>
                <span>Giao hàng</span>

                <strong>Toàn quốc</strong>
              </div>
            </div>

            {/* ADD CART */}

            <button
              type="button"
              className="add-cart-button"
              onClick={addToCart}
              disabled={product.stock <= 0}
            >
              🛒 {product.stock > 0 ? "Thêm vào giỏ hàng" : "Sản phẩm hết hàng"}
            </button>

            {/* BENEFITS */}

            <div className="purchase-benefits">
              <span>✓ Chính hãng</span>

              <span>✓ Bảo hành</span>

              <span>✓ Giao hàng nhanh</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ProductDetail;
