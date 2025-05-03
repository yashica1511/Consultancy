import React from "react";

const InvoiceDetailsForm = ({
  invoiceData,
  setInvoiceData,
  updateItem,
  handleProductSelect,
}) => {
  return (
    <>
      <div className="mb-4 space-y-2">
        <h2 className="text-lg font-semibold text-gray-700">Invoice Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Delivery Note"
            className="border p-2 rounded shadow-sm"
            value={invoiceData.deliveryNote}
            onChange={(e) =>
              setInvoiceData({ ...invoiceData, deliveryNote: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Buyer's Order No"
            className="border p-2 rounded shadow-sm"
            value={invoiceData.buyerOrderNo}
            onChange={(e) =>
              setInvoiceData({ ...invoiceData, buyerOrderNo: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Reference No"
            className="border p-2 rounded shadow-sm"
            value={invoiceData.referenceNo}
            onChange={(e) =>
              setInvoiceData({ ...invoiceData, referenceNo: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Transport Details"
            className="border p-2 rounded shadow-sm"
            value={invoiceData.transport}
            onChange={(e) =>
              setInvoiceData({ ...invoiceData, transport: e.target.value })
            }
          />
          <textarea
            placeholder="Delivery Address"
            className="border p-2 rounded shadow-sm col-span-2"
            value={invoiceData.deliveryAddress}
            onChange={(e) =>
              setInvoiceData({ ...invoiceData, deliveryAddress: e.target.value })
            }
          />
        </div>
      </div>

      {/* Items Table */}
      <div className="overflow-x-auto mb-6">
        <table className="w-full table-auto text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Description</th>
              <th className="p-2">HSN</th>
              <th className="p-2">Qty</th>
              <th className="p-2">Rate</th>
              <th className="p-2">Amount</th>
              <th className="p-2 flex items-center gap-2">
                Action
                <button
                  type="button"
                  onClick={() => {
                    setInvoiceData((prev) => ({
                      ...prev,
                      items: [
                        ...prev.items,
                        { description: "", quantity: 1, rate: 0, hsn: "" },
                      ],
                    }));
                  }}
                  className="bg-green-500 hover:bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                >
                  +
                </button>
              </th>
            </tr>
          </thead>

          <tbody>
            {invoiceData.items.map((item, index) => (
              <tr key={index}>
                <td className="p-2">
                  <input
                    className="w-full border p-1 rounded"
                    value={item.description}
                    onChange={(e) =>
                      updateItem(index, "description", e.target.value)
                    }
                  />
                </td>
                <td className="p-2">
                  <input
                    className="w-full border p-1 rounded"
                    value={item.hsn}
                    onChange={(e) => updateItem(index, "hsn", e.target.value)}
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    className="w-full border p-1 rounded"
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(index, "quantity", parseInt(e.target.value))
                    }
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    className="w-full border p-1 rounded"
                    value={item.rate}
                    onChange={(e) =>
                      updateItem(index, "rate", parseFloat(e.target.value))
                    }
                  />
                </td>
                <td className="p-2">₹ {(item.quantity * item.rate).toFixed(2)}</td>
                <td className="p-2">
                  {invoiceData.items.length > 1 && (
                    <button
                      onClick={() => {
                        const newItems = invoiceData.items.filter(
                          (_, i) => i !== index
                        );
                        setInvoiceData({ ...invoiceData, items: newItems });
                      }}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default InvoiceDetailsForm;