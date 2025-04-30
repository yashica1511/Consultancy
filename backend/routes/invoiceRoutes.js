const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Invoice = require("../models/Invoice");

router.post("/", auth, async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();

    // Find the latest invoice number for this year and user, sorted by createdAt
    const lastInvoice = await Invoice.findOne({
      createdBy: req.user._id,
      invoiceNumber: { $regex: `^AARA-INV-${currentYear}-` }
    }).sort({ createdAt: -1 });

    let nextNumber = 1; // Default to 1 if no invoices exist for the current year

    if (lastInvoice) {
      // Extract the last number from the invoice number
      const parts = lastInvoice.invoiceNumber.split("-");
      const lastNumber = parseInt(parts[3], 10); // Get the last invoice number (after the last dash)
      nextNumber = lastNumber + 1; // Increment the number
    }

    // Format the next invoice number
    const invoiceNumber = `AARA-INV-${currentYear}-${String(nextNumber).padStart(3, "0")}`;

    const invoiceData = {
      ...req.body,
      invoiceNumber, // Use the newly generated invoice number
      createdBy: req.user._id
    };

    // Create and save the new invoice
    const newInvoice = new Invoice(invoiceData);
    await newInvoice.save();

    res.status(201).json({ message: "Invoice created", invoice: newInvoice });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create invoice", error: err.message });
  }
});

module.exports = router;
