// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Vérifier si l'utilisateur est déjà connecté
  const getUser = async () => {
    try {
      const res = await api.get("/api/user");
      setUser(res.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Login
  const login = async (formData) => {
    try {
     
      await api.get("/sanctum/csrf-cookie");

      await api.post("/login", formData);

      const res = await api.get("/api/user");
      setUser(res.data);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        errors: error.response?.data?.errors || null,
        message: error.response?.data?.message || "Erreur de connexion",
      };
    }
  };

  
  const logout = async () => {
    try {
      await api.post("/logout");
      setUser(null);
    } catch (error) {
      console.error("Erreur logout :", error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
        role: user?.role || null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}