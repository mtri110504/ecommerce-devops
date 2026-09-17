import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        "http://localhost:5001/api/products"
      );

      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (user?.role !== "admin") {
      navigate("/");
      return;
    }

    fetchProducts();
  }, []);

  const addProduct = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5001/api/products",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name,
            price: Number(price),
            stock: Number(stock),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Thêm sản phẩm thất bại");
        return;
      }

      alert("Thêm sản phẩm thành công!");

      setName("");
      setPrice("");
      setStock("");

      fetchProducts();
    } catch (error) {
      console.error(error);
      alert("Không thể kết nối server");
    }
  };

  const deleteProduct = async (id) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc muốn xóa sản phẩm này?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:5001/api/products/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Xóa sản phẩm thất bại");
        return;
      }

      alert("Xóa sản phẩm thành công!");
      fetchProducts();
    } catch (error) {
      console.error(error);
      alert("Không thể kết nối server");
    }
  };
  
  const [editingId, setEditingId] = useState(null);

  const startEdit = (product) => {
  setEditingId(product.id);
  setName(product.name);
  setPrice(product.price);
  setStock(product.stock);

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

const updateProduct = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch(
      `http://localhost:5001/api/products/${editingId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          price: Number(price),
          stock: Number(stock),
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Cập nhật sản phẩm thất bại");
      return;
    }

    alert("Cập nhật sản phẩm thành công!");

    setEditingId(null);
    setName("");
    setPrice("");
    setStock("");

    fetchProducts();
  } catch (error) {
    console.error(error);
    alert("Không thể kết nối server");
  }
};

  return (
    <div className="container">
      <h1>Quản lý sản phẩm</h1>

      <form onSubmit={editingId ? updateProduct : addProduct}>
        <h2>{editingId ? "Sửa sản phẩm" : "Thêm sản phẩm"}</h2>

        <input
          type="text"
          placeholder="Tên sản phẩm"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Giá"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Số lượng"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          required
        />

        <button type="submit">
          {editingId ? "Lưu thay đổi" : "Thêm sản phẩm"}
        </button>
      </form>

      <h2>Danh sách sản phẩm</h2>

      {products.map((product) => (
        <div className="product-card" key={product.id}>
          <h3>{product.name}</h3>

          <p>
            Giá:{" "}
            {Number(product.price).toLocaleString("vi-VN")} ₫
          </p>

          <p>Tồn kho: {product.stock}</p>
          <button onClick={() => startEdit(product)}>
            Sửa
          </button>

          <button onClick={() => deleteProduct(product.id)}>
            Xóa
          </button>
        </div>
      ))}
    </div>
  );
}

export default AdminProducts;