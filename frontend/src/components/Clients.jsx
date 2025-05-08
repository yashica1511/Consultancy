import React, { useEffect, useState } from "react";
import { FaBars, FaArrowLeft, FaPlus, FaSearch } from "react-icons/fa";
import Sidebar from "@/components/Sidebar";

export default function Clients() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState({
    name: "",
    address: "",
    gstin: "",
    state: "",
    stateCode: ""
  });
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Fetch clients from backend
  const fetchClients = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/clients", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setClients(data);
      } else {
        console.error("Failed to fetch clients");
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const existingClient = clients.find(client => client.gstin === form.gstin);
    if (existingClient) {
      setError("A client with this GSTIN already exists.");
      return;
    }

    const requestBody = {
      clientName: form.name,
      clientAddress: form.address,
      clientGSTIN: form.gstin,
      clientState: form.state,
      clientStateCode: form.stateCode
    };

    try {
      const res = await fetch("http://localhost:5000/api/clients/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      });

      if (res.ok) {
        setForm({ name: "", address: "", gstin: "", state: "", stateCode: "" });
        setError("");
        setIsFormOpen(false);
        fetchClients();
      } else {
        const errorText = await res.text();
        setError(errorText || "Failed to add client");
      }
    } catch (err) {
      console.error("Submission error:", err);
      setError("An error occurred while submitting the form");
    }
  };

  // Filter clients based on search term
  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.gstin.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchClients();
  }, []);

  return (
    <div className="flex bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-blue-800 to-blue-900 shadow-xl transform transition-transform duration-300 ease-in-out 
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:relative md:block`}
      >
        <div className="md:hidden flex justify-end p-4">
          <button 
            onClick={() => setSidebarOpen(false)} 
            className="text-white hover:text-blue-200 transition-colors"
          >
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

      {/* Main content */}
      <div className="flex-1 min-h-screen overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm py-4 px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center">
            <button 
              onClick={() => setSidebarOpen(true)} 
              className="md:hidden mr-4 text-gray-600 hover:text-blue-600"
            >
              <FaBars size={20} />
            </button>
            <h1 className="text-xl font-bold text-gray-800">Client Management</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-64"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
            
            <button 
              onClick={() => setIsFormOpen(true)}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <FaPlus />
              <span className="hidden md:inline">Add Client</span>
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-4 md:p-6">
          {/* Add Client Form Modal */}
          {isFormOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Add New Client</h2>
                    <button 
                      onClick={() => {
                        setIsFormOpen(false);
                        setError("");
                      }}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      &times;
                    </button>
                  </div>
                  
                  {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <input
                        type="text"
                        value={form.address}
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">GSTIN</label>
                      <input
                        type="text"
                        value={form.gstin}
                        onChange={(e) => setForm({ ...form, gstin: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                        <input
                          type="text"
                          value={form.state}
                          onChange={(e) => setForm({ ...form, state: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">State Code</label>
                        <input
                          type="text"
                          value={form.stateCode}
                          onChange={(e) => setForm({ ...form, stateCode: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setIsFormOpen(false);
                          setError("");
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Save Client
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Clients Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="text-left text-gray-600 text-sm">
                    <th className="p-4 font-medium">Client Name</th>
                    <th className="p-4 font-medium">GSTIN</th>
                    <th className="p-4 font-medium">State</th>
                    <th className="p-4 font-medium hidden md:table-cell">Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredClients.length > 0 ? (
                    filteredClients.map((client) => (
                      <tr key={client._id} className="hover:bg-gray-50">
                        <td className="p-4 font-medium text-gray-800">
                          {client.name}
                        </td>
                        <td className="p-4 text-gray-700">
                          {client.gstin}
                        </td>
                        <td className="p-4 text-gray-700">
                          {client.state} ({client.stateCode})
                        </td>
                        <td className="p-4 text-gray-500 hidden md:table-cell">
                          {client.address}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="p-8 text-center text-gray-400">
                        {searchTerm ? "No matching clients found" : "No clients available"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}