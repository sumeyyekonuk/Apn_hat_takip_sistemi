import React, { useEffect, useState } from "react";
import { Pie, Line, Bar } from "react-chartjs-2";
import {
  Chart,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
} from "chart.js";

import {
  getSimCards,
  getAllocations,
  getOperatorDistributionFromAllocations,
  getAllocationsReturns,
} from "../services/api";

Chart.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement
);

const cardColors = {
  toplam: "#a2d5f2",
  aktif: "#63cdda",
  stok: "#f7a072",
  iade: "#f2709c",
  tahsis: "#ffb74d",
};

function getColorArray(baseColors, count) {
  const arr = [];
  for (let i = 0; i < count; i++) {
    arr.push(baseColors[i % baseColors.length]);
  }
  return arr;
}

function Dashboard() {
  const [simCards, setSimCards] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [returnedSimCards, setReturnedSimCards] = useState([]);

  const [loadingAllocations, setLoadingAllocations] = useState(true);
  const [loadingReturns, setLoadingReturns] = useState(true);
  const [loadingOperator, setLoadingOperator] = useState(true);

  const [operatorDistributionData, setOperatorDistributionData] = useState(null);
  const [monthlyAllocationTrendData, setMonthlyAllocationTrendData] = useState(null);
  const [packageTypeDistributionData, setPackageTypeDistributionData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    getSimCards()
      .then((data) => {
        setSimCards(data);
        const packageCounts = {};
        data.forEach((card) => {
          const packageName = card.Package?.name || "Bilinmeyen";
          packageCounts[packageName] = (packageCounts[packageName] || 0) + 1;
        });
        const labels = Object.keys(packageCounts);
        const counts = Object.values(packageCounts);
        setPackageTypeDistributionData({
          labels,
          datasets: [
            {
              label: "Paket Tipi Dağılımı",
              data: counts,
              backgroundColor: getColorArray(
                [cardColors.toplam, cardColors.aktif, cardColors.stok, cardColors.iade, cardColors.tahsis],
                labels.length
              ),
              borderRadius: 6,
            },
          ],
        });
      })
      .catch(console.error);

    getOperatorDistributionFromAllocations()
      .then((data) => {
        if (!data || !data.length) return;
        const labels = data.map((item) => item.operator);
        const counts = data.map((item) => item.count);
        setOperatorDistributionData({
          labels,
          datasets: [
            {
              label: "Operatör Bazlı Hat Sayısı",
              data: counts,
              backgroundColor: getColorArray(
                [cardColors.toplam, cardColors.aktif, cardColors.stok, cardColors.iade, cardColors.tahsis],
                labels.length
              ),
              borderColor: "#fff",
              borderWidth: 2,
              hoverOffset: 20,
            },
          ],
        });
        setLoadingOperator(false);
      })
      .catch((err) => {
        console.error("Operator distribution error:", err);
        setLoadingOperator(false);
      });

    getAllocations()
      .then((data) => {
        setAllocations(data);
        const monthLabels = [];
        const monthData = [];
        const today = new Date();
        for (let i = 5; i >= 0; i--) {
          const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
          monthLabels.push(
            d.toLocaleString("default", { month: "short", year: "numeric" })
          );
          const count = data.filter((a) => {
            const date = new Date(a.allocation_date);
            return date.getMonth() === d.getMonth() && date.getFullYear() === d.getFullYear();
          }).length;
          monthData.push(count);
        }
        setMonthlyAllocationTrendData({
          labels: monthLabels,
          datasets: [
            {
              label: "Aylık Tahsis Trendi",
              data: monthData,
              fill: false,
              borderColor: cardColors.tahsis,
              backgroundColor: cardColors.tahsis,
              tension: 0.4,
              borderWidth: 3,
              pointRadius: 4,
            },
          ],
        });
        setLoadingAllocations(false);
      })
      .catch(console.error);

    getAllocationsReturns()
      .then((data) => {
        setReturnedSimCards(data);
        setLoadingReturns(false);
      })
      .catch(console.error);
  }, []);

  const aktifHat = simCards.filter((card) => card.status === "aktif").length;
  const stokHat = simCards.filter((card) => card.status === "stok").length;
  const iadeHat = returnedSimCards.length;
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  const thisMonthAllocations = allocations.filter((allocation) => {
    const date = new Date(allocation.allocation_date);
    return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
  });
  const recentAllocations = allocations.slice(-5).reverse();
  const recentReturns = returnedSimCards.slice(-5).reverse();

  return (
    <div style={{ padding: "10px 20px 20px 20px", fontFamily: "Inter, sans-serif", background: "#f5f7fa", minHeight: "100vh" }}>
      <h2 style={{ margin: "0 0 20px 0", fontSize: "20px", fontWeight: 600, color: "#333" }}>
        <span role="img" aria-label="home">🏠</span> Hat Takip Sistemi
      </h2>

      {/* Özet kartlar */}
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginBottom: "25px" }}>
        {[ 
          { label: "Toplam Hat", value: simCards.length, color: cardColors.toplam },
          { label: "Aktif Hatlar", value: aktifHat, color: cardColors.aktif },
          { label: "Stokta Bekleyen Hatlar", value: stokHat, color: cardColors.stok },
          { label: "İade Alınan Hatlar", value: iadeHat, color: cardColors.iade },
          { label: "Bu Ay Tahsis Edilenler", value: thisMonthAllocations.length, color: cardColors.tahsis },
        ].map((card) => (
          <div key={card.label} style={{
            flex: "1 1 140px",
            minHeight: "130px",
            padding: "25px 20px",
            background: card.color,
            borderRadius: "12px",
            color: "#fff",
            textAlign: "center",
            boxShadow: "0 6px 14px rgba(0,0,0,0.12)"
          }}>
            <div style={{ fontSize: "32px", fontWeight: 700 }}>{card.value}</div>
            <div style={{ fontSize: "14px", marginTop: "6px", fontWeight: 600 }}>{card.label}</div>
          </div>
        ))}
      </div>

      {/* Grafikler */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "space-between", marginBottom: "20px" }}>
        {[
          { title: "Operatör Bazlı Dağılım", chart: operatorDistributionData, loading: loadingOperator, type: "pie" },
          { title: "Aylık Tahsis Trendi", chart: monthlyAllocationTrendData, loading: loadingAllocations, type: "line" },
          { title: "Paket Tipi Dağılımı", chart: packageTypeDistributionData, loading: !packageTypeDistributionData, type: "bar" },
        ].map((g, idx) => (
          <div key={idx} style={{
            flex: "1 1 320px",
            maxHeight: "360px",
            height: "360px",
            padding: "10px",
            background: "#fff",
            borderRadius: "10px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            overflow: "hidden"
          }}>
            <h4 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "10px", color: "#333" }}>{g.title}</h4>
            {g.loading ? <div>Yükleniyor...</div> : (
              g.chart ? (
                g.type === "pie" ? (
                  <Pie 
                    data={g.chart} 
                    options={{
                      maintainAspectRatio: false,
                      cutout: 50,
                      plugins: { legend: { position: "bottom", labels: { font: { size: 12 }, boxWidth: 20 } } },
                      layout: { padding: { bottom: 20 } }
                    }} 
                    height={360} 
                  />
                ) : g.type === "line" ? (
                  <Line 
                    data={g.chart} 
                    options={{
                      maintainAspectRatio: true,
                      aspectRatio: 1.2,
                      plugins: { legend: { position: "bottom", labels: { font: { size: 12 }, boxWidth: 20 } } },
                      scales: {
                        y: { ticks: { stepSize: 1, font: { size: 12 } }, grid: { color: "rgba(0,0,0,0.05)" } },
                        x: { ticks: { font: { size: 12 } }, grid: { display: false } }
                      },
                      layout: { padding: { bottom: 20 } }
                    }} 
                    height={360} 
                  />
                ) : (
                  <Bar 
                    data={g.chart} 
                    options={{
                      maintainAspectRatio: true,
                      aspectRatio: 1.2,
                      plugins: { legend: { position: "bottom", labels: { font: { size: 12 }, boxWidth: 20 } } },
                      scales: {
                        y: { ticks: { stepSize: 1, font: { size: 12 } }, grid: { color: "rgba(0,0,0,0.05)" } },
                        x: { ticks: { font: { size: 12 } }, grid: { display: false } }
                      },
                      layout: { padding: { bottom: 20 } }
                    }} 
                    height={360} 
                  />
                )
              ) : <div>Veri yok</div>
            )}
          </div>
        ))}
      </div>

      {/* Son tahsisler ve iadeler */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        <div style={{
          flex: "1 1 400px",
          background: "#fff",
          padding: "15px",
          borderRadius: "10px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
        }}>
          <h5 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "10px", color: "#333" }}>Son Tahsisler</h5>
          {loadingAllocations ? <div>Yükleniyor...</div> : recentAllocations.length ? (
            <table style={{ width: "100%", fontSize: "13px", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th>ID</th><th>Müşteri</th><th>Hat Numarası</th><th>Tahsis Tarihi</th>
                </tr>
              </thead>
              <tbody>
                {recentAllocations.map((a) => (
                  <tr key={a.id}>
                    <td>{a.id}</td>
                    <td>{a.Customer?.company_name || "-"}</td>
                    <td>{a.SimCard?.phone_number || "-"}</td>
                    <td>{new Date(a.allocation_date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <p>Gösterilecek tahsis işlemi yok.</p>}
        </div>

        <div style={{
          flex: "1 1 400px",
          background: "#fff",
          padding: "15px",
          borderRadius: "10px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
        }}>
          <h5 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "10px", color: "#333" }}>Son İadeler</h5>
          {loadingReturns ? <div>Yükleniyor...</div> : recentReturns.length ? (
            <table style={{ width: "100%", fontSize: "13px", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th>ID</th><th>Müşteri</th><th>Hat Numarası</th><th>İade Tarihi</th>
                </tr>
              </thead>
              <tbody>
                {recentReturns.map((r) => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>{r.Customer?.company_name || "-"}</td>
                    <td>{r.SimCard?.phone_number || "-"}</td>
                    <td>{r.returned_at ? new Date(r.returned_at).toLocaleDateString() : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <p>Gösterilecek iade işlemi yok.</p>}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
