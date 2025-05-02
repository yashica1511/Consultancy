const express = require("express");
const router = express.Router();
const {
  getProducts,
  createProduct,
  extractProductsFromInvoices
} = require("../controllers/productController");
const authMiddleware = require("../middleware/auth");

// All routes are protected
router.use(authMiddleware);

// GET all products
router.get("/", getProducts);

// POST create product manually
router.post("/", createProduct);

// POST extract product details from invoice
router.post("/extract-from-invoices", extractProductsFromInvoices);

module.exports = router;
