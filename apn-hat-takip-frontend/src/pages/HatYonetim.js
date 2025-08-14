import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { getSimCards, getOperators, getPackages } from '../services/api';

function HatYonetim() {
  const [simCards, setSimCards] = useState([]);
  const [operators, setOperators] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingSim, setEditingSim] = useState(null);
  const [newSim, setNewSim] = useState({
    operator_id: '',
    phone_number: '',
    package_id: '',
    capacity: '',
    price: '',
    ip_address: '',
    has_static_ip: false
  });

  useEffect(() => {
    fetchSimCards();
    fetchOperatorsAndPackages();
  }, []);

  const fetchSimCards = () => {
    setLoading(true);
    getSimCards()
      .then(data => { setSimCards(data); setLoading(false); })
      .catch(err => { setError(err.message || 'Bir hata oluştu'); setLoading(false); });
  };

  const fetchOperatorsAndPackages = async () => {
    try {
      const [ops, pkgs] = await Promise.all([getOperators(), getPackages()]);
      setOperators(ops);
      setPackages(pkgs);
    } catch (err) {
      console.error('Operatör/Paket yükleme hatası:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewSim(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleAddSim = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/sim-cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSim)
      });
      const data = await res.json();
      setSimCards(prev => [...prev, data]);
      setNewSim({ operator_id: '', phone_number: '', package_id: '', capacity: '', price: '', ip_address: '', has_static_ip: false });
      alert('Hat başarıyla eklendi!');
    } catch (err) {
      alert('Hata: ' + err.message);
    }
  };

  const handleEditSim = (sim) => {
    setEditingSim(sim);
    setNewSim({
      operator_id: sim.operator_id || '',
      phone_number: sim.phone_number || '',
      package_id: sim.package_id || '',
      capacity: sim.capacity || '',
      price: sim.price || '',
      ip_address: sim.ip_address || '',
      has_static_ip: sim.has_static_ip || false
    });
  };

  const handleUpdateSim = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/api/sim-cards/${editingSim.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSim)
      });
      const data = await res.json();
      setSimCards(prev => prev.map(s => s.id === data.id ? data : s));
      setEditingSim(null);
      setNewSim({ operator_id: '', phone_number: '', package_id: '', capacity: '', price: '', ip_address: '', has_static_ip: false });
      alert('Hat başarıyla güncellendi!');
    } catch (err) {
      alert('Hata: ' + err.message);
    }
  };

  const handleDeleteSim = async (id) => {
    if (!window.confirm('Bu hattı silmek istediğinize emin misiniz?')) return;
    try {
      await fetch(`http://localhost:5000/api/sim-cards/${id}`, { method: 'DELETE' });
      setSimCards(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      alert('Silme hatası: ' + err.message);
    }
  };

  const handleCsvUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const promises = results.data.map(row =>
            fetch('http://localhost:5000/api/sim-cards', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                operator_id: row.operator_id,
                phone_number: row.phone_number,
                package_id: row.package_id,
                capacity: row.capacity,
                price: row.price,
                ip_address: row.ip_address,
                has_static_ip: row.has_static_ip === 'true'
              })
            }).then(res => res.json())
          );
          const newEntries = await Promise.all(promises);
          setSimCards(prev => [...prev, ...newEntries]);
          alert('CSV başarıyla yüklendi!');
        } catch (err) {
          alert('CSV yükleme hatası: ' + err.message);
        }
      }
    });
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-info" role="status" /><span className="visually-hidden">Yükleniyor...</span></div>;
  if (error) return <div className="alert alert-danger mt-4">Hata: {error}</div>;

  return (
    <div className="container mt-4">
      <div className="card shadow rounded mb-3">
        <div className="card-header text-white" style={{ background: 'linear-gradient(90deg, #5bc0de 0%, #31b0d5 100%)', fontWeight: 600, fontSize: '1.25rem' }}>
          📡 Hat Yönetimi
        </div>
        <div className="card-body">

          {/* --- Hat Ekle / Düzenle Formu --- */}
          <form onSubmit={editingSim ? handleUpdateSim : handleAddSim} className="mb-3 border rounded p-3">
            <h5>{editingSim ? 'Hat Düzenle' : 'Yeni Hat Ekle'}</h5>
            
            <select name="operator_id" value={newSim.operator_id} onChange={handleChange} required>
              <option value="">Operatör seçin</option>
              {operators.map(op => <option key={`op-${op.id}`} value={op.id}>{op.name}</option>)}
            </select>

            <input name="phone_number" placeholder="Numara" value={newSim.phone_number} onChange={handleChange} required />

            <select name="package_id" value={newSim.package_id} onChange={handleChange} required>
              <option value="">Paket Tipi seçin</option>
              {packages.map(p => <option key={`pkg-${p.id}`} value={p.id}>{p.name}</option>)}
            </select>

            <input name="capacity" placeholder="Kapasite" value={newSim.capacity} onChange={handleChange} />
            <input name="price" placeholder="Fiyat" value={newSim.price} onChange={handleChange} />
            <input name="ip_address" placeholder="IP Adresi" value={newSim.ip_address} onChange={handleChange} />
            <label>
              <input type="checkbox" name="has_static_ip" checked={newSim.has_static_ip} onChange={handleChange} /> Statik IP
            </label>
            
            <button type="submit" className="btn btn-primary ms-2">{editingSim ? 'Güncelle' : 'Ekle'}</button>
            {editingSim && <button type="button" className="btn btn-secondary ms-2" onClick={() => { setEditingSim(null); setNewSim({ operator_id:'', phone_number:'', package_id:'', capacity:'', price:'', ip_address:'', has_static_ip:false }); }}>İptal</button>}
          </form>

          {/* --- CSV / Excel Yükleme --- */}
          <div className="mb-3">
            <label className="form-label">Toplu Hat Yükle (CSV/Excel)</label>
            <input type="file" accept=".csv" onChange={handleCsvUpload} />
          </div>

          {/* --- Hat Tablosu --- */}
          <table className="table table-hover">
            <thead style={{ backgroundColor: '#e3f2fd' }} className="text-info">
              <tr>
                <th>Operatör</th>
                <th>Numara</th>
                <th>Paket Tipi</th>
                <th>Kapasite</th>
                <th>Fiyat</th>
                <th>IP Adresi</th>
                <th>Statik IP</th>
                <th>Durum</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {simCards.length === 0 ? (
                <tr><td colSpan="9" className="text-center text-muted py-4">Hat bulunamadı.</td></tr>
              ) : (
                simCards.map(sim => (
                  <tr key={`sim-${sim.id}`}>
                    <td>{sim.Package?.Operator?.name || '-'}</td>
                    <td className="fw-bold">{sim.phone_number || '-'}</td>
                    <td>{sim.Package?.name || '-'}</td>
                    <td>{sim.capacity || sim.Package?.capacity || '-'}</td>
                    <td>{sim.price || sim.Package?.price || '-'}</td>
                    <td>{sim.ip_address || '-'}</td>
                    <td>{sim.has_static_ip ? '✅' : '❌'}</td>
                    <td>
                      <span className={`badge rounded-pill px-3 py-1 ${
                        sim.status === 'aktif' ? 'bg-info text-white' :
                        sim.status === 'stok' ? 'bg-secondary' :
                        sim.status === 'iptal' ? 'bg-danger text-white' :
                        sim.status === 'iade' ? 'bg-warning' : 'bg-secondary'
                      }`}>{sim.status}</span>
                    </td>
                    <td>
                      <button className="btn btn-sm btn-info me-1" onClick={() => handleEditSim(sim)}>✏️</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDeleteSim(sim.id)}>🗑️</button>
                    </td>
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
