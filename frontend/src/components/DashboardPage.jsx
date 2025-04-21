import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-[#f7f9fc]">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6 border-r min-h-screen">
        <div className="text-xl font-bold text-indigo-600 mb-3">Dashboard</div>
        <nav className="space-y-3 text-gray-700 text-base font-medium">
          {[
            "Invoices", "Payments", "Quotes For Customers", "Customers", "Peoples",
            "Companies", "Leads", "Quotes For Leads", "Products", "Products Category",
            "Expenses", "Expenses Category", "Report", "Settings"
          ].map(item => (
            <Link
              key={item}
              to={`/${item.toLowerCase().replaceAll(" ", "-")}`}
              className="block hover:bg-indigo-100 px-1 py-1 rounded transition"
            >
              {item}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 space-y-10 bg-[#f7f9fc]">
        {/* Top Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { title: "Invoices", value: "$ 00.00", color: "bg-teal-100 text-teal-700" },
            { title: "Quotes For Customers", value: "$ 00.00", color: "bg-purple-100 text-purple-700" },
            { title: "Quotes For Leads", value: "$ 00.00", color: "bg-green-100 text-green-700" },
            { title: "Unpaid", value: "$ 00.00", color: "bg-red-100 text-red-700" }
          ].map(card => (
            <div className="bg-white shadow rounded-2xl p-6" key={card.title}>
              <div className="text-xl font-semibold text-[#2d1154]">{card.title}</div>
              <div className="flex justify-between items-center mt-6">
                <span className="text-base text-gray-500">This Month</span>
                <span className={`text-lg font-bold px-3 py-1 rounded-full ${card.color}`}>{card.value}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Status Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <StatusCard title="Invoices" statuses={["Draft", "Pending", "Unpaid", "Overdue", "Partially", "Paid"]} />
          <StatusCard title="Quotes For Customers" statuses={["Draft", "Pending", "Sent", "Declined", "Accepted", "Expired"]} />
          <StatusCard title="Quotes For Leads" statuses={["Draft", "Pending", "Sent", "Declined", "Accepted", "Expired"]} />
          <div className="bg-white shadow rounded-2xl p-8 flex flex-col justify-center items-center">
            <h4 className="text-xl font-semibold text-[#2d1154] mb-4">Customers</h4>
            <div className="w-32 h-32 border-[10px] border-gray-200 rounded-full flex items-center justify-center text-2xl font-bold text-gray-700">
              0%
            </div>
            <p className="mt-4 text-base text-gray-500">New Customer This Month</p>
            <hr className="my-6 w-full border-gray-200" />
            <p className="text-base text-gray-500">Active Customer</p>
            <p className="text-lg font-bold text-gray-700">0.00%</p>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatusCard({ title, statuses }) {
  return (
    <div className="bg-white shadow rounded-2xl p-6">
      <h4 className="text-xl font-semibold text-[#2d1154] mb-6">{title}</h4>
      <ul className="space-y-4">
        {statuses.map((status) => (
          <li key={status} className="flex justify-between items-center text-base text-gray-700">
            <span>{status}</span>
            <div className="flex items-center gap-3">
              <div className="w-32 h-2 rounded bg-gray-200"></div>
              <span>0%</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
