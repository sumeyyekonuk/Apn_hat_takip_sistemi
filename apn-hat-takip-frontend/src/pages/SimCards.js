import React, { useEffect, useState } from "react";
import { getSimCards } from "../services/api";

function SimCards() {
  const [simCards, setSimCards] = useState([]);

  useEffect(() => {
    getSimCards('stok')
      .then(setSimCards)
      .catch(err => console.error("Sim kartlar çekilirken hata:", err));
  }, []);

  return (
    <div>
      <h2>Hatlar (Stokta Olanlar)</h2>
      <table>
        <thead>
          <tr>
            <th>Numara</th>
            <th>Durum</th>
            <th>Paket</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {simCards.map(card => (
            <tr key={card.id}>
              <td>{card.phone_number}</td>
              <td>{card.status}</td>
              <td>{card.Package ? card.Package.name : '-'}</td>
              <td>
                {/* Buraya detay, düzenle, sil butonları ekleyebilirsiniz */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SimCards;
