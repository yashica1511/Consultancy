const Product = require("../models/Product");
const Invoice = require("../models/Invoice");

// @desc    Get all products created by the user
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({ createdBy: req.user.id });
    res.status(200).json(products);
  } catch (err) {
    console.error("Failed to fetch products", err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Create a new product manually
exports.createProduct = async (req, res) => {
  try {
    const { name, hsnCode, rate, gstRate } = req.body;

    const newProduct = new Product({
      name,
      hsnCode,
      rate,
      gstRate,
      createdBy: req.user.id, // Ensure the user is assigned as the creator
    });

    await newProduct.save();
    res.status(201).json({ message: "Product created", product: newProduct });
  } catch (err) {
    console.error("Failed to create product", err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Extract products from invoices and save to product collection
exports.extractProductsFromInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({ createdBy: req.user.id });

    let addedCount = 0;

    for (const invoice of invoices) {
      if (!invoice.products || !Array.isArray(invoice.products)) continue;

      for (const p of invoice.products) {
        const existing = await Product.findOne({
          name: p.name,
          createdBy: req.user.id,
        });

        if (!existing) {
          const newProduct = new Product({
            name: p.name,
            hsnCode: p.hsnCode || "",
            rate: p.rate || 0,
            gstRate: p.gstRate || 0,
            createdBy: req.user.id,
          });
          await newProduct.save();
          addedCount++;
        }
      }
    }

    res.status(200).json({ message: `${addedCount} products added from invoices.` });
  } catch (err) {
    console.error("Failed to extract products", err);
    res.status(500).json({ message: "Server error" });
  }
};
