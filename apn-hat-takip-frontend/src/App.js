import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import SimCards from "./pages/SimCards";
import Customers from "./pages/Customers";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/sim-cards" element={<SimCards />} />
        <Route path="/customers" element={<Customers />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
