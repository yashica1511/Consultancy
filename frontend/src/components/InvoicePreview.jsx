import React from "react";
import PropTypes from "prop-types";

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Error in InvoicePreview component:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong. Please try again later.</h1>;
    }

    return this.props.children;
  }
}

export default function InvoicePreview({ data }) {
  // Ensure data is provided and has a valid structure
  if (!data || !Array.isArray(data.items)) {
    return <h1>Error: Invalid data structure.</h1>;
  }

  const subtotal = data.items.reduce((sum, item) => sum + item.quantity * item.rate, 0);
  const gstAmount = data.gstType === "intra" ? subtotal * 0.09 * 2 : subtotal * 0.18;
  const roundOff = parseFloat(data.roundOff) || 0;
  const total = subtotal + gstAmount + roundOff;

  return (
    <div className="bg-white text-sm text-gray-800 p-6 max-w-5xl mx-auto border shadow">
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold">AARA INFRAA</h2>
        <p># 49/1,S.Medahalli, Sarjapura Road, Attibele, Bangalore-07</p>
        <p>Email: aarainfraa@gmail.com</p>
        <div className="flex justify-between mt-2 border-t pt-2 text-xs">
          <div>
            <p>GSTIN: 29HOWPS4461A1ZA</p>
            <p>State Code: 29</p>
          </div>
          <div className="text-right">
            <p>Cell: 99429 34940</p>
            <p>96240 01974</p>
          </div>
        </div>
      </div>

      <div className="border mb-4 p-2">
        <p><strong>To M/S</strong>: {data.client.name}</p>
        <p>{data.client.address}</p>
        <p>GSTIN: {data.client.gstin}</p>
      </div>

      <div className="grid grid-cols-2 text-xs border mb-4">
        <div className="p-2 border-r">
          <p><strong>Invoice No</strong>: {data.invoiceNo}</p>
          <p><strong>Your PO No</strong>: {data.buyerOrderNo || "-"}</p>
          <p><strong>Our DC No</strong>: {data.referenceNo || "-"}</p>
          <p><strong>Vendor Code</strong>: -</p>
          <p><strong>Vehicle No</strong>: -</p>
        </div>
        <div className="p-2">
          <p><strong>Date</strong>: {data.date}</p>
          <p><strong>Date</strong>: -</p>
          <p><strong>Date</strong>: -</p>
          <p><strong>Eway Bill No</strong>: -</p>
        </div>
      </div>

      <table className="w-full table-fixed border text-xs">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-1 w-6">Sl No</th>
            <th className="border p-1">Description</th>
            <th className="border p-1">HSN/SAC Code</th>
            <th className="border p-1">Quantity</th>
            <th className="border p-1">Rate</th>
            <th className="border p-1">Amount</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((item, idx) => (
            <tr key={idx}>
              <td className="border p-1 text-center">{idx + 1}</td>
              <td className="border p-1">{item.description}</td>
              <td className="border p-1 text-center">{item.hsn}</td>
              <td className="border p-1 text-center">{item.quantity}</td>
              <td className="border p-1 text-right">{item.rate.toFixed(2)}</td>
              <td className="border p-1 text-right">{(item.quantity * item.rate).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-2 text-xs">
        <p><strong>Delivery Address</strong>:</p>
        <p>{data.deliveryAddress}</p>
      </div>

      <div className="grid grid-cols-2 text-xs mt-4">
        <div>
          <p className="mb-2 font-medium">Rupees: <span className="italic">{total.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })} only</span></p>
          <p className="mb-2">Bank Name: KARUR VYSYS BANK (Hosur Branch)</p>
          <p>Account Name: AARA INFRAA</p>
          <p>A/c No.: 160714000000012</p>
          <p>IFSC: KVBL0001607</p>
        </div>
        <div className="text-right">
          <table className="w-full table-fixed border text-xs">
            <tbody>
              {data.gstType === "intra" && (
                <>
                  <tr>
                    <td className="border p-1">CGST</td>
                    <td className="border p-1">9%</td>
                    <td className="border p-1 text-right">{(subtotal * 0.09).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td className="border p-1">SGST</td>
                    <td className="border p-1">9%</td>
                    <td className="border p-1 text-right">{(subtotal * 0.09).toFixed(2)}</td>
                  </tr>
                </>
              )}
              {data.gstType === "inter" && (
                <tr>
                  <td className="border p-1">IGST</td>
                  <td className="border p-1">18%</td>
                  <td className="border p-1 text-right">{(subtotal * 0.18).toFixed(2)}</td>
                </tr>
              )}
              <tr>
                <td className="border p-1 font-semibold" colSpan="2">Grand Total</td>
                <td className="border p-1 font-semibold text-right">{total.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-between text-xs mt-8">
        <p>Receivers Signature with company Seal</p>
        <p><strong>Authorised Signature</strong></p>
      </div>
    </div>
  );
}

// Prop Types Validation
InvoicePreview.propTypes = {
  data: PropTypes.shape({
    items: PropTypes.array.isRequired,
    gstType: PropTypes.string.isRequired,
    roundOff: PropTypes.string,
    client: PropTypes.object.isRequired,
    invoiceNo: PropTypes.string.isRequired,
    buyerOrderNo: PropTypes.string,
    referenceNo: PropTypes.string,
    deliveryAddress: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
  }).isRequired,
};

// Wrapping InvoicePreview in ErrorBoundary
export function InvoicePreviewWithErrorBoundary({ data }) {
  return (
    <ErrorBoundary>
      <InvoicePreview data={data} />
    </ErrorBoundary>
  );
}
