import React, { useState, useEffect } from "react";
import { getCustomers, getSimCards, createAllocation } from "../services/api";
import "bootstrap/dist/css/bootstrap.min.css";

function HatTahsisForm() {
  const [customers, setCustomers] = useState([]);
  const [simCards, setSimCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    customer_id: "",
    sim_card_id: "",
    ip_address: "",
    has_static_ip: false,
    installation_location: "",
    installation_notes: "",
    billing_type: "aylik",
    allocation_date: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const customersData = await getCustomers();
        const simData = await getSimCards("stok"); // Sadece stoktaki sim kartları al
        setCustomers(customersData || []);
        setSimCards(simData || []);
      } catch (err) {
        setError("Veri yüklenirken hata oluştu.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.customer_id || !form.sim_card_id || !form.allocation_date) {
      setError("Lütfen tüm zorunlu alanları doldurun.");
      return;
    }

    try {
      setSubmitting(true);
      await createAllocation({
        ...form,
        customer_id: Number(form.customer_id),
        sim_card_id: Number(form.sim_card_id),
      });
      setSuccess("Tahsis işlemi başarılı!");
      setForm({
        customer_id: "",
        sim_card_id: "",
        ip_address: "",
        has_static_ip: false,
        installation_location: "",
        installation_notes: "",
        billing_type: "aylik",
        allocation_date: "",
      });
    } catch (err) {
      setError("Tahsis sırasında hata oluştu.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-info"></div>
      </div>
    );
  }

  return (
    <div
      className="container-fluid py-4"
      style={{ backgroundColor: "#000", minHeight: "100vh" }}
    >
      <div
        className="mx-auto"
        style={{
          backgroundColor: "#000",
          border: "3px solid #ADD8E6",
          borderRadius: "12px",
          padding: "25px",
          color: "white",
          maxWidth: "1200px",
        }}
      >
        <h3 className="text-center mb-4" style={{ color: "#ADD8E6" }}>
          📡 Hat Tahsis Formu
        </h3>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="col-md-6">
            <label className="form-label">
              Müşteri / Bayi <span style={{ color: "red" }}>*</span>
            </label>
            <select
              className="form-select bg-dark text-white"
              style={{ border: "1px solid #ADD8E6" }}
              name="customer_id"
              value={form.customer_id}
              onChange={handleChange}
              required
            >
              <option value="">Seçiniz</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.company_name || c.contact_person}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label">
              Hat (Stokta Olan) <span style={{ color: "red" }}>*</span>
            </label>
            <select
              className="form-select bg-dark text-white"
              style={{ border: "1px solid #ADD8E6" }}
              name="sim_card_id"
              value={form.sim_card_id}
              onChange={handleChange}
              required
            >
              <option value="">Seçiniz</option>
              {simCards
                .filter((s) => s.status === "stok") // sadece stokta olanları al
                .map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.phone_number} {/* Sadece numara */}
                  </option>
                ))}
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label">IP Adresi</label>
            <input
              type="text"
              className="form-control bg-dark text-white"
              style={{ border: "1px solid #ADD8E6" }}
              name="ip_address"
              value={form.ip_address}
              onChange={handleChange}
              placeholder="Opsiyonel: 192.168.1.1"
            />
          </div>

          <div className="col-md-6 d-flex align-items-center">
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                style={{ borderColor: "#ADD8E6" }}
                name="has_static_ip"
                checked={form.has_static_ip}
                onChange={handleChange}
                id="hasStaticIp"
              />
              <label className="form-check-label ms-2" htmlFor="hasStaticIp">
                Statik IP
              </label>
            </div>
          </div>

          <div className="col-12">
            <label className="form-label">Kurulum Yeri</label>
            <textarea
              className="form-control bg-dark text-white"
              style={{ border: "1px solid #ADD8E6" }}
              rows="2"
              name="installation_location"
              value={form.installation_location}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="col-12">
            <label className="form-label">Kurulum Notları</label>
            <textarea
              className="form-control bg-dark text-white"
              style={{ border: "1px solid #ADD8E6" }}
              rows="2"
              name="installation_notes"
              value={form.installation_notes}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="col-md-6">
            <label className="form-label">Faturalandırma Tipi</label>
            <div className="form-check">
              <input
                type="radio"
                className="form-check-input"
                name="billing_type"
                value="aylik"
                checked={form.billing_type === "aylik"}
                onChange={handleChange}
                id="billingAylik"
              />
              <label className="form-check-label ms-2" htmlFor="billingAylik">
                Aylık
              </label>
            </div>
            <div className="form-check">
              <input
                type="radio"
                className="form-check-input"
                name="billing_type"
                value="yillik"
                checked={form.billing_type === "yillik"}
                onChange={handleChange}
                id="billingYillik"
              />
              <label className="form-check-label ms-2" htmlFor="billingYillik">
                Yıllık
              </label>
            </div>
          </div>

          <div className="col-md-6">
            <label className="form-label">
              Tahsis Tarihi <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="date"
              className="form-control bg-dark text-white"
              style={{ border: "1px solid #ADD8E6" }}
              name="allocation_date"
              value={form.allocation_date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-12">
            <button
              type="submit"
              className="btn w-100 fw-bold"
              style={{ backgroundColor: "#ADD8E6", color: "#000" }}
              disabled={submitting}
            >
              {submitting ? "Tahsis ediliyor..." : "Tahsis Et"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default HatTahsisForm;