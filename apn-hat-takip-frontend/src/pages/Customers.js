import React, { useEffect, useState } from "react";
import { getCustomers } from "../services/api";

function Customers() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    getCustomers().then(setCustomers);
  }, []);

  return (
    <div>
      <h2>Müşteriler</h2>
      <table>
        <thead>
          <tr>
            <th>Firma</th>
            <th>Yetkili</th>
            <th>Telefon</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(c => (
            <tr key={c.id}>
              <td>{c.company_name}</td>
              <td>{c.contact_person}</td>
              <td>{c.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Customers;