// src/pages/dashboard/DashboardPage.jsx
import { useAuth } from "../../context/AuthContext";

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

        <p><strong>Nom :</strong> {user?.name}</p>
        <p><strong>Email :</strong> {user?.email}</p>
        <p><strong>Rôle :</strong> {user?.role}</p>

        <button
          onClick={logout}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg"
        >
          Déconnexion
        </button>
      </div>
    </div>
  );
}