import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Alert from "../../components/common/Alert";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import Loader from "../../components/common/Loader";

export default function CreateUserPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "DAG",
  });

  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrors({});
    setErrorMessage("");

    try {
      await api.post("/api/users", form);
      navigate("/users", {
        state: { successMessage: "Utilisateur créé avec succès" },
      });
    } catch (error) {
      console.error("Erreur création utilisateur :", error);

      if (error.response?.status === 422) {
        setErrors(error.response.data.errors || {});
      } else {
        setErrorMessage(
          error.response?.data?.message || "Erreur lors de la création"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
          Administration
        </p>
        <h1 className="mt-2 text-2xl font-bold text-slate-950 sm:text-3xl">
          Créer un utilisateur
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          Ajoutez un compte CPD, DAG ou JURIDIQUE.
        </p>
      </div>

      {errorMessage && <Alert type="error">{errorMessage}</Alert>}

      <Card className="p-6 sm:p-8">
        {loading ? (
          <Loader label="Création de l'utilisateur en cours..." />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <Field label="Nom" error={errors.name?.[0]}>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className={inputClass}
              />
            </Field>

            <Field label="Email" error={errors.email?.[0]}>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className={inputClass}
              />
            </Field>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Field label="Mot de passe" error={errors.password?.[0]}>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className={inputClass}
                />
              </Field>

              <Field label="Confirmer le mot de passe">
                <input
                  type="password"
                  name="password_confirmation"
                  value={form.password_confirmation}
                  onChange={handleChange}
                  className={inputClass}
                />
              </Field>
            </div>

            <Field label="Rôle" error={errors.role?.[0]}>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="CPD">CPD</option>
                <option value="DAG">DAG</option>
                <option value="JURIDIQUE">JURIDIQUE</option>
              </select>
            </Field>

            <div className="flex justify-end gap-3 border-t border-slate-200 pt-6">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate("/users")}
              >
                Annuler
              </Button>
              <Button type="submit">Créer</Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-blue-700 focus:ring-4 focus:ring-blue-100";

function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-slate-700">
        {label}
      </span>
      {children}
      {error && <p className="mt-2 text-sm font-medium text-red-700">{error}</p>}
    </label>
  );
}
