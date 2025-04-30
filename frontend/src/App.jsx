import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './components/Dashboard';
import CreateInvoice from './components/CreateInvoice';
import { InvoicePreviewWithErrorBoundary } from './components/InvoicePreview'; // Adjust path as needed

// Sample data for testing
const sampleData = {
  client: {
    name: "Client Name",
    address: "123 Client Street, City, State",
    gstin: "29ABCDE1234F1Z5",
  },
  invoiceNo: "INV-001",
  buyerOrderNo: "PO-1234",
  referenceNo: "DC-001",
  gstType: "intra", // or "inter"
  items: [
    {
      description: "Product 1",
      hsn: "1234",
      quantity: 2,
      rate: 150,
    },
    {
      description: "Product 2",
      hsn: "5678",
      quantity: 1,
      rate: 200,
    },
  ],
  roundOff: "5", // Optional field
  deliveryAddress: "456 Delivery Street, City, State",
  date: "2025-04-27", // Current date or any date
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-invoice"
          element={
            <ProtectedRoute>
              <CreateInvoice />
            </ProtectedRoute>
          }
        />

        <Route
          path="/invoice"
          element={
            <ProtectedRoute>
              <InvoicePreviewWithErrorBoundary data={sampleData} /> 
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
