import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5001/api/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Không thể lấy danh sách sản phẩm");
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

  if (loading) {
    return <h2>Đang tải sản phẩm...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  return (
    <div className="container">
      <h1>CloudTech Store</h1>

      <p className="subtitle">
        Cửa hàng công nghệ
      </p>

      <div className="product-grid">
        {products.map((product) => (
          <div className="product-card" key={product.id}>
            <h2>{product.name}</h2>

            <p className="price">
              {Number(product.price).toLocaleString("vi-VN")} ₫
            </p>

            <p>
              Còn lại: {product.stock}
            </p>

            <Link to={`/products/${product.id}`}>
              Xem chi tiết
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;