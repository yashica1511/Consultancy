import React, { useEffect, useState } from "react";
import { FaBars, FaArrowLeft } from "react-icons/fa";
import Sidebar from "@/components/Sidebar";

export default function Products() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", hsnCode: "", rate: "", gstRate: "" });

  const fetchProducts = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5000/api/products", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProducts(data); // Ensure data is an array
      } else {
        console.error("Failed to fetch products:", res.statusText);
        setProducts([]); // Set to empty array if error occurs
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setProducts([]); // Set to empty array if fetch fails
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });
      setForm({ name: "", hsnCode: "", rate: "", gstRate: "" });
      fetchProducts(); // Refresh the products after submission
    } catch (err) {
      console.error("Failed to submit product:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-md transform transition-transform duration-300 ease-in-out 
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:relative md:block`}
      >
        {/* Mobile Back button */}
        <div className="md:hidden flex justify-end p-4">
          <button onClick={() => setSidebarOpen(false)} className="text-gray-600">
            <FaArrowLeft size={20} />
          </button>
        </div>
        <Sidebar />
      </div>

      {/* Overlay (Mobile Only) */}
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

        <h1 className="text-2xl font-bold mb-4">Products</h1>

        <form onSubmit={handleSubmit} className="mb-6 grid grid-cols-2 gap-4">
          <input type="text" placeholder="Product Name" value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })} className="border p-2 rounded" required />
          <input type="text" placeholder="HSN Code" value={form.hsnCode}
            onChange={e => setForm({ ...form, hsnCode: e.target.value })} className="border p-2 rounded" />
          <input type="number" placeholder="Rate" value={form.rate}
            onChange={e => setForm({ ...form, rate: e.target.value })} className="border p-2 rounded" required />
          <input type="number" placeholder="GST Rate (%)" value={form.gstRate}
            onChange={e => setForm({ ...form, gstRate: e.target.value })} className="border p-2 rounded" required />
          <button type="submit" className="col-span-2 bg-blue-600 text-white px-4 py-2 rounded">Add Product</button>
        </form>

        <table className="w-full text-left border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Name</th>
              <th>HSN</th>
              <th>Rate</th>
              <th>GST</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(products) && products.length > 0 ? (
              products.map(prod => (
                <tr key={prod._id} className="border-t">
                  <td className="p-2">{prod.name}</td>
                  <td>{prod.hsnCode}</td>
                  <td>₹{prod.rate}</td>
                  <td>{prod.gstRate}%</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-2 text-center">No products available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
