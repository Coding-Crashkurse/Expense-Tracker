import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

/**
 * Login mit FormData (x-www-form-urlencoded).
 */
export async function loginUser(username: string, password: string) {
  const data = new URLSearchParams();
  data.append("username", username);
  data.append("password", password);

  console.log("[loginUser] Sending:", data.toString());

  try {
    const response = await axios.post(`${API_URL}/auth/login`, data, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    console.log("[loginUser] Response data:", response.data);
    return response.data.access_token;
  } catch (err) {
    console.error("[loginUser] Error:", err);
    throw err;
  }
}

/**
 * Transaktionen vom Backend laden (bereits persistierte Daten).
 */
export async function getTransactions(token: string): Promise<any[]> {
  console.log("[getTransactions] with token:", token);
  const response = await axios.get(`${API_URL}/transactions`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log("[getTransactions] Response data:", response.data);
  return response.data;
}

/**
 * Neue Transaktion anlegen.
 * - type = "income" => income=amount, expense=0
 * - type = "expense" => expense=amount, income=0
 */
export async function createTransaction(
  token: string,
  month: string,
  category: string,
  type: "income" | "expense",
  amount: number
): Promise<any> {
  const payload = {
    month,
    category,
    income: type === "income" ? amount : 0,
    expense: type === "expense" ? amount : 0,
  };

  console.log("[createTransaction] Sending payload:", payload);

  const response = await axios.post(`${API_URL}/transactions`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  console.log("[createTransaction] Response data:", response.data);
  return response.data;
}
