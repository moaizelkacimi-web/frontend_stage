import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getUser = async () => {
    if (!localStorage.getItem("token")) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await api.get("/api/user");
      setUser(res.data);
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (formData) => {
    try {
      const loginResponse = await api.post("/login", formData);

      localStorage.setItem("token", loginResponse.data.token);
      localStorage.setItem("user", JSON.stringify(loginResponse.data.user));
      setUser(loginResponse.data.user);

      return { success: true };
    } catch (error) {
      console.error("Erreur login :", error);

      if (!error.response) {
        return {
          success: false,
          errors: null,
          message:
            "Impossible de joindre le backend. Vérifiez que Laravel tourne sur http://127.0.0.1:8000.",
        };
      }

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
    } catch (error) {
      console.error("Erreur logout :", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
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
