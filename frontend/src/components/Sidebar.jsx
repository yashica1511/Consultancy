// src/components/Sidebar.jsx
import { NavLink } from "react-router-dom";
import { FaHome, FaFileInvoice, FaHistory, FaBox, FaUsers, FaChevronRight, FaBuilding } from "react-icons/fa";
import { RiDashboardFill } from "react-icons/ri";

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-gradient-to-b from-blue-800 to-blue-900 fixed top-0 left-0 z-10 flex flex-col p-4 border-r border-blue-700/30">
      {/* Logo Section */}
      <div className="flex items-center gap-3 mb-8 p-2">
        <div className="bg-white/20 p-2 rounded-md flex items-center justify-center">
          <FaBuilding className="text-white text-lg" />
        </div>
        <h2 className="text-xl font-bold text-white">Aara Infraa</h2>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col gap-1">
        <NavLink 
          to="/dashboard" 
          className={({ isActive }) => 
            `flex items-center justify-between p-2.5 rounded-md transition-all ${isActive ? 
              "bg-blue-700 text-white shadow-sm" : 
              "text-blue-100 hover:bg-blue-700/40 hover:text-white"}`
          }
        >
          <div className="flex items-center gap-3">
            <RiDashboardFill className="text-base" /> 
            <span className="text-sm">Dashboard</span>
          </div>
          <FaChevronRight className="text-xs opacity-70" />
        </NavLink>

        {/* Rest of your navigation links remain the same */}
        <NavLink 
          to="/create-invoice" 
          className={({ isActive }) => 
            `flex items-center justify-between p-2.5 rounded-md transition-all ${isActive ? 
              "bg-blue-700 text-white shadow-sm" : 
              "text-blue-100 hover:bg-blue-700/40 hover:text-white"}`
          }
        >
          <div className="flex items-center gap-3">
            <FaFileInvoice className="text-base" /> 
            <span className="text-sm">Create Invoice</span>
          </div>
          <FaChevronRight className="text-xs opacity-70" />
        </NavLink>

        <NavLink 
          to="/invoice-history" 
          className={({ isActive }) => 
            `flex items-center justify-between p-2.5 rounded-md transition-all ${isActive ? 
              "bg-blue-700 text-white shadow-sm" : 
              "text-blue-100 hover:bg-blue-700/40 hover:text-white"}`
          }
        >
          <div className="flex items-center gap-3">
            <FaHistory className="text-base" /> 
            <span className="text-sm">Invoice History</span>
          </div>
          <FaChevronRight className="text-xs opacity-70" />
        </NavLink>

        <NavLink 
          to="/products" 
          className={({ isActive }) => 
            `flex items-center justify-between p-2.5 rounded-md transition-all ${isActive ? 
              "bg-blue-700 text-white shadow-sm" : 
              "text-blue-100 hover:bg-blue-700/40 hover:text-white"}`
          }
        >
          <div className="flex items-center gap-3">
            <FaBox className="text-base" /> 
            <span className="text-sm">Products</span>
          </div>
          <FaChevronRight className="text-xs opacity-70" />
        </NavLink>

        <NavLink 
          to="/clients" 
          className={({ isActive }) => 
            `flex items-center justify-between p-2.5 rounded-md transition-all ${isActive ? 
              "bg-blue-700 text-white shadow-sm" : 
              "text-blue-100 hover:bg-blue-700/40 hover:text-white"}`
          }
        >
          <div className="flex items-center gap-3">
            <FaUsers className="text-base" /> 
            <span className="text-sm">Clients</span>
          </div>
          <FaChevronRight className="text-xs opacity-70" />
        </NavLink>
      </nav>

      {/* Bottom Section */}
      <div className="mt-auto pt-4 border-t border-blue-700/30">
        <div className="flex items-center gap-2 p-2 text-blue-100 rounded-md hover:bg-blue-700/40 cursor-pointer transition-all">
          <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center">
            <span className="text-xs font-medium">AI</span>
          </div>
          <div className="truncate">
            <p className="text-xs font-medium">Admin User</p>
            <p className="text-[11px] opacity-70 truncate">Consultant</p>
          </div>
        </div>
      </div>
    </aside>
  );
}