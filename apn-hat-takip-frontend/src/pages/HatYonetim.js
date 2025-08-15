import React, { useEffect, useState } from "react";
import {
  getSimCards,
  createSimCard,
  updateSimCard,
  deleteSimCard,
} from "../services/api";

function HatYonetim() {
  const [simCards, setSimCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingSim, setEditingSim] = useState(null);
  const [formData, setFormData] = useState({
    phone_number: "",
    package_id: "",
    status: "stok",
    ip_address: "",
    has_static_ip: false,
    operator_id: "",
    is_reallocated: false,
    purchase_date: "",
  });

  useEffect(() => {
    loadSimCards();
  }, []);

  const loadSimCards = async () => {
    setLoading(true);
    try {
      const sims = await getSimCards();
      setSimCards(sims);
      setLoading(false);
    } catch (err) {
      setError(err.message || "Bir hata oluştu");
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError("");

    // Backend için zorunlu alanları kontrol et
    if (!formData.phone_number || !formData.package_id || !formData.operator_id) {
      setFormError("Telefon, Package ID ve Operator ID zorunludur.");
      return;
    }

    const payload = {
      ...formData,
      package_id: Number(formData.package_id),
      operator_id: Number(formData.operator_id),
    };

    if (editingSim) {
      updateSimCard(editingSim.id, payload)
        .then(() => {
          loadSimCards();
          closeModal();
        })
        .catch((err) => setFormError(err.message));
    } else {
      createSimCard(payload)
        .then(() => {
          loadSimCards();
          closeModal();
        })
        .catch((err) => setFormError(err.message));
    }
  };

  const handleEdit = (sim) => {
    setEditingSim(sim);
    setFormData({
      phone_number: sim.phone_number,
      package_id: sim.package_id,
      status: sim.status,
      ip_address: sim.ip_address || "",
      has_static_ip: sim.has_static_ip,
      operator_id: sim.operator_id || "",
      is_reallocated: sim.is_reallocated,
      purchase_date: sim.purchase_date || "",
    });
    setFormError("");
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bu hattı silmek istediğinize emin misiniz?")) {
      deleteSimCard(id).then(() => loadSimCards());
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingSim(null);
    setFormError("");
    setFormData({
      phone_number: "",
      package_id: "",
      status: "stok",
      ip_address: "",
      has_static_ip: false,
      operator_id: "",
      is_reallocated: false,
      purchase_date: "",
    });
  };

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-4">
      <div className="card shadow rounded">
        <div className="card-header d-flex justify-content-between align-items-center bg-info text-white">
          <span>📱 Sim Kart Yönetimi</span>
          <button className="btn btn-light btn-sm" onClick={() => setShowModal(true)}>+ Yeni Hat</button>
        </div>
        <div className="card-body">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Telefon</th>
                <th>Durum</th>
                <th>IP Adresi</th>
                <th>Statik IP</th>
                <th>Operator</th>
                <th>Yeniden Tahsis</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {simCards.map((sim) => (
                <tr key={sim.id}>
                  <td>{sim.id}</td>
                  <td>{sim.phone_number}</td>
                  <td>{sim.status}</td>
                  <td>{sim.ip_address || "-"}</td>
                  <td>{sim.has_static_ip ? "Evet" : "Hayır"}</td>
                  <td>{sim.operator_id || "-"}</td>
                  <td>{sim.is_reallocated ? "Evet" : "Hayır"}</td>
                  <td>
                    <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(sim)}>Düzenle</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(sim.id)}>Sil</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">{editingSim ? "Hat Düzenle" : "Yeni Hat"}</h5>
                  <button type="button" className="btn-close" onClick={closeModal}></button>
                </div>
                <div className="modal-body">
                  {formError && <div className="alert alert-danger">{formError}</div>}
                  <div className="mb-3">
                    <label className="form-label">Telefon Numarası</label>
                    <input
                      type="text"
                      className="form-control"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleChange}
                      placeholder="Telefon numarası"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Package ID</label>
                    <input type="number" className="form-control" name="package_id" value={formData.package_id} onChange={handleChange} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Durum</label>
                    <select className="form-select" name="status" value={formData.status} onChange={handleChange}>
                      <option value="stok">Stok</option>
                      <option value="aktif">Aktif</option>
                      <option value="iptal">İptal</option>
                      <option value="iade">İade</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">IP Adresi</label>
                    <input type="text" className="form-control" name="ip_address" value={formData.ip_address} onChange={handleChange} />
                  </div>
                  <div className="form-check mb-3">
                    <input type="checkbox" className="form-check-input" name="has_static_ip" checked={formData.has_static_ip} onChange={handleChange} />
                    <label className="form-check-label">Statik IP</label>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Operator ID</label>
                    <input type="number" className="form-control" name="operator_id" value={formData.operator_id} onChange={handleChange} />
                  </div>
                  <div className="form-check mb-3">
                    <input type="checkbox" className="form-check-input" name="is_reallocated" checked={formData.is_reallocated} onChange={handleChange} />
                    <label className="form-check-label">Yeniden Tahsis Edildi</label>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Satın Alma Tarihi</label>
                    <input type="date" className="form-control" name="purchase_date" value={formData.purchase_date} onChange={handleChange} />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeModal}>Kapat</button>
                  <button type="submit" className="btn btn-primary">Kaydet</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HatYonetim;
