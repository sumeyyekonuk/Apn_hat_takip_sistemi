import './App.css';
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import SimCards from "./pages/SimCards";
import Customers from "./pages/Customers";
import HatYonetim from "./pages/HatYonetim";
import HatTahsisForm from "./pages/HatTahsisForm";
import Login from "./pages/Login";
import ReturnedSimCards from "./pages/ReturnedSimCards";

// PrivateRoute bileşeni
function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Sidebar />
      <div style={{ marginLeft: 220, padding: "20px" }}>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={
            <PrivateRoute><Dashboard /></PrivateRoute>
          } />
          <Route path="/sim-cards" element={
            <PrivateRoute><SimCards /></PrivateRoute>
          } />
          <Route path="/customers" element={
            <PrivateRoute><Customers /></PrivateRoute>
          } />
          <Route path="/hat-yonetim" element={
            <PrivateRoute><HatYonetim /></PrivateRoute>
          } />
          <Route path="/hat-tahsisi" element={
            <PrivateRoute><HatTahsisForm /></PrivateRoute>
          } />
          <Route path="/returned-simcards" element={
            <PrivateRoute><ReturnedSimCards /></PrivateRoute>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
