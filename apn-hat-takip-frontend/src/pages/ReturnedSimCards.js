import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function ReturnedSimCards() {
  const [returnedCards, setReturnedCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/allocations/returns")
      .then((response) => {
        setReturnedCards(response.data);
      })
      .catch((error) => {
        console.error("İade alınan hatlar çekilemedi:", error);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div
          className="spinner-border text-info"
          role="status"
          aria-hidden="true"
        ></div>
        <span className="visually-hidden">Yükleniyor...</span>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="card shadow rounded">
        <div
          className="card-header text-white"
          style={{
            background:
              "linear-gradient(90deg, #5bc0de 0%, #31b0d5 100%)", // Açık mavi degrade
            fontWeight: "600",
            fontSize: "1.25rem",
          }}
        >
          İade Alınan Hatlar
        </div>
        <div className="card-body p-0">
          <table className="table table-hover mb-0">
            <thead
              style={{ backgroundColor: "#e3f2fd" }} // Çok açık mavi
              className="text-info"
            >
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
                  <td
                    colSpan="4"
                    className="text-center text-muted py-4"
                  >
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
                        className={`badge ${
                          item.status === "iade"
                            ? "bg-info text-white"
                            : "bg-success"
                        } rounded-pill px-3 py-1`}
                      >
                        {item.status}
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