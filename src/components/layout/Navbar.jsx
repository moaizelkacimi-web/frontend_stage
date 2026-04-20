import { Link, NavLink } from "react-router-dom";
import Button from "../common/Button";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-5 py-5 shadow-sm backdrop-blur sm:px-8 lg:px-10">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
            Espace de travail RGPD
          </p>
          <h1 className="text-lg font-bold text-slate-950">
            Gestion des fiches de traitement
          </h1>
        </div>

        <nav className="flex gap-3 lg:hidden">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${
                isActive
                  ? "border-blue-100 bg-blue-50 text-blue-800"
                  : "border-transparent text-slate-600 hover:border-blue-100 hover:bg-blue-50 hover:text-blue-800"
              }`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/traitements"
            className={({ isActive }) =>
              `rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${
                isActive
                  ? "border-blue-100 bg-blue-50 text-blue-800"
                  : "border-transparent text-slate-600 hover:border-blue-100 hover:bg-blue-50 hover:text-blue-800"
              }`
            }
          >
            Traitements
          </NavLink>
        </nav>

        <div className="flex flex-wrap items-center gap-4">
          <Link
            to="/profile"
            className="min-w-0 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 transition-colors hover:border-blue-200 hover:bg-blue-50"
          >
            <p className="truncate text-sm font-semibold text-slate-900">
              {user?.name || "Utilisateur"}
            </p>
            <p className="text-xs font-medium text-slate-500">
              {user?.role || "Role non defini"}
            </p>
          </Link>

          <Button type="button" variant="secondary" size="sm" onClick={logout}>
            Deconnexion
          </Button>
        </div>
      </div>
    </header>
  );
}
