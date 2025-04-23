// src/components/Sidebar.jsx
import { NavLink } from "react-router-dom";
import { FaHome, FaFileInvoice, FaHistory, FaBox, FaUsers, FaMoneyCheckAlt } from "react-icons/fa";

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-white shadow-lg fixed top-0 left-0 z-10 flex flex-col p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-8">Aara Infraa</h2>
      <nav className="flex flex-col gap-4 text-gray-700 text-base font-medium">
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? "text-blue-600 font-semibold" : ""}>
          <div className="flex items-center gap-3"><FaHome /> Dashboard</div>
        </NavLink>
        <NavLink to="/create-invoice" className={({ isActive }) => isActive ? "text-blue-600 font-semibold" : ""}>
          <div className="flex items-center gap-3"><FaFileInvoice /> Create Invoice</div>
        </NavLink>
        <NavLink to="/invoice-history" className={({ isActive }) => isActive ? "text-blue-600 font-semibold" : ""}>
          <div className="flex items-center gap-3"><FaHistory /> Invoice History</div>
        </NavLink>
        <NavLink to="/products" className={({ isActive }) => isActive ? "text-blue-600 font-semibold" : ""}>
          <div className="flex items-center gap-3"><FaBox /> Products</div>
        </NavLink>
        <NavLink to="/clients" className={({ isActive }) => isActive ? "text-blue-600 font-semibold" : ""}>
          <div className="flex items-center gap-3"><FaUsers /> Clients</div>
        </NavLink>
        <NavLink to="/vendor-invoices" className={({ isActive }) => isActive ? "text-blue-600 font-semibold" : ""}>
          <div className="flex items-center gap-3"><FaMoneyCheckAlt /> Vendor Bills</div>
        </NavLink>
      </nav>
    </aside>
  );
}
