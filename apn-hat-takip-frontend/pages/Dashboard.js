import React, { useEffect, useState } from "react";
import { getSimCards } from "../services/api";

function Dashboard() {
  const [simCards, setSimCards] = useState([]);

  useEffect(() => {
    getSimCards().then(setSimCards);
  }, []);

  const aktifHat = simCards.filter(card => card.status === "aktif").length;
  const stokHat = simCards.filter(card => card.status === "stok").length;

  return (
    <div>
      <h1>Dashboard</h1>
      <div>
        <div>Toplam Hat: {simCards.length}</div>
        <div>Aktif Hat: {aktifHat}</div>
        <div>Stokta Hat: {stokHat}</div>
      </div>
      {/* Grafik ve son işlemler için Chart.js veya başka bir kütüphane ekleyebilirsiniz */}
    </div>
  );
}

export default Dashboard;