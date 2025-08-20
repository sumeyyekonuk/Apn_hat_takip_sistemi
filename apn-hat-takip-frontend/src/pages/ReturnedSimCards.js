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
  const [returnedCards, setReturnedCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReasons, setSelectedReasons] = useState({});
  const [otherReasons, setOtherReasons] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setError("Lütfen giriş yapın.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const activeRes = await axios.get(
          "http://localhost:5000/api/allocations?status=aktif",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const returnedRes = await axios.get(
          "http://localhost:5000/api/allocations/returns",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Aktif listeden iade edilmiş olanları çıkar
        const activeFiltered = activeRes.data.filter(
          (a) => !returnedRes.data.some((r) => r.id === a.id)
        );

        setActiveCards(activeFiltered);
        setReturnedCards(returnedRes.data);
      } catch (err) {
        console.error(err);
        setError("Veriler çekilemedi.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  // --- Hat iade et ---
  const handleReturn = async (allocation) => {
    let reason = selectedReasons[allocation.id];
    if (reason === "Diğer") {
      reason = otherReasons[allocation.id]?.trim();
    }

    if (!reason) return alert("Lütfen iade nedeni seçin veya girin.");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/allocations/return",
        { allocationId: allocation.id, return_reason: reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 200) {
        setActiveCards((prev) => prev.filter((card) => card.id !== allocation.id));
        setReturnedCards((prev) => [...prev, res.data.allocation]);

        setSelectedReasons((prev) => ({ ...prev, [allocation.id]: "" }));
        setOtherReasons((prev) => ({ ...prev, [allocation.id]: "" }));
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "İade işlemi sırasında hata oluştu.");
    }
  };

  // --- İade edilmiş hattı tekrar aktif et ---
  const handleActivate = async (allocation) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/allocations/${allocation.id}`,
        { status: "aktif" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 200) {
        setReturnedCards((prev) =>
          prev.filter((card) => card.id !== allocation.id)
        );
        setActiveCards((prev) => [...prev, res.data]);
      }
    } catch (err) {
      console.error(err);
      alert("Hat tekrar aktif edilirken hata oluştu.");
    }
  };

  const filteredActive = activeCards.filter(
    (card) =>
      card.SimCard?.phone_number?.includes(searchTerm) ||
      card.Customer?.company_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const filteredReturned = returnedCards.filter(
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
          Aktif Hatlar
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
              {filteredActive.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center text-muted py-4">
                    Aktif hat bulunamadı.
                  </td>
                </tr>
              ) : (
                filteredActive.map((card) => (
                  <tr key={card.id} style={{ cursor: "default" }}>
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
                          <option key={r} value={r}>{r}</option>
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
                        onClick={() => handleReturn(card)}
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

      {/* İade Edilmiş Hatlar */}
      <div className="card shadow-sm rounded">
        <div
          className="card-header text-white"
          style={{
            background: "linear-gradient(90deg, #5cb85c 0%, #4cae4c 100%)",
            fontWeight: 600,
            fontSize: "1.25rem",
          }}
        >
          İade Edilmiş Hatlar
        </div>
        <div className="card-body">
          {filteredReturned.length === 0 ? (
            <div className="text-center text-muted py-4">
              İade edilmiş hat bulunamadı.
            </div>
          ) : (
            <table className="table table-hover mb-0">
              <thead className="text-success" style={{ backgroundColor: "#dff0d8" }}>
                <tr>
                  <th>Numara</th>
                  <th>Müşteri / Bayi</th>
                  <th>İade Nedeni</th>
                  <th>İade Tarihi</th>
                  <th>İşlem</th>
                </tr>
              </thead>
              <tbody>
                {filteredReturned.map((card) => (
                  <tr key={card.id} style={{ cursor: "default" }}>
                    <td>{card.SimCard?.phone_number || "-"}</td>
                    <td>{card.Customer?.company_name || "-"}</td>
                    <td>{card.return_reason || "-"}</td>
                    <td>{card.returned_at ? new Date(card.returned_at).toLocaleDateString() : "-"}</td>
                    <td>
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => handleActivate(card)}
                      >
                        Tekrar Aktif Et
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReturnedSimCards;
