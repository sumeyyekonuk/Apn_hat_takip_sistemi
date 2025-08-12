const API_URL = "http://localhost:5000/api";

export async function getSimCards(status) {
  const url = status ? `${API_URL}/sim-cards?status=${status}` : `${API_URL}/sim-cards`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch sim cards");
  return res.json();
}

export async function getCustomers() {
  const res = await fetch(`${API_URL}/customers`);
  if (!res.ok) throw new Error("Failed to fetch customers");
  return res.json();
}

export async function getAllocations() {
  const res = await fetch(`${API_URL}/allocations`);
  if (!res.ok) throw new Error("Failed to fetch allocations");
  return res.json();
}

// Yeni: İade alınan tahsisleri getirir
export async function getAllocationsReturns() {
  const res = await fetch(`${API_URL}/allocations/returns`);
  if (!res.ok) throw new Error("Failed to fetch returned allocations");
  return res.json();
}

export async function createAllocation(data) {
  const res = await fetch(`${API_URL}/allocations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Tahsis oluşturulamadı");
  }
  return res.json();
}

// 🔹 Yeni eklenen login fonksiyonu
export async function login(credentials) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Giriş başarısız");
  }

  return res.json();
}

// Yeni raporlama API fonksiyonları

export async function getActiveSimCount() {
  const res = await fetch(`${API_URL}/reports/active-sim-count`);
  if (!res.ok) throw new Error("Failed to fetch active sim count");
  return res.json();
}

export async function getOperatorDistribution() {
  const res = await fetch(`${API_URL}/reports/operator-distribution`);
  if (!res.ok) throw new Error("Failed to fetch operator distribution");
  return res.json();
}

export async function getCustomerAllocations() {
  const res = await fetch(`${API_URL}/reports/customer-allocations`);
  if (!res.ok) throw new Error("Failed to fetch customer allocations");
  return res.json();
}

export async function getAllocationsByDate(start, end) {
  const res = await fetch(`${API_URL}/reports/allocations-by-date?start=${start}&end=${end}`);
  if (!res.ok) throw new Error("Failed to fetch allocations by date");
  return res.json();
}
