import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';

const InvoicesPage = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md overflow-y-auto h-full fixed">
        <nav className="p-4 space-y-2 text-gray-800 font-medium text-[17px]">
          {[
            'Dashboard', 'Invoices', 'Payments', 'Quotes For Customers',
            'Customers', 'Peoples', 'Companies', 'Leads',
            'Quotes For Leads', 'Products', 'Products Category',
            'Expenses', 'Expenses Category', 'Report', 'Settings',
          ].map((item, index) => (
            <div key={index} className={`flex items-center px-1 py-1 hover:bg-blue-100 rounded-md ${item === 'Invoices' ? 'bg-blue-100 text-blue-600' : ''}`}>
              <span>{item}</span>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8 w-full overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <FaArrowLeft className="text-lg text-gray-600" />
            <h1 className="text-2xl font-semibold text-gray-800">Invoice List</h1>
          </div>

          <div className="flex items-center gap-3">
            <select className="border border-gray-300 rounded-md p-2 text-sm">
              <option>Search Filter</option>
            </select>
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-100">Refresh</button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">+ Add New Invoice</button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white shadow rounded-lg p-4">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-gray-700">
              <thead>
                <tr className="border-b font-medium">
                  {['Number', 'Client', 'Date', 'Expired Date', 'Total', 'Paid', 'Status', 'Payment', 'Created By'].map((heading, i) => (
                    <th key={i} className="px-4 py-3 whitespace-nowrap">{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={9} className="text-center py-12">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-6h6v6m2 4H7a2 2 0 01-2-2V5a2 2 0 012-2h4l2 2h6a2 2 0 012 2v12a2 2 0 01-2 2z" />
                      </svg>
                      No data
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InvoicesPage;
