
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Sidebar() {
  const { role } = useAuth();

  return (
    <div className="w-64 h-screen bg-gray-900 text-white p-4">
      <h2 className="text-xl font-bold mb-6">CNRST RGPD</h2>

      <nav className="space-y-3">
        <Link to="/dashboard" className="block hover:text-blue-400">
          Dashboard
        </Link>

        <Link to="/traitements" className="block hover:text-blue-400">
          Traitements
        </Link>

        
        {role === "CPD" && (
          <Link to="/users" className="block hover:text-blue-400">
            Utilisateurs
          </Link>
        )}
      </nav>
    </div>
  );
}