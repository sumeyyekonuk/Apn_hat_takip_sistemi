
// src/pages/ReturnedSimCards.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ReturnedSimCards() {
  const [returnedCards, setReturnedCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/allocations/returns')
      .then(response => {
        console.log("API'den gelen iade verisi:", response.data); // debug: mutlaka kontrol et
        setReturnedCards(response.data);
      })
      .catch(error => {
        console.error('İade alınan hatlar çekilemedi:', error);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Yükleniyor...</p>;

  return (
    <div>
      <h2>İade Alınan Hatlar</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Numara</th>
            <th>Müşteri / Bayi</th>
            <th>Durum</th>
            <th>Paket ID</th>
          </tr>
        </thead>
        <tbody>
          {returnedCards.length === 0 ? (
            <tr><td colSpan="4">İade alınan hat bulunamadı.</td></tr>
          ) : (
            returnedCards.map(item => (
              <tr key={item.id}>
                <td>{item.SimCard?.phone_number || '-'}</td>
                <td>{item.Customer?.company_name || '-'}</td>
                <td>{item.status}</td>
                <td>{item.SimCard?.package_id || '-'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ReturnedSimCards;