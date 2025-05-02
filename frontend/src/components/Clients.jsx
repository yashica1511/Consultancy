import React, { useEffect, useState } from "react";
import { FaBars, FaArrowLeft } from "react-icons/fa";
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

  // Fetch clients from backend
  const fetchClients = async () => {
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
        fetchClients();
      } else {
        const errorText = await res.text();
        console.error("Submission error:", errorText);
        setError("Failed to add client");
      }
    } catch (err) {
      console.error("Submission error:", err);
      setError("An error occurred while submitting the form");
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-md transform transition-transform duration-300 ease-in-out 
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:relative md:block`}
      >
        {/* Mobile back button */}
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

      {/* Main content */}
      <div className="flex-1 p-6 md:p-10 bg-gray-50 min-h-screen">
        <div className="md:hidden mb-4">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-700">
            <FaBars size={24} />
          </button>
        </div>

        <h1 className="text-2xl font-bold mb-4">Clients</h1>

        {/* Error message */}
        {error && <div className="text-red-600 mb-4">{error}</div>}

        {/* Add client form */}
        <form onSubmit={handleSubmit} className="mb-6 grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Client Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="GSTIN"
            value={form.gstin}
            onChange={(e) => setForm({ ...form, gstin: e.target.value })}
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="State"
            value={form.state}
            onChange={(e) => setForm({ ...form, state: e.target.value })}
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="State Code"
            value={form.stateCode}
            onChange={(e) => setForm({ ...form, stateCode: e.target.value })}
            className="border p-2 rounded"
            required
          />
          <button type="submit" className="col-span-2 bg-blue-600 text-white px-4 py-2 rounded">
            Add Client
          </button>
        </form>

        {/* Client list */}
        <table className="w-full text-left border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Name</th>
              <th>Address</th>
              <th>GSTIN</th>
              <th>State</th>
              <th>State Code</th>
            </tr>
          </thead>
          <tbody>
            {clients.length > 0 ? (
              clients.map((client) => (
                <tr key={client._id} className="border-t">
                  <td className="p-2">{client.name}</td>
                  <td>{client.address}</td>
                  <td>{client.gstin}</td>
                  <td>{client.state}</td>
                  <td>{client.stateCode}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-4 text-center">No clients found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
