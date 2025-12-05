import apiClient from "./apiClient";

// 🟢 SIGNUP
export const signup = async (payload) => {
  const response = await apiClient.post("/auth/signup", payload);
  return response.data;
};

// 🔵 LOGIN
export const login = async (identifier, password,role) => {
    
  const response = await apiClient.post("/auth/login", {
    identifier,
    password,
    role
  });
  return response.data;
};

export const logout = async () => {
  try {
    // Optional: notify backend
    await apiClient.post("/auth/logout");
  } catch (e) {
    console.warn("Logout warning:", e.message);
  }

  // 🧹 Clear local storage
  localStorage.clear();

  // 🧼 Remove old token from Axios memory
  delete apiClient.defaults.headers.common["Authorization"];
};