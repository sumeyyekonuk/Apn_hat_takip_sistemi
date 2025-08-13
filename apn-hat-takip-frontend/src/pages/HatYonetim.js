import React, { useEffect, useState } from 'react';
import { getSimCards } from '../services/api';

function HatYonetim() {
  const [simCards, setSimCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getSimCards()
      .then(data => {
        setSimCards(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Bir hata oluştu');
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
            background: 'linear-gradient(90deg, #5bc0de 0%, #31b0d5 100%)',
            fontWeight: '600',
            fontSize: '1.25rem',
          }}
        >
          📡 Hat Yönetimi
        </div>
        <div className="card-body p-0">
          <table className="table table-hover mb-0">
            <thead style={{ backgroundColor: '#e3f2fd' }} className="text-info">
              <tr>
                <th>Numara</th>
                <th>Operatör</th>
                <th>Paket</th>
                <th>Durum</th>
                <th>IP Adresi</th>
                <th>Statik IP</th>
                <th>Satın Alma Tarihi</th>
              </tr>
            </thead>
            <tbody>
              {simCards.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center text-muted py-4">
                    Hat bulunamadı.
                  </td>
                </tr>
              ) : (
                simCards.map(sim => (
                  <tr key={sim.id}>
                    <td className="fw-bold">{sim.phone_number || '-'}</td>
                    <td>{sim.Package?.Operator?.name || '-'}</td>
                    <td>{sim.Package?.name || '-'}</td>
                    <td>
                      <span
                        className={`badge rounded-pill px-3 py-1 ${
                          sim.status === 'aktif' ? 'bg-info text-white' : 'bg-secondary'
                        }`}
                      >
                        {sim.status}
                      </span>
                    </td>
                    <td>{sim.ip_address || '-'}</td>
                    <td>{sim.has_static_ip ? '✅ Evet' : '❌ Hayır'}</td>
                    <td>{sim.purchase_date || '-'}</td>
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

export default HatYonetim;