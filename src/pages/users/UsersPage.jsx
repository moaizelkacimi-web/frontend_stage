import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Alert from "../../components/common/Alert";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import Loader from "../../components/common/Loader";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState(
    location.state?.successMessage || ""
  );

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!location.state?.successMessage) return;

    navigate(location.pathname, { replace: true, state: {} });
  }, [location.pathname, location.state, navigate]);

  useEffect(() => {
    if (!successMessage) return;

    const timeout = window.setTimeout(() => setSuccessMessage(""), 4000);
    return () => window.clearTimeout(timeout);
  }, [successMessage]);

  const fetchUsers = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const res = await api.get("/api/users");
      setUsers(res.data.data || []);
    } catch (error) {
      console.error("Erreur utilisateurs :", error);
      setErrorMessage(
        error.response?.data?.message ||
          "Erreur lors du chargement des utilisateurs."
      );
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "CPD":
        return "bg-indigo-100 text-indigo-700";
      case "DAG":
        return "bg-blue-100 text-blue-700";
      case "JURIDIQUE":
        return "bg-emerald-100 text-emerald-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
            Administration
          </p>
          <h1 className="mt-2 text-2xl font-bold text-slate-950 sm:text-3xl">
            Gestion des utilisateurs
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
            Gérez les comptes autorisés à accéder au système.
          </p>
        </div>

        <Button type="button" onClick={() => navigate("/users/create")} size="lg">
          Ajouter utilisateur
        </Button>
      </div>

      {successMessage && <Alert type="success">{successMessage}</Alert>}
      {errorMessage && <Alert type="error">{errorMessage}</Alert>}

      <Card className="overflow-hidden">
        {loading ? (
          <div className="p-6">
            <Loader label="Chargement des utilisateurs..." />
          </div>
        ) : users.length === 0 ? (
          <p className="p-6 text-sm font-semibold text-slate-600">
            Aucun utilisateur trouvé.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-6 py-4 text-left font-bold uppercase">
                    Nom
                  </th>
                  <th className="px-6 py-4 text-left font-bold uppercase">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left font-bold uppercase">
                    Rôle
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 bg-white">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-blue-50/40">
                    <td className="px-6 py-5 font-semibold text-slate-950">
                      {user.name}
                    </td>
                    <td className="px-6 py-5 text-slate-600">{user.email}</td>
                    <td className="px-6 py-5">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getRoleColor(
                          user.role
                        )}`}
                      >
                        {user.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
