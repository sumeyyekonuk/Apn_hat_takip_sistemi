const API_URL = "http://localhost:5000/api";

export async function getSimCards() {
  const res = await fetch(`${API_URL}/sim-cards`);
  if (!res.ok) throw new Error("Failed to fetch sim cards");
  return res.json();
}

export async function getCustomers() {
  const res = await fetch(`${API_URL}/customers`);
  if (!res.ok) throw new Error("Failed to fetch customers");
  return res.json();
}

export async function getAllocations() {
  const res = await fetch(`${API_URL}/allocations`);  // çoğul endpoint kullanıldı
  if (!res.ok) throw new Error("Failed to fetch allocations");
  return res.json();
}
