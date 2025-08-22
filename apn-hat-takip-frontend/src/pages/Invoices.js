// src/pages/Invoices.js
import React, { useEffect, useState } from "react";
import axios from "axios";

function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Filtre ve arama state'leri ---
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // --- Sıralama state ---
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });

  // --- Sayfalama state ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // --- Backend'den tüm faturaları çek ---
  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/invoices", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInvoices(res.data);
      setFilteredInvoices(res.data);
    } catch (err) {
      console.error("Faturalar alınamadı:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // --- Fatura ödeme ---
  const handlePayInvoice = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/invoices/${id}/pay`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInvoices((prev) =>
        prev.map((inv) =>
          inv.id === id ? { ...inv, status: "odendi" } : inv
        )
      );
    } catch (err) {
      console.error("Fatura ödenemedi:", err);
    }
  };

  // --- Toplu fatura ---
  const handleCreateAllInvoices = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/invoices/create-all",
        null,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchInvoices();
    } catch (err) {
      console.error("Toplu fatura oluşturulamadı:", err);
    }
  };

  // --- Filtreleme ve arama ---
  const applyFilters = () => {
    let filtered = [...invoices];

    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(
        (inv) =>
          inv.Customer?.company_name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          inv.SimCard?.phone_number
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "") {
      filtered = filtered.filter((inv) => inv.status === statusFilter);
    }

    if (startDate !== "") {
      filtered = filtered.filter(
        (inv) => new Date(inv.invoice_date) >= new Date(startDate)
      );
    }
    if (endDate !== "") {
      filtered = filtered.filter(
        (inv) => new Date(inv.invoice_date) <= new Date(endDate)
      );
    }

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        if (sortConfig.key === "invoice_date") {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        }
        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    setFilteredInvoices(filtered);
    setCurrentPage(1);
  };

  useEffect(() => {
    applyFilters();
  }, [searchTerm, statusFilter, startDate, endDate, invoices, sortConfig]);

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredInvoices.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };
  const prevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const totalCount = invoices.length;

  const setPreset = (preset) => {
    const today = new Date();
    let start = "";
    let end = "";
    if (preset === "today") {
      start = today.toISOString().split("T")[0];
      end = start;
    } else if (preset === "thisMonth") {
      start = new Date(today.getFullYear(), today.getMonth(), 1)
        .toISOString()
        .split("T")[0];
      end = new Date(today.getFullYear(), today.getMonth() + 1, 0)
        .toISOString()
        .split("T")[0];
    } else if (preset === "thisYear") {
      start = new Date(today.getFullYear(), 0, 1).toISOString().split("T")[0];
      end = new Date(today.getFullYear(), 11, 31).toISOString().split("T")[0];
    }
    setStartDate(start);
    setEndDate(end);
  };

  if (loading) return <p>Yükleniyor...</p>;

  return (
    <div className="container mt-4">
      <div className="card shadow rounded">
        <div
          className="card-header d-flex justify-content-between align-items-center"
          style={{ background: "#5bc0de", color: "#fff", fontWeight: 600 }}
        >
          <span>📄 Faturalar</span>
          <div className="d-flex align-items-center">
            <span style={{ marginRight: "15px", fontWeight: 600 }}>
              Toplam: {totalCount}
            </span>
            <button
              className="btn btn-sm me-2"
              style={{ background: "#31b0d5", color: "#fff", fontWeight: 600 }}
              onClick={fetchInvoices}
            >
              Yenile
            </button>
            <button
              className="btn btn-sm"
              style={{ background: "#31b0d5", color: "#fff", fontWeight: 600 }}
              onClick={handleCreateAllInvoices}
            >
              Tüm Tahsisler için Fatura Oluştur
            </button>
          </div>
        </div>

        {/* Filtreler */}
        <div className="card-body">
          <div className="row mb-2">
            <div className="col-md-3 mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="Müşteri / Sim Kart Ara"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-3 mb-2">
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Tüm Durumlar</option>
                <option value="beklemede">Beklemede</option>
                <option value="odendi">Ödendi</option>
                <option value="gecikmede">Gecikmede</option>
              </select>
            </div>
            <div className="col-md-3 mb-2 d-flex">
              <input
                type="date"
                className="form-control me-1"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <input
                type="date"
                className="form-control"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="col-md-3 mb-2">
              <div className="btn-group w-100">
                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => setPreset("today")}
                >
                  Bugün
                </button>
                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => setPreset("thisMonth")}
                >
                  Bu Ay
                </button>
                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => setPreset("thisYear")}
                >
                  Bu Yıl
                </button>
              </div>
            </div>
          </div>

          {/* Tablo */}
          <table className="table table-hover">
            <thead>
              <tr>
                <th onClick={() => requestSort("id")}>ID</th>
                <th>Müşteri</th>
                <th>Sim Kart</th>
                <th>Paket</th>
                <th onClick={() => requestSort("amount")}>Tutar</th>
                <th onClick={() => requestSort("invoice_date")}>Fatura Tarihi</th>
                <th>Fatura Dönemi</th>
                <th>Durum</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center text-muted">
                    Henüz fatura bulunmuyor.
                  </td>
                </tr>
              ) : (
                currentItems.map((inv) => (
                  <tr key={inv.id}>
                    <td>{inv.id}</td>
                    <td>{inv.Customer?.company_name || "-"}</td>
                    <td>{inv.SimCard?.phone_number || "-"}</td>
                    <td>{inv.Package?.name || "-"}</td>
                    <td>{inv.amount}</td>
                    <td>
                      {new Date(inv.invoice_date).toLocaleDateString("tr-TR", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })}
                    </td>
                    <td>
                      {inv.period_start && inv.period_end
                        ? `${new Date(inv.period_start).toLocaleDateString("tr-TR", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                          })} - ${new Date(inv.period_end).toLocaleDateString("tr-TR", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                          })}`
                        : "-"}
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          inv.status === "odendi"
                            ? "bg-success"
                            : inv.status === "beklemede"
                            ? "bg-warning text-dark"
                            : "bg-secondary"
                        }`}
                      >
                        {inv.status === "odendi"
                          ? "Ödendi"
                          : inv.status === "beklemede"
                          ? "Beklemede"
                          : inv.status}
                      </span>
                    </td>
                    <td>
                      {inv.status === "beklemede" && (
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => handlePayInvoice(inv.id)}
                        >
                          Öde
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Sayfalama */}
          <div className="d-flex justify-content-between">
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={prevPage}
              disabled={currentPage === 1}
            >
              Önceki
            </button>
            <span>
              Sayfa {currentPage} / {totalPages}
            </span>
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={nextPage}
              disabled={currentPage === totalPages}
            >
              Sonraki
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Invoices;
