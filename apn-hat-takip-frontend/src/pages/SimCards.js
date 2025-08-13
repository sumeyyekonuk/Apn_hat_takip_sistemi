import React, { useEffect, useState } from "react";
import { getSimCards } from "../services/api";

function SimCards() {
  const [simCards, setSimCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getSimCards('stok')
      .then((data) => {
        setSimCards(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Sim kartlar çekilirken bir hata oluştu");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-info" role="status" aria-hidden="true"></div>
        <span className="visually-hidden">Yükleniyor...</span>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger mt-4">Hata: {error}</div>;
  }

  return (
    <div className="container mt-4">
      <div className="card shadow rounded">
        <div
          className="card-header text-white"
          style={{
            background: "linear-gradient(90deg, #5bc0de 0%, #31b0d5 100%)",
            fontWeight: "600",
            fontSize: "1.25rem",
          }}
        >
          📱 Hatlar (Stokta Olanlar)
        </div>
        <div className="card-body p-0">
          <table className="table table-hover mb-0">
            <thead style={{ backgroundColor: "#e3f2fd" }} className="text-info">
              <tr>
                <th>Numara</th>
                <th>Durum</th>
                <th>Paket</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {simCards.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center text-muted py-4">
                    Sim kart bulunamadı.
                  </td>
                </tr>
              ) : (
                simCards.map((card) => (
                  <tr key={card.id}>
                    <td className="fw-bold">{card.phone_number || "-"}</td>
                    <td>{card.status || "-"}</td>
                    <td>{card.Package ? card.Package.name : "-"}</td>
                    <td>
                      {/* Detay, düzenle, sil butonlarını buraya ekleyebilirsiniz */}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default SimCards;