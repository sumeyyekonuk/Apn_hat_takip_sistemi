import React, { useEffect, useState } from "react";
// API’den sim kart ve tahsis verilerini çekmek için fonksiyonlar
import { getSimCards, getAllocations } from "../services/api";

function Dashboard() {
  // State’ler - backend’den gelen veriler burada saklanacak
  const [simCards, setSimCards] = useState([]);
  const [allocations, setAllocations] = useState([]);

  // Component mount olunca verileri çek
  useEffect(() => {
    getSimCards().then(setSimCards).catch(console.error);
    getAllocations().then(setAllocations).catch(console.error);
  }, []);

  // Aktif ve stokta bekleyen hat sayısını hesapla
  const aktifHat = simCards.filter(card => card.status === "aktif").length;
  const stokHat = simCards.filter(card => card.status === "stok").length;

  // Bu ay tahsis edilen hatların sayısı
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  const thisMonthAllocations = allocations.filter(allocation => {
    const date = new Date(allocation.allocation_date);
    return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
  });

  return (
    <div className="container mt-4">
      <h1>Dashboard</h1>

      {/* Özet Kartlar */}
      <div className="row">
        {/* Toplam Hat */}
        <div className="col-md-3 mb-3">
          <div className="card text-white bg-primary">
            <div className="card-body">
              <h5 className="card-title">Toplam Hat</h5>
              <p className="card-text fs-3">{simCards.length}</p>
            </div>
          </div>
        </div>

        {/* Aktif Hatlar */}
        <div className="col-md-3 mb-3">
          <div className="card text-white bg-success">
            <div className="card-body">
              <h5 className="card-title">Aktif Hatlar</h5>
              <p className="card-text fs-3">{aktifHat}</p>
            </div>
          </div>
        </div>

        {/* Stokta Bekleyen Hatlar */}
        <div className="col-md-3 mb-3">
          <div className="card text-white bg-warning">
            <div className="card-body">
              <h5 className="card-title">Stokta Bekleyen Hatlar</h5>
              <p className="card-text fs-3">{stokHat}</p>
            </div>
          </div>
        </div>

        {/* Bu Ay Tahsis Edilenler */}
        <div className="col-md-3 mb-3">
          <div className="card text-white bg-info">
            <div className="card-body">
              <h5 className="card-title">Bu Ay Tahsis Edilenler</h5>
              <p className="card-text fs-3">{thisMonthAllocations.length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
