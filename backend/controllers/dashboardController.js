const mongoose = require("mongoose");
const Invoice = require("../models/Invoice");
const ObjectId = mongoose.Types.ObjectId;

exports.getDashboardStats = async (req, res) => {
  try {
    const userId = new ObjectId(req.user._id);

    // Get total invoices, total revenue, unique clients, and recent invoices
    const [totalInvoices, totalRevenue, uniqueClients, recentInvoices] = await Promise.all([
      Invoice.countDocuments({ createdBy: userId }),
      Invoice.aggregate([
        { $match: { createdBy: userId } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),      
      Invoice.distinct("clientName", { createdBy: userId }),
      Invoice.find({ createdBy: userId }).sort({ createdAt: -1 }).limit(5),
    ]);

    // Send the calculated data as JSON
    res.json({
      totalInvoices,
      totalRevenue: totalRevenue[0]?.total || 0, // Use total value if available, else 0
      totalClients: uniqueClients.length,
      recentInvoices,
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ message: "Failed to load dashboard data", error: err.message });
  }
};
