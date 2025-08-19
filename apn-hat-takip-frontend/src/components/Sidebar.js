import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="sidebar">
      <h3>APN Sistem</h3>
      <nav>
        <ul>
          <li><NavLink to="/" end className={({ isActive }) => isActive ? "active" : ""}>Ana Sayfa</NavLink></li>
          <li><NavLink to="/sim-cards" className={({ isActive }) => isActive ? "active" : ""}>Sim Kartlar</NavLink></li>
          <li><NavLink to="/customers" className={({ isActive }) => isActive ? "active" : ""}>Müşteri Yönetimi</NavLink></li>
          <li><NavLink to="/hat-yonetim" className={({ isActive }) => isActive ? "active" : ""}>Hat Yönetimi</NavLink></li>
          <li><NavLink to="/hat-tahsisi" className={({ isActive }) => isActive ? "active" : ""}>Hat Tahsisi</NavLink></li>
          <li><NavLink to="/returned-simcards" className={({ isActive }) => isActive ? "active" : ""}>İade İşlemleri</NavLink></li>
        </ul>
      </nav>

      <hr />
      <button onClick={handleLogout} className="logout-btn">
        Çıkış Yap
      </button>
    </div>
  );
}

export default Sidebar;