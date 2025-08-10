import React, { useState, useEffect } from 'react';
import { getCustomers, getSimCards, createAllocation } from '../services/api'; // API çağrıları

function HatTahsisForm() {
  const [customers, setCustomers] = useState([]);
  const [simCards, setSimCards] = useState([]);
  const [form, setForm] = useState({
    customer_id: '',
    sim_card_id: '',
    ip_address: '',
    has_static_ip: false,
    installation_location: '',
    installation_notes: '',
    billing_type: 'aylik',
    allocation_date: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Müşteriler ve stoktaki hatları çek
    getCustomers().then(setCustomers).catch(console.error);
    getSimCards({ status: 'stok' }).then(setSimCards).catch(console.error);
  }, []);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await createAllocation(form);
      setSuccess('Tahsis işlemi başarılı!');
      // Formu temizle veya sayfayı yenile
      setForm({
        customer_id: '',
        sim_card_id: '',
        ip_address: '',
        has_static_ip: false,
        installation_location: '',
        installation_notes: '',
        billing_type: 'aylik',
        allocation_date: '',
      });
    } catch (err) {
      setError(err.message || 'Bir hata oluştu');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Hat Tahsis Formu</h2>

      <label>Müşteri/Bayi:</label>
      <select name="customer_id" value={form.customer_id} onChange={handleChange} required>
        <option value="">Seçiniz</option>
        {customers.map(c => (
          <option key={c.id} value={c.id}>{c.company_name || c.contact_person}</option>
        ))}
      </select>

      <label>Hat (Stokta Olan):</label>
      <select name="sim_card_id" value={form.sim_card_id} onChange={handleChange} required>
        <option value="">Seçiniz</option>
        {simCards.map(s => (
          <option key={s.id} value={s.id}>{s.phone_number}</option>
        ))}
      </select>

      <label>IP Adresi:</label>
      <input type="text" name="ip_address" value={form.ip_address} onChange={handleChange} />

      <label>
        <input type="checkbox" name="has_static_ip" checked={form.has_static_ip} onChange={handleChange} />
        Statik IP
      </label>

      <label>Kurulum Yeri:</label>
      <textarea name="installation_location" value={form.installation_location} onChange={handleChange} />

      <label>Kurulum Notları:</label>
      <textarea name="installation_notes" value={form.installation_notes} onChange={handleChange} />

      <label>Faturalandırma Tipi:</label>
      <label><input type="radio" name="billing_type" value="aylik" checked={form.billing_type === 'aylik'} onChange={handleChange} /> Aylık</label>
      <label><input type="radio" name="billing_type" value="yillik" checked={form.billing_type === 'yillik'} onChange={handleChange} /> Yıllık</label>

      <label>Tahsis Tarihi:</label>
      <input type="date" name="allocation_date" value={form.allocation_date} onChange={handleChange} required />

      <button type="submit">Tahsis Et</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </form>
  );
}

export default HatTahsisForm;
