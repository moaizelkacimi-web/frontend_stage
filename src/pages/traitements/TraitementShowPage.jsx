import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import Loader from "../../components/common/Loader";
import StatusBadge from "../../components/common/StatusBadge";
import { useAuth } from "../../context/AuthContext";

export default function TraitementShowPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role } = useAuth();

  const [traitement, setTraitement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchTraitement();
  }, [id]);

  const fetchTraitement = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      // ===== VERSION BACKEND =====
      // const res = await api.get(`/api/traitements/${id}`);
      // setTraitement(res.data.data || res.data);

      // ===== VERSION TEST SANS BACKEND =====
      setTimeout(() => {
        setTraitement({
          id: Number(id),
          intitule: "Gestion des dossiers RH",
          finalite: "Assurer la gestion administrative des ressources humaines.",
          base_legale: "OBLIGATION_LEGALE",
          responsable: "Direction RH",
          categories_donnees: ["IDENTITE", "PROFESSIONNELLES"],
          personnes_concernees: "Agents",
          destinataires: "Service RH, Direction",
          duree_conservation: "5 ans après fin de contrat",
          mesures_securite: "Contrôle d'accès, sauvegardes, chiffrement",
          statut_cndp: "EN COURS",
          statut: "BROUILLON",
          created_at: "2026-04-14",
        });
        setLoading(false);
      }, 500);

      return;
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error.response?.data?.message ||
          "Erreur lors du chargement de la fiche."
      );
      setLoading(false);
    }
  };

  const handleWorkflowAction = async (action) => {
    setActionLoading(true);
    setErrorMessage("");

    try {
      // ===== VERSION BACKEND =====
      // await api.patch(`/api/traitements/${id}/${action}`);
      // await fetchTraitement();

      // ===== VERSION TEST SANS BACKEND =====
      setTimeout(() => {
        setTraitement((prev) => {
          if (!prev) return prev;

          if (action === "soumettre") {
            return { ...prev, statut: "SOUMIS" };
          }

          if (action === "valider") {
            return { ...prev, statut: "VALIDÉ" };
          }

          if (action === "rejeter") {
            return { ...prev, statut: "BROUILLON" };
          }

          if (action === "archiver") {
            return { ...prev, statut: "ARCHIVÉ" };
          }

          return prev;
        });

        setActionLoading(false);
      }, 400);

      return;
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error.response?.data?.message ||
          "Erreur lors de l'action sur la fiche."
      );
      setActionLoading(false);
    }
  };

  if (loading) return <Loader />;

  if (!traitement) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow">
        <p className="text-gray-600">Fiche introuvable.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Détail de la fiche
          </h1>
          <p className="mt-1 text-gray-600">
            Consultation complète de la fiche de traitement
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => navigate("/traitements")}
            className="rounded-xl border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Retour
          </button>

          {(role === "DAG" || role === "CPD") && (
            <button
              onClick={() => navigate(`/traitements/${traitement.id}/edit`)}
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Modifier
            </button>
          )}
        </div>
      </div>

      {errorMessage && (
        <div className="rounded-xl bg-red-100 px-4 py-3 text-red-700">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow lg:col-span-2">
          <h2 className="mb-6 text-xl font-semibold text-gray-800">
            Informations générales
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <InfoBlock label="Intitulé" value={traitement.intitule} />
            <InfoBlock
              label="Responsable du traitement"
              value={traitement.responsable}
            />
            <InfoBlock
              label="Base légale"
              value={traitement.base_legale?.replaceAll("_", " ")}
            />
            <InfoBlock label="Statut CNDP" value={<StatusBadge status={traitement.statut_cndp} />} />
            <InfoBlock label="Statut de la fiche" value={<StatusBadge status={traitement.statut} />} />
            <InfoBlock label="Durée de conservation" value={traitement.duree_conservation} />
          </div>

          <div className="mt-6 space-y-6">
            <InfoBlock label="Finalité" value={traitement.finalite} full />
            <InfoBlock
              label="Personnes concernées"
              value={traitement.personnes_concernees}
              full
            />
            <InfoBlock label="Destinataires" value={traitement.destinataires} full />
            <InfoBlock
              label="Mesures de sécurité"
              value={traitement.mesures_securite}
              full
            />

            <div>
              <p className="mb-2 text-sm font-medium text-gray-500">
                Catégories de données
              </p>
              <div className="flex flex-wrap gap-2">
                {traitement.categories_donnees?.map((categorie) => (
                  <span
                    key={categorie}
                    className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
                  >
                    {categorie.replaceAll("_", " ")}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            Actions workflow
          </h2>

          <p className="mb-4 text-sm text-gray-600">
            Le workflow dépend du rôle et du statut courant de la fiche.
          </p>

          <div className="space-y-3">
            {role === "DAG" && traitement.statut === "BROUILLON" && (
              <button
                onClick={() => handleWorkflowAction("soumettre")}
                disabled={actionLoading}
                className="w-full rounded-xl bg-orange-500 px-4 py-3 font-medium text-white hover:bg-orange-600 disabled:opacity-60"
              >
                {actionLoading ? "Traitement..." : "Soumettre au CPD"}
              </button>
            )}

            {role === "CPD" && traitement.statut === "SOUMIS" && (
              <>
                <button
                  onClick={() => handleWorkflowAction("valider")}
                  disabled={actionLoading}
                  className="w-full rounded-xl bg-green-600 px-4 py-3 font-medium text-white hover:bg-green-700 disabled:opacity-60"
                >
                  {actionLoading ? "Traitement..." : "Valider"}
                </button>

                <button
                  onClick={() => handleWorkflowAction("rejeter")}
                  disabled={actionLoading}
                  className="w-full rounded-xl bg-red-600 px-4 py-3 font-medium text-white hover:bg-red-700 disabled:opacity-60"
                >
                  {actionLoading ? "Traitement..." : "Rejeter"}
                </button>
              </>
            )}

            {role === "CPD" && traitmentIsValidated(traitement.statut) && (
              <button
                onClick={() => handleWorkflowAction("archiver")}
                disabled={actionLoading}
                className="w-full rounded-xl bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {actionLoading ? "Traitement..." : "Archiver"}
              </button>
            )}

            {role === "JURIDIQUE" && (
              <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
                Consultation en lecture seule.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoBlock({ label, value, full = false }) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <p className="mb-1 text-sm font-medium text-gray-500">{label}</p>
      <div className="rounded-xl bg-gray-50 px-4 py-3 text-gray-800">
        {value || "-"}
      </div>
    </div>
  );
}

function traitmentIsValidated(status) {
  return status === "VALIDÉ" || status === "VALIDE";
}