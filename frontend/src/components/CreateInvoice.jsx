import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import {
  FaBars,
  FaArrowLeft,
} from "react-icons/fa";
import ProductQuickSelect from "@/components/ProductQuickSelect";
import InvoicePreview from "@/components/InvoicePreview";
import { useNavigate } from "react-router-dom";
import { toWords } from "number-to-words";

const mockProducts = {
  1: { description: "5 MM Clr. Float Glass", rate: 500, hsn: "7005" },
  2: { description: "Aluminium Frame", rate: 800, hsn: "7604" },
  3: { description: "MS Pipe", rate: 1200, hsn: "7306" },
};

export default function CreateInvoice() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [gstPercent, setGstPercent] = useState(18);
  const [invoiceData, setInvoiceData] = useState({
    invoiceNo: 101,
    date: new Date().toISOString().slice(0, 10),
    client: { name: "", gstin: "", address: "", state: "" },
    deliveryNote: "",
    buyerOrderNo: "",
    referenceNo: "",
    deliveryAddress: "",
    transport: "",
    gstType: "intra",
    handlingCharges: 0,
    roundOff: 0,
    items: [{ description: "", quantity: 1, rate: 0, hsn: "" }],
  });
  const [showPreview, setShowPreview] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const navigate = useNavigate();

  const handleProductSelect = (code) => {
    const product = mockProducts[code];
    if (!product) return;
    setInvoiceData((prev) => ({
      ...prev,
      items: [...prev.items, { ...product, quantity: 1 }],
    }));
  };

  const updateItem = (index, field, value) => {
    const newItems = [...invoiceData.items];
    newItems[index][field] = value;
    setInvoiceData({ ...invoiceData, items: newItems });
  };

  const subtotal = invoiceData.items.reduce(
    (sum, item) => sum + item.quantity * item.rate,
    0
  );

  const generateInvoiceNumber = () => {
    const year = new Date().getFullYear();
    const number = ("00" + invoiceData.invoiceNo).slice(-3); 
    return `AARA-INV-${year}-${number}`;
  };
  
  const invoiceDataWithNumber = {
    ...invoiceData,
    invoiceNo: generateInvoiceNumber(),
  };
  


  const gstAmount =
    invoiceData.gstType === "intra"
      ? subtotal * (gstPercent / 200) * 2
      : subtotal * (gstPercent / 100);

  const total = subtotal + gstAmount + Number(invoiceData.roundOff);

  const toWordsCustom = (num) => {
    const words = toWords(num);
    return words.charAt(0).toUpperCase() + words.slice(1) + " Rupees Only";
  };
  

  const transformData = () => {
    const items = invoiceData.items.map((item) => ({
      description: item.description,
      hsnOrSac: item.hsn,
      quantity: item.quantity,
      rate: item.rate,
      amount: item.quantity * item.rate,
      per: "nos",
      cgstRate: invoiceData.gstType === "intra" ? gstPercent / 2 : 0,
      cgstAmount: invoiceData.gstType === "intra" ? item.quantity * item.rate * (gstPercent / 200) : 0,
      sgstRate: invoiceData.gstType === "intra" ? gstPercent / 2 : 0,
      sgstAmount: invoiceData.gstType === "intra" ? item.quantity * item.rate * (gstPercent / 200) : 0,
      igstRate: invoiceData.gstType === "inter" ? gstPercent : 0,
      igstAmount: invoiceData.gstType === "inter" ? item.quantity * item.rate * (gstPercent / 100) : 0,
    }));
  
    const totalAmountBeforeTax = subtotal;
    const gstAmount = invoiceData.gstType === "intra" ? subtotal * (gstPercent / 200) * 2 : subtotal * (gstPercent / 100);
    const total = totalAmountBeforeTax + gstAmount + Number(invoiceData.roundOff);
  
    const amountInWords = toWordsCustom(total); 
    const invoiceNumber = generateInvoiceNumber(); 
  
    return {
      invoiceNumber: invoiceNumber,
      invoiceDate: invoiceData.date,
      deliveryNote: invoiceData.deliveryNote,
      buyerOrderNo: invoiceData.buyerOrderNo,
      supplierRef: invoiceData.referenceNo,
      despatchedThrough: invoiceData.transport,
      destination: invoiceData.deliveryAddress,
      clientName: invoiceData.client.name,
      clientAddress: invoiceData.client.address,
      clientGSTIN: invoiceData.client.gstin,
      clientState: invoiceData.client.state,
      items: items,
      totalAmountBeforeTax: totalAmountBeforeTax,
      cgstTotal: invoiceData.gstType === "intra" ? gstAmount / 2 : 0,
      sgstTotal: invoiceData.gstType === "intra" ? gstAmount / 2 : 0,
      igstTotal: invoiceData.gstType === "inter" ? gstAmount : 0,
      totalTaxAmount: gstAmount,
      totalAmountAfterTax: total,
      amountInWords: amountInWords,
    };
  };
  

  const saveInvoice = async () => {
    try {
      const token = localStorage.getItem("token");
      const payload = transformData();

      const response = await fetch("http://localhost:5000/api/invoices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Invoice saved:", data);
        setShowSuccessPopup(true);
        setTimeout(() => {
          setShowSuccessPopup(false);
          navigate("/invoice");
        }, 2000);
      } else {
        const error = await response.json();
        console.error("Save failed:", error);
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error("Error saving invoice:", error);
      alert("Something went wrong. Check console.");
    }
  };

  return (
    <>
      <div
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-md transform transition-transform duration-300 ease-in-out 
      ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
      md:translate-x-0 md:relative md:block`}
    >
      {/* Mobile view Back button */}
      <div className="md:hidden flex justify-end p-4">
        <button onClick={() => setSidebarOpen(false)} className="text-gray-600">
          <FaArrowLeft size={20} />
        </button>
      </div>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </div>

    {/* Sidebar Overlay (mobile only) */}
    {sidebarOpen && (
      <div
        className="fixed inset-0 bg-black bg-opacity-25 z-40 md:hidden"
        onClick={() => setSidebarOpen(false)}
      ></div>
    )}
      {/* Main Layout */}
      <div className="ml-0 md:ml-64 bg-gray-50 min-h-screen flex flex-col md:flex-row">

        {/* Mobile Top Bar */}
        <div className="md:hidden flex justify-between items-center px-4 py-3 bg-white shadow w-full">
          <button onClick={() => setSidebarOpen(true)} className="text-xl text-gray-700">
            <FaBars />
          </button>
          <h1 className="text-xl font-bold text-gray-800">Create Invoice</h1>
        </div>

        {/* 2nd Column - Invoice Editor */}
        <div className="flex-1 p-4 md:p-8">
          <h1 className="hidden md:block text-3xl font-bold text-gray-800 mb-6">Create Invoice</h1>

          {/* Client Info */}
          <div className="mb-4 space-y-2">
            <h2 className="text-lg font-semibold text-gray-700">Client Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Client Name" className="border p-2 rounded shadow-sm"
                value={invoiceData.client.name}
                onChange={(e) => setInvoiceData({ ...invoiceData, client: { ...invoiceData.client, name: e.target.value } })}
              />
              <input type="text" placeholder="GSTIN" className="border p-2 rounded shadow-sm"
                value={invoiceData.client.gstin}
                onChange={(e) => setInvoiceData({ ...invoiceData, client: { ...invoiceData.client, gstin: e.target.value } })}
              />
              <input type="text" placeholder="Client Address" className="border p-2 rounded shadow-sm"
                value={invoiceData.client.address}
                onChange={(e) => setInvoiceData({ ...invoiceData, client: { ...invoiceData.client, address: e.target.value } })}
              />
              <input type="text" placeholder="Client State" className="border p-2 rounded shadow-sm"
                value={invoiceData.client.state}
                onChange={(e) => setInvoiceData({ ...invoiceData, client: { ...invoiceData.client, state: e.target.value } })}
              />
            </div>
          </div>

          {/* Invoice Details */}
          <div className="mb-4 space-y-2">
            <h2 className="text-lg font-semibold text-gray-700">Invoice Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Delivery Note" className="border p-2 rounded shadow-sm"
                value={invoiceData.deliveryNote}
                onChange={(e) => setInvoiceData({ ...invoiceData, deliveryNote: e.target.value })}
              />
              <input type="text" placeholder="Buyer's Order No" className="border p-2 rounded shadow-sm"
                value={invoiceData.buyerOrderNo}
                onChange={(e) => setInvoiceData({ ...invoiceData, buyerOrderNo: e.target.value })}
              />
              <input type="text" placeholder="Reference No" className="border p-2 rounded shadow-sm"
                value={invoiceData.referenceNo}
                onChange={(e) => setInvoiceData({ ...invoiceData, referenceNo: e.target.value })}
              />
              <input type="text" placeholder="Transport Details" className="border p-2 rounded shadow-sm"
                value={invoiceData.transport}
                onChange={(e) => setInvoiceData({ ...invoiceData, transport: e.target.value })}
              />
              <textarea placeholder="Delivery Address" className="border p-2 rounded shadow-sm col-span-2"
                value={invoiceData.deliveryAddress}
                onChange={(e) => setInvoiceData({ ...invoiceData, deliveryAddress: e.target.value })}
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
                          items: [...prev.items, { description: "", quantity: 1, rate: 0, hsn: "" }],
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
                    <td className="p-2"><input className="w-full border p-1 rounded"
                      value={item.description}
                      onChange={(e) => updateItem(index, "description", e.target.value)}
                    /></td>
                    <td className="p-2"><input className="w-full border p-1 rounded"
                      value={item.hsn}
                      onChange={(e) => updateItem(index, "hsn", e.target.value)}
                    /></td>
                    <td className="p-2"><input type="number" className="w-full border p-1 rounded"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, "quantity", parseInt(e.target.value))}
                    /></td>
                    <td className="p-2"><input type="number" className="w-full border p-1 rounded"
                      value={item.rate}
                      onChange={(e) => updateItem(index, "rate", parseFloat(e.target.value))}
                    /></td>
                    <td className="p-2">₹ {(item.quantity * item.rate).toFixed(2)}</td>
                    <td className="p-2">
                      {invoiceData.items.length > 1 && (
                        <button onClick={() => {
                          const newItems = invoiceData.items.filter((_, i) => i !== index);
                          setInvoiceData({ ...invoiceData, items: newItems });
                        }}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >Remove</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* GST & Total Section */}
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
                    <option key={val} value={val}>{val}%</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm block mb-1">Round Off</label>
                <input type="number" placeholder="e.g., -0.05 or 0.25"
                  className="border p-2 rounded w-full"
                  value={invoiceData.roundOff}
                  onChange={(e) => setInvoiceData({ ...invoiceData, roundOff: e.target.value })}
                />
              </div>
            </div>

            <div className="bg-gray-100 p-4 rounded space-y-1">
              <p>Subtotal: ₹ {subtotal.toFixed(2)}</p>
              <p>GST: ₹ {gstAmount.toFixed(2)} ({invoiceData.gstType === "intra" ? "CGST + SGST" : "IGST"})</p>
              <p>Round Off: ₹ {Number(invoiceData.roundOff).toFixed(2)}</p>
              <p className="text-lg font-bold">Total: ₹ {total.toFixed(2)}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <button onClick={saveInvoice} className="bg-green-600 text-white px-6 py-2 rounded">Save</button>
          </div>

          {/* Preview Modal */}
          {showPreview && (
            <InvoicePreview invoiceData={invoiceData} gstPercent={gstPercent} gstAmount={gstAmount} total={total} onClose={() => setShowPreview(false)} />
          )}
        </div>

        {/* 3rd Column - Product Quick Select */}
        <div className="hidden lg:block w-72 border-l p-4">
          <ProductQuickSelect onSelect={handleProductSelect} />
        </div>

      </div>
    </>
  );
}
