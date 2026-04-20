import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { to: "/dashboard", label: "Tableau de bord" },
  { to: "/traitements", label: "Traitements" },
  { to: "/profile", label: "Profil" },
];

export default function Sidebar() {
  const { role } = useAuth();
  const items =
    role === "CPD"
      ? [...navItems, { to: "/users", label: "Utilisateurs" }]
      : navItems;

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-slate-200 bg-white/95 px-6 py-8 shadow-sm backdrop-blur lg:block">
      <div className="mb-10 border-b border-slate-200 pb-8">
        <Link
          to="/login"
          className="block text-xl font-bold leading-7 text-slate-950 transition-colors hover:text-blue-700"
        >
          CNRST Data Protection System
        </Link>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Registre des traitements au quotidien
        </p>
      </div>

      <nav className="space-y-3">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `block rounded-xl border px-5 py-4 text-sm font-semibold transition-colors ${
                isActive
                  ? "border-blue-100 bg-blue-50 text-blue-800 shadow-sm"
                  : "border-transparent text-slate-600 hover:border-blue-100 hover:bg-blue-50 hover:text-blue-800"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
