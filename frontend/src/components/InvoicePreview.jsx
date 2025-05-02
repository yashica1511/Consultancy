import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import html2pdf from 'html2pdf.js';

export default function InvoicePreview() {
  const invoiceRef = useRef();
  const navigate = useNavigate();

  const handleDownload = () => {
    const element = invoiceRef.current;
    const opt = {
      margin: 0,
      filename: 'invoice.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 4,
        useCORS: true,
        scrollX: 0,
        scrollY: 0,
      },
      jsPDF: { unit: 'px', format: [794, 1123], orientation: 'portrait' },
    };

    html2pdf().set(opt).from(element).save();
  };

  const handleBack = () => {
    navigate('/create-invoice');
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Navbar */}
      <nav className="flex items-center justify-between bg-blue-700 text-white px-4 py-3 shadow">
        <button
          onClick={handleBack}
          className="text-white text-lg font-semibold hover:text-gray-300 transition"
        >
          ← Back
        </button>
        <h1 className="text-xl font-semibold">Invoice Preview</h1>
        <div className="w-16" /> {/* Placeholder to balance layout */}
      </nav>

      {/* Invoice Section */}
      <div className="flex flex-col items-center py-10">
        <div
          ref={invoiceRef}
          className="bg-white text-black text-sm border border-gray-300 p-6"
          style={{
            width: "794px",
            minHeight: "1123px",
            boxSizing: "border-box",
          }}
        >
          {/* Header */}
          <div className="flex justify-between mb-2">
            <div>
              <p className="text-xs">GSTIN : 29HOWPS4461A1ZA</p>
              <p className="text-xs">State Code : 29</p>
            </div>
            <div className="text-right text-xs">
              <p>Cell : 99429 34940</p>
              <p>96204 01974</p>
            </div>
          </div>

          <h1 className="text-center text-xl font-bold underline my-2">TAX INVOICE</h1>
          <h2 className="text-center text-lg font-bold mb-1">AARA INFRAA</h2>
          <p className="text-center text-xs"># 49/1, S.Medahalli, Sarjapura Road, Attibele, Bangalore-07</p>
          <p className="text-center text-xs">Email : aarainfraa@gmail.com</p>

          {/* Address */}
          <div className="border border-black p-2 my-3">
            <p className="font-bold">To M/s</p>
            <p>Sri Hamshini and Chandra Enterprises</p>
            <p>Park Street, 49/244 Surya Nagar Colony,</p>
            <p>Uppal, Hyderabad, Telangana-533339</p>
          </div>

          {/* Invoice Details */}
          <div className="grid grid-cols-4 border border-black text-xs">
            <div className="border-r border-b border-black p-1">Invoice No</div>
            <div className="border-r border-b border-black p-1">51</div>
            <div className="border-r border-b border-black p-1">Date</div>
            <div className="border-b border-black p-1">19.03.2025</div>
            <div className="border-r border-b border-black p-1">Your PO No</div>
            <div className="border-r border-b border-black p-1">Date</div>
            <div className="border-r border-b border-black p-1">Our DC No</div>
            <div className="border-b border-black p-1">Date</div>
            <div className="border-r border-b border-black p-1">Vendor Code</div>
            <div className="border-r border-b border-black p-1">Vehicle No</div>
            <div className="border-r border-b border-black p-1">GST IN</div>
            <div className="border-b border-black p-1">36BAZPC4689M1ZO</div>
            <div className="col-span-4 border-t border-black p-1">Eway Bill No</div>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-[60px_1fr_110px_100px_100px_110px] border border-black text-xs">
            <div className="border-r p-1">Sl No</div>
            <div className="border-r p-1">Description</div>
            <div className="border-r p-1">HSN SAC CODE</div>
            <div className="border-r p-1">Quantity</div>
            <div className="border-r p-1">Rate</div>
            <div className="p-1">Amount</div>
          </div>

          {/* Table Row */}
          <div className="grid grid-cols-[60px_1fr_110px_100px_100px_110px] border border-black text-xs">
            <div className="border-r p-1 text-center">1</div>
            <div className="border-r p-1 text-left">
              <p className="font-bold">Supply and Manufacturing of UPVC KISOK</p>
              <div className="pl-2 mt-1">
                <p>UPVC Windows - 12 nos</p>
                <p>UPVC Pannels - 85 nos</p>
                <p>MS Pipes - 30 nos</p>
                <p>Roofing Sheets - 6 nos</p>
                <p>Gutters - 9 nos</p>
                <p>With Electrical items</p>
              </div>
            </div>
            <div className="border-r p-1 text-center">3925</div>
            <div className="border-r p-1 text-center">1 Set</div>
            <div className="border-r p-1 text-center">330000.00</div>
            <div className="p-1 text-center">330000.00</div>
          </div>

          {/* Delivery & Total */}
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div className="border border-black p-3 text-xs">
              <p>Delivery Address</p>
              <p className="font-bold mt-2">Swayambu Shambu Lingeshwara Temple</p>
              <p>Mellacheruvu, Suryapet,</p>
              <p>Telangana - 508246</p>
            </div>
            <div className="border border-black p-3 text-xs">
              <p>Total: ₹330000.00</p>
              <p>CGST %: 0</p>
              <p>SGST %: 0</p>
              <p>IGST %: ₹59400</p>
              <p className="font-bold">Grand Total: ₹389400.00</p>
            </div>
          </div>

          {/* Amount in words */}
          <p className="mt-4 text-xs">
            Rupees: <strong>Three Lakh's Eightynine thousand and Four hundred Rupees Only</strong>
          </p>

          <hr className="border-t border-black my-4" />

          {/* Bank Info */}
          <div className="text-xs space-y-1">
            <p><span className="font-bold">Bank Name</span>: KARUR VYSYS BANK (Hosur Branch)</p>
            <p><span className="font-bold">Account Name</span>: AARA INFRAA</p>
            <p><span className="font-bold">A/c No.</span>: 160714000000012</p>
            <p><span className="font-bold">IFSC</span>: KVBL0001607</p>
          </div>

          {/* Signatures */}
          <div className="flex justify-between mt-8 text-xs">
            <p>Receivers Signature with company Seal</p>
            <div className="text-right">
              <p>For AARA INFRAA</p>
              <p className="mt-2">Authorised Signature</p>
            </div>
          </div>
        </div>

        {/* Download Button */}
        <button
          onClick={handleDownload}
          className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Download Invoice as PDF
        </button>
      </div>
    </div>
  );
}
