import { useEffect, useState } from "react";
import { FaArrowLeft, FaBars, FaFileAlt, FaSearch } from "react-icons/fa";
import Sidebar from "@/components/Sidebar";

export default function InvoiceHistory() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [search, setSearch] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [priceRange, setPriceRange] = useState("");

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/invoices/all", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        setInvoices(data);
        setFilteredInvoices(data);
      } catch (err) {
        console.error("Error fetching invoices:", err);
      }
    };
    fetchInvoices();
  }, []);

  useEffect(() => {
    let filtered = invoices;

    if (search.trim() !== "") {
      filtered = filtered.filter((inv) =>
        inv.clientName.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (year) {
      filtered = filtered.filter(
        (inv) => new Date(inv.invoiceDate).getFullYear() === parseInt(year)
      );
    }

    if (month) {
      filtered = filtered.filter(
        (inv) => new Date(inv.invoiceDate).getMonth() === parseInt(month) - 1
      );
    }

    if (priceRange) {
      switch (priceRange) {
        case "<5000":
          filtered = filtered.filter((inv) => inv.totalAmountAfterTax < 5000);
          break;
        case "5000-10000":
          filtered = filtered.filter(
            (inv) => inv.totalAmountAfterTax >= 5000 && inv.totalAmountAfterTax <= 10000
          );
          break;
        case "10000-20000":
          filtered = filtered.filter(
            (inv) => inv.totalAmountAfterTax >= 10000 && inv.totalAmountAfterTax <= 20000
          );
          break;
        case "20000-50000":
          filtered = filtered.filter(
            (inv) => inv.totalAmountAfterTax >= 20000 && inv.totalAmountAfterTax <= 50000
          );
          break;
        case "50000-100000":
          filtered = filtered.filter(
            (inv) => inv.totalAmountAfterTax >= 50000 && inv.totalAmountAfterTax <= 100000
          );
          break;
        case ">100000":
          filtered = filtered.filter((inv) => inv.totalAmountAfterTax > 100000);
          break;
        default:
          break;
      }
    }

    setFilteredInvoices(filtered);
  }, [search, year, month, priceRange, invoices]);

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-md transform transition-transform duration-300 ease-in-out 
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:relative md:block`}
      >
        <div className="md:hidden flex justify-end p-4">
          <button onClick={() => setSidebarOpen(false)} className="text-gray-600">
            <FaArrowLeft size={20} />
          </button>
        </div>
        <Sidebar />
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-10 bg-gray-50 min-h-screen">
        <div className="md:hidden mb-4">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-700">
            <FaBars size={24} />
          </button>
        </div>

        <h1 className="text-2xl font-bold mb-6 text-gray-800">Invoice History</h1>

        {/* Filter/Search */}
        <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Search by Client..."
            className="px-4 py-2 border rounded-md w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <FaSearch className="text-gray-500" />
        </div>

        <div className="mb-4 grid grid-cols-2 gap-3">
          {/* Year Filter */}
          <select
            className="px-4 py-2 border rounded-md w-full"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            <option value="">Select Year</option>
            {[...Array(5).keys()].map((i) => {
              const yearOption = new Date().getFullYear() - i;
              return (
                <option key={yearOption} value={yearOption}>
                  {yearOption}
                </option>
              );
            })}
          </select>

          {/* Month Filter */}
          <select
            className="px-4 py-2 border rounded-md w-full"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          >
            <option value="">Select Month</option>
            {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((monthName, index) => (
              <option key={index + 1} value={index + 1}>
                {monthName}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {/* Price Range Filter */}
          <select
            className="px-4 py-2 border rounded-md w-full"
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
          >
            <option value="">Select Price Range</option>
            <option value="<5000">{"< 5000"}</option>
            <option value="5000-10000">{"5000 - 10000"}</option>
            <option value="10000-20000">{"10000 - 20000"}</option>
            <option value="20000-50000">{"20000 - 50000"}</option>
            <option value="50000-100000">{"50000 - 100000"}</option>
            <option value=">100000">{"> 100000"}</option>
          </select>
        </div>

        {/* Invoices Table */}
        <div className="bg-white p-6 rounded-xl shadow-md overflow-x-auto">
          <table className="w-full text-left table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 border-b text-sm text-gray-600">Invoice #</th>
                <th className="p-3 border-b text-sm text-gray-600">Client</th>
                <th className="p-3 border-b text-sm text-gray-600">Date</th>
                <th className="p-3 border-b text-sm text-gray-600">Amount</th>
                <th className="p-3 border-b text-sm text-gray-600">Preview</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((invoice) => (
                  <tr key={invoice._id} className="hover:bg-gray-50">
                    <td className="p-3 border-b text-sm">{invoice.invoiceNumber}</td>
                    <td className="p-3 border-b text-sm">{invoice.clientName}</td>
                    <td className="p-3 border-b text-sm">
                      {invoice.invoiceDate
                        ? new Date(invoice.invoiceDate).toLocaleDateString("en-IN")
                        : "-"}
                    </td>
                    <td className="p-3 border-b text-sm">
                      ₹{" "}
                      {invoice.totalAmountAfterTax
                        ? invoice.totalAmountAfterTax.toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                          })
                        : "0.00"}
                    </td>
                    <td className="p-3 border-b text-sm">
                      <button
                        onClick={() => {
                          // Navigate or show modal here
                          window.location.href = `/invoice-preview/${invoice._id}`;
                        }}
                        className="text-blue-600 hover:underline flex items-center gap-2"
                      >
                        <FaFileAlt /> View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-gray-400 p-6">
                    No invoices found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
