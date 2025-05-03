import React from "react";

const ClientDetailsForm = ({ invoiceData, setInvoiceData }) => {
  return (
    <div className="mb-4 space-y-2">
      <h2 className="text-lg font-semibold text-gray-700">Client Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Client Name"
          className="border p-2 rounded shadow-sm"
          value={invoiceData.client.name}
          onChange={(e) =>
            setInvoiceData({
              ...invoiceData,
              client: { ...invoiceData.client, name: e.target.value },
            })
          }
        />
        <input
          type="text"
          placeholder="GSTIN"
          className="border p-2 rounded shadow-sm"
          value={invoiceData.client.gstin}
          onChange={(e) =>
            setInvoiceData({
              ...invoiceData,
              client: { ...invoiceData.client, gstin: e.target.value },
            })
          }
        />
        <input
          type="text"
          placeholder="Client Address"
          className="border p-2 rounded shadow-sm"
          value={invoiceData.client.address}
          onChange={(e) =>
            setInvoiceData({
              ...invoiceData,
              client: { ...invoiceData.client, address: e.target.value },
            })
          }
        />
        <input
          type="text"
          placeholder="Client State"
          className="border p-2 rounded shadow-sm"
          value={invoiceData.client.state}
          onChange={(e) =>
            setInvoiceData({
              ...invoiceData,
              client: { ...invoiceData.client, state: e.target.value },
            })
          }
        />
      </div>
    </div>
  );
};

export default ClientDetailsForm;