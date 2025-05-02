import Client from "../models/Client.js";
import Product from "../models/Product.js";
import Invoice from "../models/Invoice.js";

export const createInvoice = async (req, res) => {
  try {
    const {
      clientName,
      clientGSTIN,
      clientAddress,
      clientState,
      clientStateCode,
      products // array of product items with name, hsnCode, rate, gstRate
    } = req.body;

    let client = await Client.findOne({ gstin: clientGSTIN });

    if (!client) {
      client = new Client({
        name: clientName,
        address: clientAddress,
        gstin: clientGSTIN,
        state: clientState,
        stateCode: clientStateCode
      });
      await client.save();
    }

    const invoiceCount = await Invoice.countDocuments({ createdBy: req.user.id });
    const invoiceNumber = `${invoiceCount + 1}`;

    // Save new products to Product collection
    for (const item of products) {
      const existing = await Product.findOne({
        name: item.name,
        hsnCode: item.hsnCode,
        rate: item.rate,
        gstRate: item.gstRate
      });

      if (!existing) {
        const newProduct = new Product({
          name: item.name,
          hsnCode: item.hsnCode,
          rate: item.rate,
          gstRate: item.gstRate
        });
        await newProduct.save();
      }
    }

    const invoiceData = {
      ...req.body,
      invoiceNumber,
      createdBy: req.user.id,
      clientName: client.name,
      clientAddress: client.address,
      clientGSTIN: client.gstin,
      clientState,
      clientStateCode
    };

    const newInvoice = new Invoice(invoiceData);
    await newInvoice.save();

    res.status(201).json({ message: "Invoice created", invoice: newInvoice });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create invoice", error: err.message });
  }
};

export const getInvoiceById = async (req, res) => {
    try {
      console.log("User from token:", req.user);
      const invoice = await Invoice.findOne({
        _id: req.params.id,
        createdBy: req.user._id
      });
  
      if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
      }
  
      res.status(200).json(invoice);
    } catch (err) {
      console.error("Error fetching invoice:", err);
      res.status(500).json({ message: "Server error" });
    }
  };
  

export const updateInvoice = async (req, res) => {
    try {
      console.log("Invoice ID from URL: ", req.params.id);
      console.log("User ID from JWT: ", req.user.id);
  
      const updatedInvoice = await Invoice.findOneAndUpdate(
        { 
          _id: req.params.id,        // Match the invoice by ID
          createdBy: req.user.id      // Ensure the invoice belongs to the logged-in user
        },
        req.body,                     // Fields to update
        { new: true }                 // Return the updated document
      );
  
      if (!updatedInvoice) {
        return res.status(404).json({ message: "Invoice not found or not authorized" });
      }
  
      res.status(200).json({ message: "Invoice updated", invoice: updatedInvoice });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to update invoice", error: err.message });
    }
  };
  
  
