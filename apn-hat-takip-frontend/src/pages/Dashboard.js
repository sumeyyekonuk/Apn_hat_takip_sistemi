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
} from "../services/api";

import "../styles/Dashboard.css";

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
    if (!token) return; // login yoksa API çağrılarını engelle

    // Toplam sim kart ve paket tipi
    getSimCards()
      .then((data) => {
        setSimCards(data);

        const packageCounts = {};
        data.forEach((card) => {
          const packageName = card.Package?.name || "Bilinmeyen";
          packageCounts[packageName] = (packageCounts[packageName] || 0) + 1;
        });

        setPackageTypeDistributionData({
          labels: Object.keys(packageCounts),
          datasets: [
            {
              label: "Paket Tipi Dağılımı",
              data: Object.values(packageCounts),
              backgroundColor: Object.keys(packageCounts).map(
                (_, i) => `hsl(${(i * 60) % 360}, 70%, 75%)`
              ),
              borderColor: Object.keys(packageCounts).map(
                (_, i) => `hsl(${(i * 60) % 360}, 70%, 65%)`
              ),
              borderWidth: 1,
              borderRadius: 8,
              barPercentage: 0.8,
              categoryPercentage: 0.7,
            },
          ],
        });
      })
      .catch(console.error);

    // Operatör bazlı dağılım
    getOperatorDistributionFromAllocations()
      .then((data) => {
        if (!data || !data.length) return; // veri yoksa işlem yapma
        const labels = data.map((item) => item.operator);
        const counts = data.map((item) => item.count);

        setOperatorDistributionData({
          labels,
          datasets: [
            {
              label: "Operatör Bazlı Hat Sayısı",
              data: counts,
              backgroundColor: labels.map(
                (_, i) => `hsl(${(i * 60) % 360}, 70%, 50%)`
              ),
              hoverOffset: 30,
            },
          ],
        });

        setLoadingOperator(false);
      })
      .catch((err) => {
        console.error("Operator distribution error:", err);
        setLoadingOperator(false);
      });

    // Tahsisler ve aylık trend
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
              borderColor: "rgba(75,192,192,1)",
              tension: 0.3,
            },
          ],
        });

        setLoadingAllocations(false);
      })
      .catch(console.error);

    // İadeler
    getSimCards("iade")
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
    <div className="dashboard-container">
      <h2 className="dashboard-title">
        <span className="home-icon" role="img" aria-label="home">🏠</span>
        APN Hat Takip Dashboard
      </h2>

      <div className="dashboard-cards-row">
        <div className="dashboard-card bg-toplam">
          <div className="stat-number">{simCards.length}</div>
          <div className="stat-label">Toplam Hat</div>
        </div>

        <div className="dashboard-card bg-aktif">
          <div className="stat-number">{aktifHat}</div>
          <div className="stat-label">Aktif Hatlar</div>
        </div>

        <div className="dashboard-card bg-stok">
          <div className="stat-number">{stokHat}</div>
          <div className="stat-label">Stokta Bekleyen Hatlar</div>
        </div>

        <div className="dashboard-card bg-iade">
          <div className="stat-number">{iadeHat}</div>
          <div className="stat-label">İade Alınan Hatlar</div>
        </div>

        <div className="dashboard-card bg-tahsis">
          <div className="stat-number">{thisMonthAllocations.length}</div>
          <div className="stat-label">Bu Ay Tahsis Edilenler</div>
        </div>
      </div>

      <div className="dashboard-graphs">
        <section className="graph-section">
          <h4>Operatör Bazlı Dağılım (Pasta Grafik)</h4>
          {loadingOperator ? <div>Yükleniyor...</div> : (
            operatorDistributionData ? 
            <Pie data={operatorDistributionData} options={{ maintainAspectRatio: false }} height={250} width={250} /> :
            <div>Veri yok</div>
          )}
        </section>

        <section className="graph-section">
          <h4>Aylık Tahsis Trendi (Çizgi Grafik)</h4>
          {loadingAllocations ? <div>Yükleniyor...</div> : (
            monthlyAllocationTrendData ?
            <Line data={monthlyAllocationTrendData} options={{ maintainAspectRatio: false }} height={250} width={400} /> :
            <div>Veri yok</div>
          )}
        </section>

        <section className="graph-section">
          <h4>Paket Tipi Dağılımı (Bar Grafik)</h4>
          {packageTypeDistributionData ? (
            <Bar
              data={packageTypeDistributionData}
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "bottom",
                    labels: { color: "#333", font: { size: 14 } },
                  },
                },
                scales: {
                  x: { ticks: { color: "#333", font: { size: 13 } }, grid: { display: false } },
                  y: { ticks: { color: "#333", font: { size: 13 }, stepSize: 1 }, grid: { color: "rgba(0,0,0,0.05)" } },
                },
              }}
              height={250}
              width={400}
            />
          ) : (
            <div>Yükleniyor...</div>
          )}
        </section>
      </div>

      <div className="recent-actions">
        <div className="table-container">
          <h5>Son Tahsisler</h5>
          {loadingAllocations ? (
            <div className="spinner">Yükleniyor...</div>
          ) : recentAllocations.length ? (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Müşteri</th>
                  <th>Hat Numarası</th>
                  <th>Tahsis Tarihi</th>
                </tr>
              </thead>
              <tbody>
                {recentAllocations.map((a) => (
                  <tr key={a.id}>
                    <td>{a.id}</td>
                    <td>{a.Customer?.company_name || "Belirtilmemiş"}</td>
                    <td>{a.SimCard?.phone_number || "Belirtilmemiş"}</td>
                    <td>{new Date(a.allocation_date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Gösterilecek tahsis işlemi yok.</p>
          )}
        </div>

        <div className="table-container">
          <h5>Son İadeler</h5>
          {loadingReturns ? (
            <div className="spinner">Yükleniyor...</div>
          ) : recentReturns.length ? (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Müşteri</th>
                  <th>Hat Numarası</th>
                  <th>İade Tarihi</th>
                </tr>
              </thead>
              <tbody>
                {recentReturns.map((r) => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>{r.Allocations?.[0]?.Customer?.company_name || "Belirtilmemiş"}</td>
                    <td>{r.phone_number || "Belirtilmemiş"}</td>
                    <td>{new Date(r.Allocations?.[0]?.allocation_date || r.purchase_date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Gösterilecek iade işlemi yok.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
