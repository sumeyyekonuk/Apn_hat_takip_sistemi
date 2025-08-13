import React, { useEffect, useState } from "react";
import { getCustomers } from "../services/api";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getCustomers()
      .then((data) => {
        setCustomers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Bir hata oluştu");
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
          🏢 Müşteriler
        </div>
        <div className="card-body p-0">
          <table className="table table-hover mb-0">
            <thead style={{ backgroundColor: "#e3f2fd" }} className="text-info">
              <tr>
                <th>Firma</th>
                <th>Yetkili</th>
                <th>Telefon</th>
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center text-muted py-4">
                    Müşteri bulunamadı.
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr key={c.id}>
                    <td className="fw-bold">{c.company_name || "-"}</td>
                    <td>{c.contact_person || "-"}</td>
                    <td>{c.phone || "-"}</td>
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

export default Customers;