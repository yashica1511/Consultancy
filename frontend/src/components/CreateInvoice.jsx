import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { FaBars, FaArrowLeft } from "react-icons/fa";
import ProductQuickSelect from "@/components/ProductQuickSelect";
import InvoicePreview from "@/components/InvoicePreview";
import { useNavigate } from "react-router-dom";
import { toWords } from "number-to-words";
import ClientDetailsForm from "./ClientDetailsForm";
import InvoiceDetailsForm from "./InvoiceDetailsForm";
import GSTAndTotalSection from "./GSTAndTotalSection";


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

  const handleProductSelect = (product) => {
    setInvoiceData((prev) => ({
      ...prev,
      items: [...prev.items, { 
        description: product.name,
        quantity: 1, 
        rate: product.rate, 
        hsn: product.hsnCode 
      }],
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
      cgstAmount:
        invoiceData.gstType === "intra"
          ? item.quantity * item.rate * (gstPercent / 200)
          : 0,
      sgstRate: invoiceData.gstType === "intra" ? gstPercent / 2 : 0,
      sgstAmount:
        invoiceData.gstType === "intra"
          ? item.quantity * item.rate * (gstPercent / 200)
          : 0,
      igstRate: invoiceData.gstType === "inter" ? gstPercent : 0,
      igstAmount:
        invoiceData.gstType === "inter"
          ? item.quantity * item.rate * (gstPercent / 100)
          : 0,
    }));

    const totalAmountBeforeTax = subtotal;
    const gstAmount =
      invoiceData.gstType === "intra"
        ? subtotal * (gstPercent / 200) * 2
        : subtotal * (gstPercent / 100);
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
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-600"
          >
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
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-xl text-gray-700"
          >
            <FaBars />
          </button>
          <h1 className="text-xl font-bold text-gray-800">Create Invoice</h1>
        </div>

        {/* 2nd Column - Invoice Editor */}
        <div className="flex-1 p-4 md:p-8">
          <h1 className="hidden md:block text-3xl font-bold text-gray-800 mb-6">
            Create Invoice
          </h1>

          <ClientDetailsForm
            invoiceData={invoiceData}
            setInvoiceData={setInvoiceData}
          />

          <InvoiceDetailsForm
            invoiceData={invoiceData}
            setInvoiceData={setInvoiceData}
            updateItem={updateItem}
            handleProductSelect={handleProductSelect}
          />

          <GSTAndTotalSection
            gstPercent={gstPercent}
            setGstPercent={setGstPercent}
            invoiceData={invoiceData}
            setInvoiceData={setInvoiceData}
            subtotal={subtotal}
            gstAmount={gstAmount}
            total={total}
          />

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={saveInvoice}
              className="bg-green-600 text-white px-6 py-2 rounded"
            >
              Save
            </button>
          </div>

          {/* Preview Modal */}
          {showPreview && (
            <InvoicePreview
              invoiceData={invoiceData}
              gstPercent={gstPercent}
              gstAmount={gstAmount}
              total={total}
              onClose={() => setShowPreview(false)}
            />
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