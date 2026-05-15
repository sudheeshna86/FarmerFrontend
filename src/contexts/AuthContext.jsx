import React, { createContext, useContext, useState } from "react";
import { login as apiLogin, signup as apiSignup, logout as apiLogout } from "../api/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  // 🔵 Login (email or phone)
  const login = async (identifier,password,role) => {
    // identifier = email or phone
    const data = await apiLogin(identifier, password,role);
    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
    console.log("Hii")
    localStorage.setItem("token",data.token)
    return data;
  };

  // 🟢 Signup (phone mandatory, email optional)
const signup = async (payload) => {
  const data = await apiSignup(payload);
  setUser(data);
  localStorage.setItem("user", JSON.stringify(data));
  localStorage.setItem("token", data.token);
  return data;
};


  // 🔴 Logout
  const logout = async () => {
    await apiLogout();
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
