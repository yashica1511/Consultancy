const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Invoice = require("../models/Invoice");

router.post("/", auth, async (req, res) => {
  try {
    const { invoiceNumber, clientName, date, amount } = req.body;

    const newInvoice = new Invoice({
      invoiceNumber,
      clientName,
      date,
      amount,
      createdBy: req.user._id
    });

    await newInvoice.save();
    res.status(201).json({ message: "Invoice created", invoice: newInvoice });
  } catch (err) {
    res.status(500).json({ message: "Failed to create invoice", error: err.message });
  }
});

module.exports = router;
