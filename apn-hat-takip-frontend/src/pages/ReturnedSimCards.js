import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function ReturnedSimCards() {
  const [returnedCards, setReturnedCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token"); // login sonrası token'ı alıyoruz
    if (!token) {
      setError("Lütfen giriş yapın.");
      setLoading(false);
      return;
    }

    axios
      .get("http://localhost:5000/api/allocations/returns", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => setReturnedCards(response.data))
      .catch((err) => {
        console.error(err);
        if (err.response && err.response.status === 401) {
          setError("Token geçersiz. Lütfen tekrar giriş yapın.");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login";
        } else {
          setError("İade alınan hatlar çekilemedi.");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-info" role="status" />
        <div className="mt-2 text-info">Yükleniyor...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center mt-4">{error}</div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="card shadow-sm rounded">
        <div
          className="card-header text-white"
          style={{
            background: "linear-gradient(90deg, #5bc0de 0%, #31b0d5 100%)",
            fontWeight: 600,
            fontSize: "1.25rem",
          }}
        >
          İade Alınan Hatlar
        </div>
        <div className="card-body p-0">
          <table className="table table-hover mb-0">
            <thead className="text-info" style={{ backgroundColor: "#e3f2fd" }}>
              <tr>
                <th scope="col">Numara</th>
                <th scope="col">Müşteri / Bayi</th>
                <th scope="col">Durum</th>
                <th scope="col">Paket ID</th>
              </tr>
            </thead>
            <tbody>
              {returnedCards.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center text-muted py-4">
                    İade alınan hat bulunamadı.
                  </td>
                </tr>
              ) : (
                returnedCards.map((item) => (
                  <tr key={item.id} style={{ cursor: "default" }}>
                    <td>{item.SimCard?.phone_number || "-"}</td>
                    <td>{item.Customer?.company_name || "-"}</td>
                    <td>
                      <span
                        className={`badge rounded-pill px-3 py-1 ${
                          item.status === "iade"
                            ? "bg-info text-white"
                            : "bg-success text-white"
                        }`}
                      >
                        {item.status.toUpperCase()}
                      </span>
                    </td>
                    <td>{item.SimCard?.package_id || "-"}</td>
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
