import './App.css';
import React from "react";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import SimCards from "./pages/SimCards";
import Customers from "./pages/Customers";
import HatYonetim from "./pages/HatYonetim";
import HatTahsisForm from "./pages/HatTahsisForm";
import Login from "./pages/Login";


// iade deneme
import ReturnedSimCards from "./pages/ReturnedSimCards";




// PrivateRoute bileşeni: token varsa çocuk bileşeni göster, yoksa login sayfasına yönlendir
function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      {/* Navbar herkes tarafından görünür */}
      <nav className="navbar navbar-expand navbar-dark bg-dark px-3">
        <Link className="navbar-brand" to="/">APN Sistem</Link>
        <div className="navbar-nav">
          <Link className="nav-link" to="/">Dashboard</Link>
          <Link className="nav-link" to="/sim-cards">Sim Kartlar</Link>
          <Link className="nav-link" to="/customers">Müşteriler</Link>
          <Link className="nav-link" to="/hat-yonetim">Hat Yönetim</Link>
          <Link className="nav-link" to="/hat-tahsisi">Hat Tahsisi</Link>
          <Link className="nav-link" to="/returned-simcards">İade Edilen Hatlar</Link>

        </div>
      </nav>

      <div className="container mt-4">
        <Routes>
          {/* Login sayfası korumasız */}
          <Route path="/login" element={<Login />} />

          {/* PrivateRoute ile korunan sayfalar */}
          <Route path="/" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/sim-cards" element={
            <PrivateRoute>
              <SimCards />
            </PrivateRoute>
          } />
          <Route path="/customers" element={
            <PrivateRoute>
              <Customers />
            </PrivateRoute>
          } />
          <Route path="/hat-yonetim" element={
            <PrivateRoute>
              <HatYonetim />
            </PrivateRoute>
          } />
          <Route path="/hat-tahsisi" element={
            <PrivateRoute>
              <HatTahsisForm />
            </PrivateRoute>
          } />


//iade deneme

<Route path="/returned-simcards" element={
  <PrivateRoute>
    <ReturnedSimCards />
  </PrivateRoute>
} />
        </Routes>
      </div>
    </BrowserRouter>
    );
  }
  
  export default App;