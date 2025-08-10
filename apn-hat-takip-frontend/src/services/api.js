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
