const express = require("express");
const cors = require("cors");
require("dotenv").config();

const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const app = express();
const orderRoutes = require("./routes/orderRoutes");

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.get("/", (req, res) => {
  res.send("Ecommerce Backend API is running");
});

app.use("/api/products", productRoutes);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});