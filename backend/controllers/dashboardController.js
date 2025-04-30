const mongoose = require("mongoose");
const Invoice = require("../models/Invoice");

exports.getDashboardStats = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);

    const [totalInvoices, totalRevenueAgg, uniqueClients, recentInvoices] = await Promise.all([
      Invoice.countDocuments({ createdBy: userId }),
      Invoice.aggregate([
        { $match: { createdBy: userId } },
        { 
          $project: {
            totalAmountAfterTax: { $toDouble: "$totalAmountAfterTax" }
          }
        },
        { 
          $group: {
            _id: null,
            totalRevenue: { $sum: "$totalAmountAfterTax" }
          }
        }
      ]),
      Invoice.distinct("clientName", { createdBy: userId }),
      Invoice.find({ createdBy: userId }).sort({ createdAt: -1 }).limit(5),
    ]);
    
    console.log("totalRevenueAgg:", totalRevenueAgg); // Check the aggregation result
    console.log("totalInvoices:", totalInvoices); // Check the count of invoices
    console.log("uniqueClients:", uniqueClients); // Check unique clients
    console.log("recentInvoices:", recentInvoices); // Check recent invoices
    

    const totalRevenue = totalRevenueAgg.length > 0 ? totalRevenueAgg[0].totalRevenue : 0;

    res.json({
      totalInvoices,
      totalRevenue,
      totalClients: uniqueClients.length,
      recentInvoices,
    });

  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ message: "Failed to load dashboard data", error: err.message });
  }
};
