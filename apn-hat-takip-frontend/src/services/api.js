const API_URL = "http://localhost:5000/api";

// --- Ortak Fonksiyonlar ---
function getAuthHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse(res, defaultErrorMessage) {
  if (!res.ok) {
    let errorMessage = defaultErrorMessage;
    try {
      const errorData = await res.json();
      errorMessage = errorData?.error || errorMessage;
    } catch (err) {
      console.error("Response parse error:", err);
    }

    if (res.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    throw new Error(errorMessage);
  }
  try {
    return await res.json();
  } catch {
    return {};
  }
}

// --- SIM Cards ---
export async function getSimCards(status) {
  const url = status ? `${API_URL}/sim-cards?status=${status}` : `${API_URL}/sim-cards`;
  const res = await fetch(url, { headers: getAuthHeader() });
  return handleResponse(res, "SIM kartlar getirilemedi");
}

export async function createSimCard(data) {
  if (!data.package_id || !data.operator_id) throw new Error("Package ID ve Operator ID zorunludur.");
  const payload = { ...data, package_id: Number(data.package_id), operator_id: Number(data.operator_id) };
  const res = await fetch(`${API_URL}/sim-cards`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify(payload),
  });
  return handleResponse(res, "Sim kart oluşturulamadı");
}

export async function updateSimCard(id, data) {
  if (!data.package_id || !data.operator_id) throw new Error("Package ID ve Operator ID zorunludur.");
  const payload = { ...data, package_id: Number(data.package_id), operator_id: Number(data.operator_id) };
  const res = await fetch(`${API_URL}/sim-cards/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify(payload),
  });
  return handleResponse(res, "Sim kart güncellenemedi");
}

export async function deleteSimCard(id) {
  const res = await fetch(`${API_URL}/sim-cards/${id}`, { method: "DELETE", headers: getAuthHeader() });
  return handleResponse(res, "Sim kart silinemedi");
}

// --- Customers ---
export async function getCustomers() {
  const res = await fetch(`${API_URL}/customers`, { headers: getAuthHeader() });
  return handleResponse(res, "Müşteriler getirilemedi");
}

export async function createCustomer(data) {
  const res = await fetch(`${API_URL}/customers`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify(data),
  });
  return handleResponse(res, "Müşteri eklenemedi");
}

export async function updateCustomer(id, data) {
  const res = await fetch(`${API_URL}/customers/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify(data),
  });
  return handleResponse(res, "Müşteri güncellenemedi");
}

export async function deleteCustomer(id) {
  const res = await fetch(`${API_URL}/customers/${id}`, { headers: getAuthHeader() });
  return handleResponse(res, "Müşteri silinemedi");
}

// --- Allocations ---
export async function getAllocations() {
  const res = await fetch(`${API_URL}/allocations`, { headers: getAuthHeader() });
  return handleResponse(res, "Tahsisler getirilemedi");
}

export async function getAllocationsReturns() {
  const res = await fetch(`${API_URL}/allocations/returns`, { headers: getAuthHeader() });
  return handleResponse(res, "İade edilmiş tahsisler getirilemedi");
}

export async function createAllocation(data) {
  if (!data.customer_id || !data.sim_card_id) throw new Error("Customer ve SIM ID zorunludur.");
  const res = await fetch(`${API_URL}/allocations`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify(data),
  });
  return handleResponse(res, "Tahsis oluşturulamadı");
}

// ✅ Yeni eklenecek: Tahsis iade etme
export async function returnAllocation(data) {
  if (!data.allocation_id || !data.reason) throw new Error("Allocation ID ve iade sebebi zorunludur.");
  const res = await fetch(`${API_URL}/allocations/return`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify(data),
  });
  return handleResponse(res, "Tahsis iade edilemedi");
}

// --- Auth ---
export async function login(credentials) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  const data = await handleResponse(res, "Giriş başarısız");
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));
  return data;
}

// --- Reports ---
export async function getActiveSimCount() {
  const res = await fetch(`${API_URL}/reports/active-sim-count`, { headers: getAuthHeader() });
  return handleResponse(res, "Aktif SIM sayısı getirilemedi");
}

export async function getOperatorDistribution() {
  const res = await fetch(`${API_URL}/reports/operator-distribution`, { headers: getAuthHeader() });
  return handleResponse(res, "Operatör dağılımı getirilemedi");
}

export async function getOperatorDistributionFromAllocations() {
  const res = await fetch(`${API_URL}/reports/operator-distribution-from-allocations`, { headers: getAuthHeader() });
  return handleResponse(res, "Tahsislerden operatör dağılımı getirilemedi");
}

export async function getCustomerAllocations() {
  const res = await fetch(`${API_URL}/reports/customer-allocations`, { headers: getAuthHeader() });
  return handleResponse(res, "Müşteri tahsisleri getirilemedi");
}

export async function getAllocationsByDate(start, end) {
  const res = await fetch(`${API_URL}/reports/allocations-by-date?start=${start}&end=${end}`, { headers: getAuthHeader() });
  return handleResponse(res, "Tarihe göre tahsisler getirilemedi");
}

// --- Operators & Packages ---
export async function getOperators() {
  const res = await fetch(`${API_URL}/operators`, { headers: getAuthHeader() });
  return handleResponse(res, "Operatörler getirilemedi");
}

export async function getPackages() {
  const res = await fetch(`${API_URL}/packages`, { headers: getAuthHeader() });
  return handleResponse(res, "Paketler getirilemedi");
}
