import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import bgImage from "../../images/cnrst-image.jpg";
// Si ton fichier s'appelle encore cnrst.image.jpg, remplace la ligne ci-dessus par :
// import bgImage from "../../images/cnrst.image.jpg";

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

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
    navigate("/dashboard");
    return null;
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8">
        <div className="w-full max-w-md rounded-2xl border border-white/20 bg-white/12 p-8 shadow-2xl backdrop-blur-md">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white">
              Connexion
            </h1>
            <p className="mt-2 text-sm text-gray-200">
              Application de gestion RGPD - CNRST
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
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="********"
                className="w-full rounded-xl border border-white/25 bg-white/15 px-4 py-3 text-white placeholder:text-gray-300 outline-none transition focus:border-blue-300 focus:bg-white/20 focus:ring-2 focus:ring-blue-400/40"
                required
              />
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
    </div>
  );
}