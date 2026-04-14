
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <h1 className="font-bold text-lg">Application RGPD</h1>

      <div className="flex items-center gap-4">
        <span className="text-sm">
          {user?.name} ({user?.role})
        </span>

        <button
          onClick={logout}
          className="bg-red-500 text-white px-3 py-1 rounded-lg"
        >
          Déconnexion
        </button>
      </div>
    </div>
  );
}