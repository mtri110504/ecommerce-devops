import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function ProductDetail() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`http://localhost:5001/api/products/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Không tìm thấy sản phẩm");
        }

        return response.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError("Không thể tải thông tin sản phẩm");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <h2>Đang tải sản phẩm...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  if (!product) {
    return <h2>Không tìm thấy sản phẩm</h2>;
  }

  const addToCart = () => {
  const cart = JSON.parse(
    localStorage.getItem("cart") || "[]"
  );

  const existingItem = cart.find(
    (item) => item.id === product.id
  );

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  alert("Đã thêm sản phẩm vào giỏ hàng!");
};

  return (
    <div className="container">

      <Link to="/">
        ← Quay lại danh sách sản phẩm
      </Link>

      <div className="product-detail">

        <h1>{product.name}</h1>

        <p className="price">
          {Number(product.price).toLocaleString("vi-VN")} ₫
        </p>

        <p>
          Số lượng còn lại: {product.stock}
        </p>

        {product.description && (
          <p>{product.description}</p>
        )}

        <button onClick={addToCart}>
          Thêm vào giỏ hàng
        </button>

      </div>

    </div>
  );
}

export default ProductDetail;