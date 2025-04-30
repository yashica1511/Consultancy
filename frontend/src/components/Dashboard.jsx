import { useEffect, useState } from "react";
import {
  FaFileInvoiceDollar,
  FaUsers,
  FaMoneyBillWave,
  FaClock,
  FaBars,
  FaArrowLeft,
} from "react-icons/fa";
import { Card, CardContent } from "@/components/ui/card";
import Sidebar from "@/components/Sidebar";

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
          ...data,
          totalRevenue: Number(data.totalRevenue || 0), 
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
    return <div>Loading...</div>;
  }

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-md transform transition-transform duration-300 ease-in-out 
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:relative md:block`}
      >
        {/* Mobile view Back button */}
        <div className="md:hidden flex justify-end p-4">
          <button onClick={() => setSidebarOpen(false)} className="text-gray-600">
            <FaArrowLeft size={20} />
          </button>
        </div>
        <Sidebar />
      </div>

      {/* Sidebar Overlay (mobile only) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-10 bg-gray-50 min-h-screen">
        {/* Mobile Menu Button */}
        <div className="md:hidden mb-4">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-700">
            <FaBars size={24} />
          </button>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Card className="shadow-md">
            <CardContent className="flex flex-col items-start gap-2 p-5">
              <FaFileInvoiceDollar className="text-3xl text-blue-600" />
              <p className="text-sm text-gray-500">Total Invoices</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalInvoices}</p>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardContent className="flex flex-col items-start gap-2 p-5">
              <FaMoneyBillWave className="text-3xl text-green-600" />
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-800">
                ₹ {stats.totalRevenue ? stats.totalRevenue.toLocaleString("en-IN", { minimumFractionDigits: 2 }) : "0.00"}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardContent className="flex flex-col items-start gap-2 p-5">
              <FaUsers className="text-3xl text-purple-600" />
              <p className="text-sm text-gray-500">Total Clients</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalClients}</p>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardContent className="flex flex-col items-start gap-2 p-5">
              <FaClock className="text-3xl text-orange-500" />
              <p className="text-sm text-gray-500">Recent Invoices</p>
              <p className="text-2xl font-bold text-gray-800">{stats.recentInvoices.length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Invoices Table */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Invoices</h2>
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse text-left">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 border-b text-sm text-gray-600">Invoice #</th>
                  <th className="p-3 border-b text-sm text-gray-600">Client</th>
                  <th className="p-3 border-b text-sm text-gray-600">Date</th>
                  <th className="p-3 border-b text-sm text-gray-600">Amount</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentInvoices.length > 0 ? (
                  stats.recentInvoices.map((invoice) => (
                    <tr key={invoice._id} className="hover:bg-gray-50">
                      <td className="p-3 border-b text-sm">{invoice.invoiceNumber}</td>
                      <td className="p-3 border-b text-sm">{invoice.clientName}</td>
                      <td className="p-3 border-b text-sm">
                        {invoice.invoiceDate ? new Date(invoice.invoiceDate).toLocaleDateString("en-IN") : "-"}
                      </td>
                      <td className="p-3 border-b text-sm">
                        ₹ {invoice.totalAmountAfterTax ? invoice.totalAmountAfterTax.toLocaleString("en-IN", { minimumFractionDigits: 2 }) : "0.00"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-4 text-center text-gray-400">
                      No recent invoices.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
