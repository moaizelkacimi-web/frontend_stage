import { useEffect, useState } from "react";
import api from "../../api/axios";
import Card from "../../components/common/Card";
import Loader from "../../components/common/Loader";
import StatusBadge from "../../components/common/StatusBadge";
import { useAuth } from "../../context/AuthContext";

const initialStats = {
  byStatut: {
    BROUILLON: 0,
    SOUMIS: 0,
    VALIDE: 0,
    ARCHIVE: 0,
  },
  byStatutCndp: {
    "NON DÉCLARÉ": 0,
    "EN COURS": 0,
    "DÉCLARÉ": 0,
    "AUTORISÉ": 0,
  },
  lastModified: [],
  pendingValidation: [],
};

export default function DashboardPage() {
  const { user, role } = useAuth();

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [stats, setStats] = useState(initialStats);

  const fetchDashboardStats = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const res = await api.get("/api/dashboard/stats");
      const data = res.data;

      setStats({
        byStatut: {
          BROUILLON: data.byStatut?.BROUILLON || 0,
          SOUMIS: data.byStatut?.SOUMIS || 0,
          VALIDE: data.byStatut?.["VALIDÉ"] || data.byStatut?.VALIDE || 0,
          ARCHIVE: data.byStatut?.["ARCHIVÉ"] || data.byStatut?.ARCHIVE || 0,
        },
        byStatutCndp: {
          "NON DÉCLARÉ": data.byStatutCndp?.["NON DÉCLARÉ"] || 0,
          "EN COURS": data.byStatutCndp?.["EN COURS"] || 0,
          "DÉCLARÉ": data.byStatutCndp?.["DÉCLARÉ"] || 0,
          "AUTORISÉ": data.byStatutCndp?.["AUTORISÉ"] || 0,
        },
        lastModified: data.lastModified || [],
        pendingValidation: data.pendingValidation || [],
      });
    } catch (error) {
      console.error("Erreur dashboard :", error);
      setErrorMessage(
        error.response?.data?.message ||
          "Impossible de charger les donnees du tableau de bord."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  if (loading) return <Loader label="Chargement du tableau de bord..." />;

  const totalFiches =
    stats.byStatut.BROUILLON +
    stats.byStatut.SOUMIS +
    stats.byStatut.VALIDE +
    stats.byStatut.ARCHIVE;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
          Vue d'ensemble
        </p>
        <h1 className="mt-2 text-2xl font-bold text-slate-950 sm:text-3xl">
          Tableau de bord
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          Bonjour {user?.name || "Utilisateur"}, voici les points utiles pour
          suivre les fiches et les actions en attente.
        </p>
      </div>

      {errorMessage && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-5">
        <StatCard title="Total fiches" value={totalFiches} tone="blue" />
        <StatCard title="Brouillons" value={stats.byStatut.BROUILLON} />
        <StatCard title="Soumis" value={stats.byStatut.SOUMIS} tone="amber" />
        <StatCard title="Valides" value={stats.byStatut.VALIDE} tone="green" />
        <StatCard title="Archives" value={stats.byStatut.ARCHIVE} />
      </div>

      <Card className="p-6 sm:p-8">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-950">Suivi CNDP</h2>
          <p className="mt-1 text-sm text-slate-500">
            Une lecture rapide de l'avancement des declarations.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Non declare"
            value={stats.byStatutCndp["NON DÉCLARÉ"]}
            compact
            tone="red"
          />
          <StatCard
            title="En cours"
            value={stats.byStatutCndp["EN COURS"]}
            compact
            tone="amber"
          />
          <StatCard
            title="Declare"
            value={stats.byStatutCndp["DÉCLARÉ"]}
            compact
            tone="indigo"
          />
          <StatCard
            title="Autorise"
            value={stats.byStatutCndp["AUTORISÉ"]}
            compact
            tone="green"
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
        <Card className="overflow-hidden xl:col-span-2">
          <div className="border-b border-slate-200 px-6 py-5">
            <h2 className="text-lg font-bold text-slate-950">
              Activite recente
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Les dernieres fiches modifiees dans le registre.
            </p>
          </div>

          {stats.lastModified.length === 0 ? (
            <p className="p-6 text-sm text-slate-500">Aucune fiche recente.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                      Intitule
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                      Statut
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                      Date
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 bg-white">
                  {stats.lastModified.map((item) => (
                    <tr key={item.id} className="hover:bg-blue-50/40">
                      <td className="px-6 py-5 text-sm font-semibold text-slate-900">
                        {item.intitule}
                      </td>
                      <td className="px-6 py-5">
                        <StatusBadge status={item.statut} />
                      </td>
                      <td className="px-6 py-5 text-sm text-slate-600">
                        {item.updated_at || item.created_at || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <Card className="p-6 sm:p-8">
          <h2 className="text-lg font-bold text-slate-950">A surveiller</h2>
          <p className="mt-1 text-sm text-slate-500">
            Les elements qui peuvent demander une action.
          </p>

          <div className="mt-6 space-y-4">
            {role !== "CPD" ? (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
                Consultation des alertes reservee au CPD.
              </div>
            ) : stats.pendingValidation.length === 0 ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-sm font-medium text-emerald-800">
                Aucune fiche en attente.
              </div>
            ) : (
              stats.pendingValidation.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-amber-200 bg-amber-50 p-5 hover:border-amber-300"
                >
                  <p className="font-semibold text-slate-950">
                    {item.intitule}
                  </p>
                  <p className="mt-1 text-sm font-medium text-amber-800">
                    En attente de validation
                  </p>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, tone = "gray", compact = false }) {
  const tones = {
    gray: "border-slate-200 bg-white hover:border-blue-100 hover:bg-blue-50/30",
    blue: "border-blue-200 bg-blue-50 hover:border-blue-300",
    amber: "border-amber-200 bg-amber-50 hover:border-amber-300",
    green: "border-emerald-200 bg-emerald-50 hover:border-emerald-300",
    red: "border-red-200 bg-red-50 hover:border-red-300",
    indigo: "border-indigo-200 bg-indigo-50 hover:border-indigo-300",
  };

  return (
    <div className={`rounded-xl border p-6 transition-colors ${tones[tone]}`}>
      <p className="text-sm font-semibold text-slate-600">{title}</p>
      <p
        className={`mt-3 font-bold text-slate-950 ${
          compact ? "text-2xl" : "text-3xl"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
