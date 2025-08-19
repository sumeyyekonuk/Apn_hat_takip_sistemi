import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const reasons = [
  "Müşteri talebi",
  "Hatalı işlem",
  "Teknik arıza",
  "Sözleşme iptali",
  "Kampanya değişikliği",
  "Diğer",
];

function ReturnedSimCards() {
  const [activeCards, setActiveCards] = useState([]);
  const [returnedCards, setReturnedCards] = useState([]); // ✅ iade edilenler
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReasons, setSelectedReasons] = useState({});
  const [otherReasons, setOtherReasons] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const token = localStorage.getItem("token");

  // Aktif hatları çek
  useEffect(() => {
    if (!token) {
      setError("Lütfen giriş yapın.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const [activeRes, returnedRes] = await Promise.all([
          axios.get("http://localhost:5000/api/allocations?status=aktif", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/allocations?status=stok", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setActiveCards(activeRes.data);
        setReturnedCards(returnedRes.data);
      } catch (err) {
        console.error(err);
        setError("Hatlar çekilemedi.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleReturn = async (id) => {
    let reason = selectedReasons[id];
    if (reason === "Diğer") {
      reason = otherReasons[id]?.trim();
    }

    if (!reason) {
      return alert("Lütfen iade nedeni seçin veya girin.");
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/allocations/return",
        { allocationId: id, return_reason: reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 200) {
        // Aktif listeden çıkar
        setActiveCards((prev) => prev.filter((card) => card.id !== id));
        // İade listesine ekle
        setReturnedCards((prev) => [...prev, res.data]);

        setSelectedReasons((prev) => ({ ...prev, [id]: "" }));
        setOtherReasons((prev) => ({ ...prev, [id]: "" }));
        alert("Tahsis iade edildi!");
      }
    } catch (err) {
      console.error(err);
      if (err.response?.data?.error) {
        alert("Hata: " + err.response.data.error);
      } else {
        alert("İade işlemi sırasında hata oluştu.");
      }
    }
  };

  const filteredCards = activeCards.filter(
    (card) =>
      card.SimCard?.phone_number?.includes(searchTerm) ||
      card.Customer?.company_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-info" role="status" />
        <div className="mt-2 text-info">Yükleniyor...</div>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger text-center mt-4">{error}</div>;
  }

  return (
    <div className="container mt-4">
      {/* Aktif Hatlar */}
      <div className="card shadow-sm rounded mb-4">
        <div
          className="card-header text-white"
          style={{
            background: "linear-gradient(90deg, #5bc0de 0%, #31b0d5 100%)",
            fontWeight: 600,
            fontSize: "1.25rem",
          }}
        >
          Aktif Hatlar (İade İçin)
        </div>
        <div className="card-body">
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Numara veya müşteri/bayi ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <table className="table table-hover mb-0">
            <thead className="text-info" style={{ backgroundColor: "#e3f2fd" }}>
              <tr>
                <th>Numara</th>
                <th>Müşteri / Bayi</th>
                <th>İade Nedeni</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {filteredCards.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center text-muted py-4">
                    Aktif hat bulunamadı.
                  </td>
                </tr>
              ) : (
                filteredCards.map((card) => (
                  <tr key={card.id}>
                    <td>{card.SimCard?.phone_number || "-"}</td>
                    <td>{card.Customer?.company_name || "-"}</td>
                    <td>
                      <select
                        className="form-select"
                        value={selectedReasons[card.id] || ""}
                        onChange={(e) =>
                          setSelectedReasons({
                            ...selectedReasons,
                            [card.id]: e.target.value,
                          })
                        }
                      >
                        <option value="">Seçiniz</option>
                        {reasons.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                      {selectedReasons[card.id] === "Diğer" && (
                        <input
                          type="text"
                          className="form-control mt-2"
                          placeholder="Sebebi girin"
                          value={otherReasons[card.id] || ""}
                          onChange={(e) =>
                            setOtherReasons({
                              ...otherReasons,
                              [card.id]: e.target.value,
                            })
                          }
                        />
                      )}
                    </td>
                    <td>
                      <button
                        className="btn btn-info btn-sm"
                        onClick={() => handleReturn(card.id)}
                      >
                        İade Et
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* İade Edilen Hatlar */}
      <div className="card shadow-sm rounded">
        <div
          className="card-header text-white"
          style={{
            background: "linear-gradient(90deg, #6c757d 0%, #495057 100%)",
            fontWeight: 600,
            fontSize: "1.25rem",
          }}
        >
          İade Edilen Hatlar
        </div>
        <div className="card-body">
          <table className="table table-hover mb-0">
            <thead className="text-secondary" style={{ backgroundColor: "#f8f9fa" }}>
              <tr>
                <th>Numara</th>
                <th>Müşteri / Bayi</th>
                <th>Durum</th>
              </tr>
            </thead>
            <tbody>
              {returnedCards.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center text-muted py-4">
                    Henüz iade edilen hat yok.
                  </td>
                </tr>
              ) : (
                returnedCards.map((card) => (
                  <tr key={card.id}>
                    <td>{card.SimCard?.phone_number || "-"}</td>
                    <td>{card.Customer?.company_name || "-"}</td>
                    <td>
                      <span className="badge bg-secondary">
                        {card.SimCard?.status || "stok"}
                      </span>
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

export default ReturnedSimCards;
