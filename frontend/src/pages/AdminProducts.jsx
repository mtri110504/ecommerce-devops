import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [editingId, setEditingId] = useState(null);

  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  // =========================
  // LẤY DANH SÁCH SẢN PHẨM
  // =========================

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        "/api/products"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Không thể lấy sản phẩm"
        );
      }

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

  // =========================
  // RESET FORM
  // =========================

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setPrice("");
    setStock("");
    setImageUrl("");
  };

  // =========================
  // THÊM SẢN PHẨM
  // =========================

  const addProduct = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "/api/products",
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

            // Backend + MySQL dùng image_url
            image_url: imageUrl,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message || "Thêm sản phẩm thất bại"
        );
        return;
      }

      alert("Thêm sản phẩm thành công!");

      resetForm();
      fetchProducts();
    } catch (error) {
      console.error(error);
      alert("Không thể kết nối server");
    }
  };

  // =========================
  // BẮT ĐẦU SỬA
  // =========================

  const startEdit = (product) => {
    setEditingId(product.id);

    setName(product.name);
    setPrice(product.price);
    setStock(product.stock);

    // Lấy URL ảnh hiện tại
    setImageUrl(product.image_url || "");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // CẬP NHẬT SẢN PHẨM
  // =========================

  const updateProduct = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `/api/products/${editingId}`,
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

            // Quan trọng
            image_url: imageUrl,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Cập nhật sản phẩm thất bại"
        );
        return;
      }

      alert("Cập nhật sản phẩm thành công!");

      resetForm();
      fetchProducts();
    } catch (error) {
      console.error(error);
      alert("Không thể kết nối server");
    }
  };

  // =========================
  // XÓA SẢN PHẨM
  // =========================

  const deleteProduct = async (id) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc muốn xóa sản phẩm này?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `/api/products/${id}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message || "Xóa sản phẩm thất bại"
        );
        return;
      }

      alert("Xóa sản phẩm thành công!");

      fetchProducts();
    } catch (error) {
      console.error(error);
      alert("Không thể kết nối server");
    }
  };

  // =========================
  // GIAO DIỆN
  // =========================

  return (
    <div className="container">
      <h1>Quản lý sản phẩm</h1>

      <form
        onSubmit={
          editingId ? updateProduct : addProduct
        }
      >
        <h2>
          {editingId
            ? "Sửa sản phẩm"
            : "Thêm sản phẩm"}
        </h2>

        <input
          type="text"
          placeholder="Tên sản phẩm"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          required
        />

        <input
          type="number"
          placeholder="Giá"
          value={price}
          onChange={(e) =>
            setPrice(e.target.value)
          }
          required
        />

        <input
          type="number"
          placeholder="Số lượng"
          value={stock}
          onChange={(e) =>
            setStock(e.target.value)
          }
          required
        />

        <input
          type="url"
          placeholder="URL hình ảnh sản phẩm"
          value={imageUrl}
          onChange={(e) =>
            setImageUrl(e.target.value)
          }
        />

        {/* Preview ảnh */}
        {imageUrl && (
          <div className="admin-image-preview">
            <img
              src={imageUrl}
              alt="Preview sản phẩm"
            />
          </div>
        )}

        <button type="submit">
          {editingId
            ? "Lưu thay đổi"
            : "Thêm sản phẩm"}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={resetForm}
          >
            Hủy sửa
          </button>
        )}
      </form>

      <h2>Danh sách sản phẩm</h2>

      <div className="product-grid">
        {products.map((product) => (
          <div
            className="product-card"
            key={product.id}
          >
            <div className="product-image">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                />
              ) : (
                <span className="product-placeholder">
                  💻
                </span>
              )}
            </div>

            <div className="product-info">
              <h3>{product.name}</h3>

              <p className="price">
                {Number(
                  product.price
                ).toLocaleString("vi-VN")}{" "}
                ₫
              </p>

              <p>
                Tồn kho: {product.stock}
              </p>

              <button
                onClick={() =>
                  startEdit(product)
                }
              >
                Sửa
              </button>

              <button
                onClick={() =>
                  deleteProduct(product.id)
                }
              >
                Xóa
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminProducts;