import { useEffect, useState } from "react";
import {
  FaFileInvoiceDollar,
  FaUsers,
  FaMoneyBillWave,
  FaClock,
  FaBars,
  FaArrowLeft,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import Sidebar from "@/components/Sidebar";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    totalInvoices: 0,
    totalRevenue: 0,
    totalClients: 0,
    recentInvoices: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/dashboard", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        setStats({
          totalInvoices: data.totalInvoices || 0,
          totalRevenue: Number(data.totalRevenue || 0),
          totalClients: data.totalClients || 0,
          recentInvoices: data.recentInvoices || [],
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-pulse text-center space-y-2">
          <div className="w-20 h-20 bg-blue-500 rounded-full mx-auto"></div>
          <p className="text-gray-600">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  const chartData = stats.recentInvoices.map((inv) => ({
    name: inv.invoiceNumber,
    amount: inv.totalAmountAfterTax,
  }));

  return (
    <div className="flex bg-blue-50 min-h-screen">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-blue-800 to-blue-900 text-white transform transition-transform duration-300 ease-in-out 
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 md:relative md:block`}
      >
        <div className="md:hidden flex justify-end p-4">
          <button onClick={() => setSidebarOpen(false)} className="hover:text-blue-200">
            <FaArrowLeft size={20} />
          </button>
        </div>
        <Sidebar />
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {/* Top Nav */}
        <header className="bg-white shadow-md py-4 px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden mr-4 text-gray-600">
              <FaBars size={20} />
            </button>
            <h1 className="text-xl font-bold text-blue-800">Dashboard</h1>
          </div>
        </header>

        {/* Dashboard */}
        <main className="p-4 md:p-6 space-y-6">
          {/* Stat Cards */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.2 } }}
          >
            {/* Cards */}
            {[
              {
                icon: <FaFileInvoiceDollar className="text-blue-600 text-xl" />,
                title: "Total Invoices",
                value: stats.totalInvoices,
              },
              {
                icon: <FaMoneyBillWave className="text-green-600 text-xl" />,
                title: "Total Revenue",
                value: `₹${stats.totalRevenue.toLocaleString("en-IN")}`,
              },
              {
                icon: <FaUsers className="text-purple-600 text-xl" />,
                title: "Total Clients",
                value: stats.totalClients,
              },
              {
                icon: <FaClock className="text-orange-500 text-xl" />,
                title: "Recent Invoices",
                value: stats.recentInvoices.length,
              },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.03 }}
                className="rounded-xl bg-white p-4 shadow-md border"
              >
                <div className="flex items-center space-x-3">
                  {stat.icon}
                  <div>
                    <p className="text-sm text-gray-500">{stat.title}</p>
                    <p className="text-xl font-semibold">{stat.value}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Chart */}
          {chartData.length > 0 && (
            <Card className="shadow-sm">
              <CardContent>
                <h2 className="text-lg font-bold mb-4 text-gray-700">Revenue Trend</h2>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="amount"
                      stroke="#3b82f6"
                      fillOpacity={1}
                      fill="url(#colorAmt)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Recent Invoices Table */}
          {stats.recentInvoices.length > 0 && (
            <Card className="shadow-sm">
              <CardContent className="p-0">
                <div className="p-4 border-b">
                  <h2 className="text-lg font-bold text-gray-700">Recent Invoices</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100 text-gray-600">
                      <tr>
                        <th className="p-3 text-left">Invoice #</th>
                        <th className="p-3 text-left">Client</th>
                        <th className="p-3 text-left">Date</th>
                        <th className="p-3 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {stats.recentInvoices.map((invoice) => (
                        <tr key={invoice._id} className="hover:bg-gray-50">
                          <td className="p-3 font-medium text-blue-600">{invoice.invoiceNumber}</td>
                          <td className="p-3">{invoice.clientName}</td>
                          <td className="p-3 text-gray-500">
                            {new Date(invoice.invoiceDate).toLocaleDateString("en-IN")}
                          </td>
                          <td className="p-3 text-right font-semibold">
                            ₹{invoice.totalAmountAfterTax?.toLocaleString("en-IN", {
                              minimumFractionDigits: 2,
                            }) || "0.00"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}
