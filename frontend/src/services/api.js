const LOCAL_API_URL = "http://127.0.0.1:8000";
const PRODUCTION_API_URL =
  "https://ai-support-desk-2hu4.onrender.com";

export const API_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === "localhost"
    ? LOCAL_API_URL
    : PRODUCTION_API_URL);


export async function registerUser(name, email, password) {
  const response = await fetch(`${API_URL}/users/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });

  if (!response.ok) {
    const error = await response.json();

    throw new Error(
      error.detail || "Registration failed"
    );
  }

  return response.json();
}


export async function loginUser(email, password) {
  const formData = new URLSearchParams();

  formData.append("username", email);
  formData.append("password", password);

  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type":
        "application/x-www-form-urlencoded",
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();

    throw new Error(
      error.detail || "Login failed"
    );
  }

  return response.json();
}


export async function getCurrentUser(token) {
  const response = await fetch(`${API_URL}/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(
      "Unable to load user"
    );
  }

  return response.json();
}