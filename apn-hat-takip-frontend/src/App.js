import './App.css';
import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import SimCards from "./pages/SimCards";
import Customers from "./pages/Customers";
import HatYonetim from "./pages/HatYonetim";
import HatTahsisForm from "./pages/HatTahsisForm";
import ReturnedSimCards from "./pages/ReturnedSimCards";
import Login from "./pages/Login"; // ✅ Login import edildi

import Invoices from "./pages/Invoices"; // ✅ Yeni eklenen Faturalar sayfası import edildi

// PrivateRoute bileşeni
function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

function AppLayout({ children }) {
  const location = useLocation();

  // ✅ login sayfasında sidebar gizlensin
  const hideSidebar = location.pathname === "/login";

  return (
    <div className="d-flex">
      {!hideSidebar && <Sidebar />}
      <div style={{ marginLeft: hideSidebar ? 0 : 220, padding: "20px", width: "100%" }}>
        {children}
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          {/* Login route'u */}
          <Route path="/login" element={<Login />} />

          {/* PrivateRoute ile korunan sayfalar */}
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/sim-cards" element={<PrivateRoute><SimCards /></PrivateRoute>} />
          <Route path="/customers" element={<PrivateRoute><Customers /></PrivateRoute>} />
          <Route path="/hat-yonetim" element={<PrivateRoute><HatYonetim /></PrivateRoute>} />
          <Route path="/hat-tahsisi" element={<PrivateRoute><HatTahsisForm /></PrivateRoute>} />
          <Route path="/returned-simcards" element={<PrivateRoute><ReturnedSimCards /></PrivateRoute>} />

          {/* ✅ Yeni eklenen Faturalar route'u */}
          <Route path="/invoices" element={<PrivateRoute><Invoices /></PrivateRoute>} />

          {/* Tanımlanmayan sayfalar için yönlendirme */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;
