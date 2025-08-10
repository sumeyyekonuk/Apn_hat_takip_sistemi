import React, { useEffect, useState } from 'react';
import { getSimCards } from '../services/api';  // Backend API çağrısı

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

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div>Hata: {error}</div>;

  return (
    <div>
      <h2>Hat Yönetimi</h2>
      <table border="1" cellPadding="5" cellSpacing="0">
        <thead>
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
          {simCards.map(sim => (
            <tr key={sim.id}>
              <td>{sim.phone_number}</td>
              <td>{sim.Package?.Operator?.name || '-'}</td>
              <td>{sim.Package?.name || '-'}</td>
              <td>{sim.status}</td>
              <td>{sim.ip_address || '-'}</td>
              <td>{sim.has_static_ip ? 'Evet' : 'Hayır'}</td>
              <td>{sim.purchase_date || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default HatYonetim;
