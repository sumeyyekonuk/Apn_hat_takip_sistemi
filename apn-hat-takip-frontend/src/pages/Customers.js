import React, { useEffect, useState } from "react";
import {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerAllocations,
  getSimCards,
} from "../services/api";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [simCards, setSimCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({
    company_name: "",
    contact_person: "",
    phone: "",
    email: "",
    address: "",
    type: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [openDetails, setOpenDetails] = useState(null);
  const [allocations, setAllocations] = useState({});
  const [balances, setBalances] = useState({});

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [custs, sims] = await Promise.all([getCustomers(), getSimCards()]);
      setCustomers(custs);
      setSimCards(sims);

      const initialAllocations = {};
      const initialBalances = {};
      custs.forEach(c => {
        initialAllocations[c.id] = [];
        initialBalances[c.id] = 0;
      });
      setAllocations(initialAllocations);
      setBalances(initialBalances);

      setLoading(false);
    } catch (err) {
      setError(err.message || "Bir hata oluştu");
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingCustomer) {
      updateCustomer(editingCustomer.id, formData).then(() => {
        loadInitialData();
        closeModal();
      });
    } else {
      createCustomer(formData).then(() => {
        loadInitialData();
        closeModal();
      });
    }
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setFormData({
      company_name: customer.company_name,
      contact_person: customer.contact_person,
      phone: customer.phone,
      email: customer.email || "",
      address: customer.address || "",
      type: customer.type || "",
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bu müşteriyi silmek istediğinize emin misiniz?")) {
      deleteCustomer(id).then(() => loadInitialData());
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCustomer(null);
    setFormData({
      company_name: "",
      contact_person: "",
      phone: "",
      email: "",
      address: "",
      type: "",
    });
  };

  const filteredCustomers = customers.filter(c => {
    const matchesSearch =
      c.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.contact_person &&
        c.contact_person.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType ? c.type === filterType : true;
    return matchesSearch && matchesType;
  });

  const toggleDetails = async (customerId) => {
    if (openDetails === customerId) {
      setOpenDetails(null);
      return;
    }
    setOpenDetails(customerId);

    try {
      const data = await getCustomerAllocations(customerId);

      // Sadece bu müşteriye ait tahsisleri filtrele
      const customerAllocations = data.filter(a => a.customer_id === customerId);

      setAllocations(prev => ({ ...prev, [customerId]: customerAllocations }));

      const balance = customerAllocations.reduce((acc, item) => {
        if (item.status === "aktif") return acc + 1;
        if (item.status === "iade") return acc - 1;
        return acc;
      }, 0);
      setBalances(prev => ({ ...prev, [customerId]: balance }));
    } catch (err) {
      console.error("Tahsis alınamadı:", err);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-info" role="status"></div>
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
          className="card-header text-white d-flex justify-content-between align-items-center"
          style={{
            background: "linear-gradient(90deg, #5bc0de 0%, #31b0d5 100%)",
            fontWeight: "600",
            fontSize: "1.25rem",
          }}
        >
          🏢 Müşteriler
          <button className="btn btn-light btn-sm" onClick={() => setShowModal(true)}>
            + Yeni Müşteri/Bayi
          </button>
        </div>
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-6 mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="Firma veya Yetkili ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-3 mb-2">
              <select
                className="form-select"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="">Tümü</option>
                <option value="musteri">Müşteri</option>
                <option value="bayi">Bayi</option>
              </select>
            </div>
          </div>

          <table className="table table-hover mb-0">
            <thead style={{ backgroundColor: "#e3f2fd" }} className="text-info">
              <tr>
                <th>Firma</th>
                <th>Yetkili</th>
                <th>Telefon</th>
                <th>Email</th>
                <th>Adres</th>
                <th>Tip</th>
                <th>Bakiye</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center text-muted py-4">
                    Müşteri/Bayi bulunamadı.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => (
                  <React.Fragment key={c.id}>
                    <tr>
                      <td className="fw-bold">{c.company_name || "-"}</td>
                      <td>{c.contact_person || "-"}</td>
                      <td>{c.phone || "-"}</td>
                      <td>{c.email || "-"}</td>
                      <td>{c.address || "-"}</td>
                      <td>{c.type || "-"}</td>
                      <td>{balances[c.id] || 0}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-info me-2"
                          onClick={() => toggleDetails(c.id)}
                        >
                          {openDetails === c.id ? "Gizle" : "Detay"}
                        </button>
                        <button
                          className="btn btn-sm btn-warning me-2"
                          onClick={() => handleEdit(c)}
                        >
                          Düzenle
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(c.id)}
                        >
                          Sil
                        </button>
                      </td>
                    </tr>
                    {openDetails === c.id && (
                      <tr>
                        <td colSpan="8" className="p-3 bg-light">
                          <h6>Tahsis Geçmişi:</h6>
                          {allocations[c.id].length === 0 ? (
                            <p>Henüz tahsis yok.</p>
                          ) : (
                            <table className="table table-sm">
                              <thead>
                                <tr>
                                  <th>ID</th>
                                  <th>Sim Kart</th>
                                  <th>Miktar</th>
                                  <th>Tarih</th>
                                  <th>Durum</th>
                                </tr>
                              </thead>
                              <tbody>
                                {allocations[c.id].map((a) => (
                                  <tr key={a.id}>
                                    <td>{a.id}</td>
                                    <td>{simCards.find(s => s.id === a.sim_card_id)?.phone_number || "-"}</td>
                                    <td>1</td>
                                    <td>{new Date(a.allocation_date).toLocaleDateString()}</td>
                                    <td>{a.status}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">
                    {editingCustomer ? "Müşteri/Bayi Düzenle" : "Yeni Müşteri/Bayi"}
                  </h5>
                  <button type="button" className="btn-close" onClick={closeModal}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Firma Adı</label>
                    <input
                      type="text"
                      className="form-control"
                      name="company_name"
                      value={formData.company_name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Yetkili</label>
                    <input
                      type="text"
                      className="form-control"
                      name="contact_person"
                      value={formData.contact_person}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Telefon</label>
                    <input
                      type="text"
                      className="form-control"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Adres</label>
                    <input
                      type="text"
                      className="form-control"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Tip</label>
                    <select
                      className="form-select"
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Seçiniz</option>
                      <option value="musteri">Müşteri</option>
                      <option value="bayi">Bayi</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeModal}>
                    Kapat
                  </button>
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

export default Customers;
