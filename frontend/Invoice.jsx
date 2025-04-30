import React from 'react';
import './Invoice.css';

export default function InvoicePage() {
  return (
    <div className="invoice-container">
      {/* Header */}
      <div className="header-top">
        <div>
          <p className="small">GSTIN : 29HOWPS4461A1ZA</p>
          <p className="small">State Code : 29</p>
        </div>
        <div className="text-right">
          <p>Cell : 99429 34940</p>
          <p>96204 01974</p>
        </div>
      </div>

      <h1 className="title">TAX INVOICE</h1>
      <h2 className="subtitle">AARA INFRAA</h2>
      <p className="text-center small"># 49/1, S.Medahalli, Sarjapura Road, Attibele, Bangalore-07</p>
      <p className="text-center small">Email : aarainfraa@gmail.com</p>

      {/* Address */}
      <div className="address-box">
        <p className="bold">To M/s</p>
        <p>Sri Hamshini and Chandra Enterprises</p>
        <p>Park Street, 49/244 Surya Nagar Colony,</p>
        <p>Uppal, Hyderabad, Telangana-533339</p>
      </div>

      {/* Invoice Details */}
      <div className="invoice-details">
        <div>Invoice No </div>
        <div>51</div>
        <div>Date</div>
        <div>19.03.2025</div>
        <div>Your PO No</div>
        <div>Date</div>
        <div>Our DC No</div>
        <div>Date</div>
        <div>Vendor Code</div>
        <div>Vehicle No</div>
        <div>GST IN</div>
        <div>36BAZPC4689M1ZO</div>
        <div className="full-width">Eway Bill No</div>
      </div>

      {/* Table Header */}
      <div className="table-header">
        <div>Sl No</div>
        <div>Description</div>
        <div>HSN SAC CODE</div>
        <div>Quantity</div>
        <div>Rate</div>
        <div>Amount</div>
      </div>

      {/* Table Row */}
      <div className="table-row">
        <div>1</div>
        <div>
          <p className="bold">Supply and Manufacturing of UPVC KISOK</p>
          <div className="material-list">
            <p>UPVC Windows - 12 nos</p>
            <p>UPVC Pannels - 85 nos</p>
            <p>MS Pipes - 30 nos</p>
            <p>Roofing Sheets - 6 nos</p>
            <p>Gutters - 9 nos</p>
            <p>With Electrical items</p>
          </div>
        </div>
        <div>3925</div>
        <div>1 Set</div>
        <div>330000.00</div>
        <div>330000.00</div>
      </div>

      {/* Delivery & Total */}
      <div className="bottom-grid">
        <div className="delivery-box">
          <p>Delivery Address</p>
          <p className="bold mt">Swayambu Shambu Lingeshwara Temple</p>
          <p>Mellacheruvu, Suryapet,</p>
          <p>Telangana - 508246</p>
        </div>
        <div className="total-box">
          <p>Total: ₹330000.00</p>
          <p>CGST %: 0</p>
          <p>SGST %: 0</p>
          <p>IGST %: ₹59400</p>
          <p className="bold">Grand Total: ₹389400.00</p>
        </div>
      </div>

      {/* Rupees in words */}
      <p className="amount-words">
        Rupees : <strong>Three Lakh's Eightynine thousand and Four hundred Rupees Only</strong>
      </p>

      {/* Divider Line */}
      <hr className="amount-divider" />

      {/* Bank Info */}
      <div className="bank-info">
        <p><span className="bold">Bank Name</span>: KARUR VYSYS BANK (Hosur Branch)</p>
        <p><span className="bold">Account Name</span>: AARA INFRAA</p>
        <p><span className="bold">A/c No.</span>: 160714000000012</p>
        <p><span className="bold">IFSC</span>: KVBL0001607</p>
      </div>

      {/* Signatures */}
      <div className="signature-box">
        <p>Receivers Signature with company Seal</p>
        <div className="text-right">
          <p>For AARA INFRAA</p>
          <p className="mt">Authorised Signature</p>
        </div>
      </div>
    </div>
  );
}
