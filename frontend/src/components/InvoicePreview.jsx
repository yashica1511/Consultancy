import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import axios from 'axios';

export default function InvoicePreview() {
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const invoiceRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/invoices/latest', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setInvoice(response.data);
      } catch (error) {
        console.error('Failed to fetch invoice:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, []);

  const handleDownload = () => {
    const element = invoiceRef.current;
    const opt = {
      margin: 0,
      filename: `invoice-${invoice?.invoiceNumber || 'preview'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 4, useCORS: true },
      jsPDF: { unit: 'px', format: [794, 1123], orientation: 'portrait' },
    };
    html2pdf().set(opt).from(element).save();
  };

  const handleBack = () => {
    navigate('/create-invoice');
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!invoice) return <div className="p-10 text-center">No invoice found.</div>;

  return (
    <div className="bg-gray-100 min-h-screen">
      <nav className="flex items-center justify-between bg-blue-700 text-white px-6 py-4 shadow">
        <button onClick={handleBack} className="text-lg font-semibold hover:underline">← Back</button>
        <h1 className="text-xl font-bold">Invoice Preview</h1>
        <button onClick={handleDownload} className="bg-white text-blue-700 px-4 py-1 rounded font-semibold hover:bg-gray-200 transition">
          Download PDF
        </button>
      </nav>

      <div className="flex justify-center py-10">
        <div ref={invoiceRef} className="bg-white text-black text-sm shadow-md p-6 border border-gray-300" style={{ width: "794px", minHeight: "1123px" }}>
          {/* Header with GST and contact info */}
          <div className="flex justify-between mb-2">
            <div>
              <p className="text-s">GSTIN : {invoice.companyGSTIN || '29HOWPS4461A1ZA'}</p>
              <p className="text-s">State Code : {invoice.companyStateCode || '29'}</p>
            </div>
            <div className="text-right text-s">
              <p>Cell : 99429 34940</p>
              <p>96204 01974</p>
            </div>
          </div>

          {/* Company Title */}
          <h1 className="text-center text-2xl font-bold underline my-2 mt-2">TAX INVOICE</h1>
          <h2 className="text-center text-lg font-bold mb-1">AARA INFRAA</h2>
          <p className="text-center text-s"># 49/1, S.Medahalli, Sarjapura Road, Attibele, Bangalore-07</p>
          <p className="text-center text-s">Email : aarainfraa@gmail.com</p>

          {/* Client Info */}
          <div className="border border-black p-2 my-3">
            <p className="font-bold">To M/s</p>
            <p>{invoice.clientName}</p>
            <p>{invoice.clientAddress}</p>
          </div>

          {/* Invoice Details */}
          <div className="grid grid-cols-4 border border-black text-xs mt-3 mb-3">
            <div className="border-r border-b border-black p-1">Invoice No</div>
            <div className="border-r border-b border-black p-1">{invoice.invoiceNumber}</div>
            <div className="border-r border-b border-black p-1">Date</div>
            <div className="border-b border-black p-1">{new Date(invoice.invoiceDate).toLocaleDateString('en-IN')}</div>
            <div className="border-r border-b border-black p-1">SP No</div>
            <div className="border-r border-b border-black p-1">{invoice.supplierRef}</div>
            <div className="border-r border-b border-black p-1">Order No</div>
            <div className="border-b border-black p-1">{invoice.buyerOrderNo}</div>
            <div className="col-span-4 border-t border-black p-1">
              GST IN:&nbsp;<span className="ml-1">{invoice.clientGSTIN}</span>
            </div>

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

          {/* Table Rows */}
          {invoice.items.map((item, index) => (
            <div key={index} className="grid grid-cols-[60px_1fr_110px_100px_100px_110px] border border-black text-xs">
              <div className="border-r p-1 text-center">{index + 1}</div>
              <div className="border-r p-1 text-left">
                <p className="font-bold">{item.name}</p>
                {item.description && (
                  <div className="pl-2 mt-1">
                    {item.description.split('\n').map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                )}
              </div>
              <div className="border-r p-1 text-center">{item.hsnCode}</div>
              <div className="border-r p-1 text-center">{item.quantity}</div>
              <div className="border-r p-1 text-center">{item.rate.toFixed(2)}</div>
              <div className="p-1 text-center">{(item.quantity * item.rate).toFixed(2)}</div>
            </div>
          ))}

          {/* Delivery & Total */}
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div className="border border-black p-3 text-xs">
              <p>Delivery Address</p>
              <p className="font-bold mt-2">{invoice.deliveryAddress || invoice.clientAddress}</p>
              <p>{invoice.destination}</p>
            </div>
            <div className="border border-black p-3 text-xs">
              <p>Total: ₹{invoice.totalAmountBeforeTax.toFixed(2)}</p>
              <p>CGST %: ₹{invoice.cgstTotal.toFixed(2)}</p>
              <p>SGST %: ₹{invoice.sgstTotal.toFixed(2)}</p>
              <p>IGST %: ₹{invoice.igstTotal.toFixed(2)}</p>
              <p className="font-bold">Grand Total: ₹{invoice.totalAmountAfterTax.toFixed(2)}</p>
            </div>
          </div>

          {/* Amount in words */}
          <p className="mt-4 text-s">
            Rupees: <strong>{invoice.amountInWords}</strong>
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
          {/* Signature Section with spacing for seal and sign */}
          <div className="flex justify-between mt-12 text-xs">
            <div className="w-1/2">
              <p className="mt-20">Receivers Signature with company Seal</p>
            </div>
            <div className="w-1/2 text-right">
              <p>For AARA INFRAA</p>
              <div className="mb-1"></div> 
              <p className="mt-16">Authorised Signature</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}