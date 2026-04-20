import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";


export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage("");

    const result = await login(formData);

    if (result.success) {
      navigate("/dashboard");
    } else {
      setErrorMessage(result.message || "Erreur de connexion");
    }

    setSubmitting(false);
  };

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="app-background login-background relative min-h-screen w-full overflow-hidden">
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8">
        <div className="w-full max-w-md rounded-2xl border border-white/25 bg-white/10 p-8 shadow-2xl backdrop-blur-sm">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white">
              Connexion
            </h1>
            <p className="mt-2 text-sm text-gray-200">
              CNRST Data Protection System
            </p>
          </div>

          {errorMessage && (
            <div className="mb-4 rounded-lg border border-red-300/40 bg-red-500/20 px-4 py-3 text-sm text-red-100">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-white">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="exemple@cnrst.ma"
                className="w-full rounded-xl border border-white/25 bg-white/15 px-4 py-3 text-white placeholder:text-gray-300 outline-none transition focus:border-blue-300 focus:bg-white/20 focus:ring-2 focus:ring-blue-400/40"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white">
                Mot de passe
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="********"
                className="w-full rounded-xl border border-white/25 bg-white/15 px-4 py-3 text-white placeholder:text-gray-300 outline-none transition focus:border-blue-300 focus:bg-white/20 focus:ring-2 focus:ring-blue-400/40"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="mt-2 text-sm font-semibold text-blue-100 transition hover:text-white"
              >
                {showPassword
                  ? "Cacher le mot de passe"
                  : "Afficher le mot de passe"}
              </button>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? "Connexion..." : "Se connecter"}
            </button>
          </form>
        </div>
      </div>

      <p className="absolute bottom-4 left-1/2 z-10 w-[calc(100%-2rem)] max-w-4xl -translate-x-1/2 text-center text-xs leading-5 text-white/80">
        © 2026 CNRST DPS — Tous droits réservés. Centre National pour la
        Recherche Scientifique et Technique (CNRST), Rabat - Hay Riad, Maroc.
      </p>
    </div>
  );
}
