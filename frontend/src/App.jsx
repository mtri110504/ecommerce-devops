import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5001/api/products")
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error("Lỗi:", error));
  }, []);

  return (
    <div>
      <h1>Ecommerce DevOps</h1>
      <h2>Danh sách sản phẩm</h2>

      {products.map((product) => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>Giá: {Number(product.price).toLocaleString("vi-VN")} VNĐ</p>
        </div>
      ))}
    </div>
  );
}

export default App;