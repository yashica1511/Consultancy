import React, { useRef } from "react";
import InvoicePreview from "./InvoicePreview";
import html2pdf from "html2pdf.js";

export default function InvoicePreviewWithDownload({ data }) {
  const invoiceRef = useRef();

  const handleDownloadPDF = () => {
    const element = invoiceRef.current;
    const opt = {
      margin:       0.5,
      filename:     `Invoice_${data.invoiceNo}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="p-4">
      <div ref={invoiceRef}>
        <InvoicePreview data={data} />
      </div>
      <div className="text-center mt-4">
        <button 
          onClick={handleDownloadPDF}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
}
