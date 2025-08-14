const API_URL = "http://localhost:5000/api";

function getAuthHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getSimCards(status) {
  const url = status ? `${API_URL}/sim-cards?status=${status}` : `${API_URL}/sim-cards`;
  const res = await fetch(url, { headers: getAuthHeader() });
  if (!res.ok) throw new Error("Failed to fetch sim cards");
  return res.json();
}

export async function getCustomers() {
  const res = await fetch(`${API_URL}/customers`, { headers: getAuthHeader() });
  if (!res.ok) throw new Error("Failed to fetch customers");
  return res.json();
}

export async function getAllocations() {
  const res = await fetch(`${API_URL}/allocations`, { headers: getAuthHeader() });
  if (!res.ok) throw new Error("Failed to fetch allocations");
  return res.json();
}

export async function getAllocationsReturns() {
  const res = await fetch(`${API_URL}/allocations/returns`, { headers: getAuthHeader() });
  if (!res.ok) throw new Error("Failed to fetch returned allocations");
  return res.json();
}

export async function createAllocation(data) {
  const res = await fetch(`${API_URL}/allocations`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Tahsis oluşturulamadı");
  }
  return res.json();
}

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
  const data = await res.json();
  localStorage.setItem("token", data.token);
  return data;
}

export async function getActiveSimCount() {
  const res = await fetch(`${API_URL}/reports/active-sim-count`, { headers: getAuthHeader() });
  if (!res.ok) throw new Error("Failed to fetch active sim count");
  return res.json();
}

export async function getOperatorDistribution() {
  const res = await fetch(`${API_URL}/reports/operator-distribution`, { headers: getAuthHeader() });
  if (!res.ok) throw new Error("Failed to fetch operator distribution");
  return res.json();
}

export async function getOperatorDistributionFromAllocations() {
  const res = await fetch(`${API_URL}/reports/operator-distribution-from-allocations`, { headers: getAuthHeader() });
  if (!res.ok) throw new Error("Failed to fetch operator distribution from allocations");
  return res.json();
}

export async function getCustomerAllocations() {
  const res = await fetch(`${API_URL}/reports/customer-allocations`, { headers: getAuthHeader() });
  if (!res.ok) throw new Error("Failed to fetch customer allocations");
  return res.json();
}

export async function getAllocationsByDate(start, end) {
  const res = await fetch(`${API_URL}/reports/allocations-by-date?start=${start}&end=${end}`, { headers: getAuthHeader() });
  if (!res.ok) throw new Error("Failed to fetch allocations by date");
  return res.json();
}

// --- Yeni eklenen fonksiyonlar ---
export async function getOperators() {
  const res = await fetch(`${API_URL}/operators`, { headers: getAuthHeader() });
  if (!res.ok) throw new Error("Failed to fetch operators");
  return res.json();
}

export async function getPackages() {
  const res = await fetch(`${API_URL}/packages`, { headers: getAuthHeader() });
  if (!res.ok) throw new Error("Failed to fetch packages");
  return res.json();
}
