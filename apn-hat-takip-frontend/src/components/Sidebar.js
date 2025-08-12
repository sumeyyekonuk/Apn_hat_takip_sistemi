import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">
      <h3>APN Sistem</h3>
      <nav>
        <ul>
          <li><NavLink to="/" end className={({ isActive }) => isActive ? "active" : ""}>Dashboard</NavLink></li>
          <li><NavLink to="/sim-cards" className={({ isActive }) => isActive ? "active" : ""}>Sim Kartlar</NavLink></li>
          <li><NavLink to="/customers" className={({ isActive }) => isActive ? "active" : ""}>Müşteriler</NavLink></li>
          <li><NavLink to="/hat-yonetim" className={({ isActive }) => isActive ? "active" : ""}>Hat Yönetim</NavLink></li>
          <li><NavLink to="/hat-tahsisi" className={({ isActive }) => isActive ? "active" : ""}>Hat Tahsisi</NavLink></li>
          <li><NavLink to="/returned-simcards" className={({ isActive }) => isActive ? "active" : ""}>İade Edilen Hatlar</NavLink></li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;
