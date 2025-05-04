import Invoice from "../models/Invoice.js";

export const createInvoice = async (req, res) => {
  try {
    console.log("User ID from JWT:", req.user); // Check if user is attached correctly

    if (!req.user || !req.user._id) { // Fix: use _id instead of id
      return res.status(400).json({ message: "User ID is missing or invalid." });
    }

    const invoiceCount = await Invoice.countDocuments({ createdBy: req.user._id });
    const invoiceNumber = `AARA-INV-${new Date().getFullYear()}-${String(invoiceCount + 1).padStart(3, '0')}`;

    const invoiceData = {
      ...req.body,
      invoiceNumber,
      createdBy: req.user._id,  // Use _id for createdBy
    };

    const newInvoice = new Invoice(invoiceData);
    await newInvoice.save();

    res.status(201).json({ message: "Invoice created", invoice: newInvoice });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create invoice", error: err.message });
  }
};

export const getAllInvoices = async (req, res) => {
  try {
    // Ensure that the user is properly authenticated and the user ID is accessible
    console.log("Fetching invoices for user ID:", req.user._id);

    // Query the database for invoices created by the authenticated user
    const invoices = await Invoice.find({ createdBy: req.user._id }).sort({ createdAt: -1 });

    // If no invoices are found, return a 404 response
    if (!invoices.length) {
      return res.status(404).json({ message: "No invoices found." });
    }

    // Return the invoices in the response
    res.status(200).json(invoices);
  } catch (err) {
    console.error("Error fetching all invoices:", err); // Log the error for debugging
    res.status(500).json({ message: "Failed to fetch invoices", error: err.message });
  }
};


export const getLatestInvoice = async (req, res) => {
  try {
    const latestInvoice = await Invoice.findOne()
      .sort({ createdAt: -1 });
      

    if (!latestInvoice) {
      return res.status(404).json({ message: "No invoices found." });
    }

    res.json(latestInvoice);
  } catch (error) {
    console.error("Error fetching latest invoice:", error);
    res.status(500).json({ message: "Server error." });
  }
};

export const getInvoiceById = async (req, res) => {
  try {
    const invoiceId = req.params.id;

    if (invoiceId === "all") {
      return getAllInvoices(req, res); // Fetch all invoices
    }

    if (invoiceId === "latest") {
      // Handle the "latest" case separately without querying by _id
      return getLatestInvoice(req, res); // Fetch the latest invoice
    }

    // For other cases, find invoice by ID
    const invoice = await Invoice.findOne({
      _id: invoiceId,
      createdBy: req.user._id  // Ensure that the invoice belongs to the logged-in user
    });

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.status(200).json(invoice);
  } catch (err) {
    console.error(err);
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
