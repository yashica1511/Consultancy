import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './components/Dashboard';
import CreateInvoice from './components/CreateInvoice';
import InvoicePreview from './components/InvoicePreview';
import Products from './components/Products';
import Clients from './components/Clients';
import InvoiceHistory from './components/InvoiceHistory';
import InvoiceById from './components/InvoiceById';

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
              <InvoicePreview /> 
            </ProtectedRoute>
          }
        />

        <Route
          path="/invoice-history"
          element={
            <ProtectedRoute>
              <InvoiceHistory /> 
            </ProtectedRoute>
          }
        />

        <Route
          path="/invoice-preview/:id"
          element={
            <ProtectedRoute>
              <InvoiceById /> 
            </ProtectedRoute>
          }
        />

        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <Products /> 
            </ProtectedRoute>
          }
        />

        <Route
          path="/clients"
          element={
            <ProtectedRoute>
              <Clients /> 
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
