const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/protected", require("./routes/protectedRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/invoices", require("./routes/invoiceRoutes"));
app.use("/api/clients", require("./routes/clientRoutes.js"));
app.use("/api/products", require("./routes/productRoutes.js"));

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err);  // Log the error for debugging
  res.status(500).json({ message: "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
