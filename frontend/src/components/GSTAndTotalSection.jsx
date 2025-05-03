import React from "react";

const GSTAndTotalSection = ({
  gstPercent,
  setGstPercent,
  invoiceData,
  setInvoiceData,
  subtotal,
  gstAmount,
  total,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
      <div className="space-y-4">
        <div>
          <label className="text-sm block mb-1">GST (%)</label>
          <select
            value={gstPercent}
            onChange={(e) => setGstPercent(Number(e.target.value))}
            className="border p-2 rounded w-full"
          >
            {[0, 5, 12, 18, 28].map((val) => (
              <option key={val} value={val}>
                {val}%
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm block mb-1">Round Off</label>
          <input
            type="number"
            placeholder="e.g., -0.05 or 0.25"
            className="border p-2 rounded w-full"
            value={invoiceData.roundOff}
            onChange={(e) =>
              setInvoiceData({ ...invoiceData, roundOff: e.target.value })
            }
          />
        </div>
      </div>

      <div className="bg-gray-100 p-4 rounded space-y-1">
        <p>Subtotal: ₹ {subtotal.toFixed(2)}</p>
        <p>
          GST: ₹ {gstAmount.toFixed(2)} (
          {invoiceData.gstType === "intra" ? "CGST + SGST" : "IGST"})
        </p>
        <p>Round Off: ₹ {Number(invoiceData.roundOff).toFixed(2)}</p>
        <p className="text-lg font-bold">Total: ₹ {total.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default GSTAndTotalSection;