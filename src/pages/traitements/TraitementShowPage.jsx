import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import Alert from "../../components/common/Alert";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import Loader from "../../components/common/Loader";
import StatusBadge from "../../components/common/StatusBadge";
import { useAuth } from "../../context/AuthContext";

function normalizeCategories(categories) {
  if (Array.isArray(categories)) return categories;
  if (!categories) return [];

  try {
    const parsedCategories = JSON.parse(categories);
    return Array.isArray(parsedCategories) ? parsedCategories : [];
  } catch {
    return [];
  }
}

export default function TraitementShowPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role } = useAuth();

  const [traitement, setTraitement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fetchTraitement = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const res = await api.get(`/api/traitements/${id}`);
      setTraitement(res.data.data || res.data);
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error.response?.data?.message ||
          "Erreur lors du chargement de la fiche."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTraitement();
    
  }, [id]);

  const handleWorkflowAction = async (action) => {
    setActionLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await api.patch(`/api/traitements/${id}/${action}`);
      await fetchTraitement();
      setSuccessMessage("Action effectuée avec succès");
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error.response?.data?.message ||
          "Erreur lors de l'action sur la fiche."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleExportPdf = async () => {
    setExportLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const res = await api.get(`/api/traitements/${id}/export/pdf`, {
        responseType: "blob",
      });

      downloadBlob(res.data, `fiche-traitement-${id}.pdf`);
    } catch (error) {
      console.error("Erreur export PDF :", error);
      setErrorMessage(
        error.response?.data?.message || "Erreur lors de l'export PDF."
      );
    } finally {
      setExportLoading(false);
    }
  };

  if (loading) return <Loader label="Chargement de la fiche..." />;

  if (!traitement) {
    return (
      <Card className="p-6">
        <p className="text-sm font-semibold text-slate-700">Fiche introuvable.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
            Fiche de traitement
          </p>
          <h1 className="mt-2 text-2xl font-bold text-slate-950 sm:text-3xl">
            {traitement.intitule}
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
            Retrouvez les informations cles, les statuts et les actions
            disponibles.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/traitements")}
          >
            Retour
          </Button>

          {(role === "DAG" || role === "CPD") && (
            <Button
              type="button"
              onClick={() => navigate(`/traitements/${traitement.id}/edit`)}
            >
              Modifier
            </Button>
          )}

          <Button
            type="button"
            variant="secondary"
            onClick={handleExportPdf}
            disabled={exportLoading}
          >
            {exportLoading ? "Export..." : "Exporter PDF"}
          </Button>
        </div>
      </div>

      {errorMessage && (
        <Alert type="error">{errorMessage}</Alert>
      )}
      {successMessage && <Alert type="success">{successMessage}</Alert>}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <Card className="p-6 sm:p-8 lg:col-span-2">
          <div className="mb-8 flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-950">
                Informations generales
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Le resume utile avant toute action.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <StatusBadge status={traitement.statut} />
              <StatusBadge status={traitement.statut_cndp} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <InfoBlock label="Responsable" value={traitement.responsable} />
            <InfoBlock
              label="Base legale"
              value={traitement.base_legale?.replaceAll("_", " ")}
            />
            <InfoBlock
              label="Duree de conservation"
              value={traitement.duree_conservation}
            />
            <InfoBlock
              label="Personnes concernees"
              value={traitement.personnes_concernees}
            />
          </div>

          <div className="mt-8 space-y-6">
            <InfoBlock label="Finalite" value={traitement.finalite} full />
            <InfoBlock label="Destinataires" value={traitement.destinataires} full />
            <InfoBlock
              label="Mesures de securite"
              value={traitement.mesures_securite}
              full
            />

            <div>
              <p className="mb-2 text-sm font-semibold text-slate-700">
                Categories de donnees
              </p>
              <div className="flex flex-wrap gap-3">
                {normalizeCategories(traitement.categories_donnees).map((categorie) => (
                  <span
                    key={categorie}
                    className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-blue-200 hover:bg-blue-50"
                  >
                    {categorie.replaceAll("_", " ")}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 sm:p-8">
          <h2 className="text-lg font-bold text-slate-950">Workflow</h2>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            Les actions utiles selon votre role et le statut courant.
          </p>

          <div className="mt-6 space-y-4">
            {role === "DAG" && traitement.statut === "BROUILLON" && (
              <Button
                type="button"
                variant="warning"
                onClick={() => handleWorkflowAction("soumettre")}
                disabled={actionLoading}
                className="w-full"
              >
                {actionLoading ? "Traitement..." : "Soumettre au CPD"}
              </Button>
            )}

            {role === "CPD" && traitement.statut === "SOUMIS" && (
              <>
                <Button
                  type="button"
                  variant="success"
                  onClick={() => handleWorkflowAction("valider")}
                  disabled={actionLoading}
                  className="w-full"
                >
                  {actionLoading ? "Traitement..." : "Valider"}
                </Button>

                <Button
                  type="button"
                  variant="danger"
                  onClick={() => handleWorkflowAction("rejeter")}
                  disabled={actionLoading}
                  className="w-full"
                >
                  {actionLoading ? "Traitement..." : "Rejeter"}
                </Button>
              </>
            )}

            {role === "CPD" && traitmentIsValidated(traitement.statut) && (
              <Button
                type="button"
                onClick={() => handleWorkflowAction("archiver")}
                disabled={actionLoading}
                className="w-full"
              >
                {actionLoading ? "Traitement..." : "Archiver"}
              </Button>
            )}

            {role === "JURIDIQUE" && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm font-medium text-slate-600">
                Consultation en lecture seule.
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

function InfoBlock({ label, value, full = false }) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <p className="mb-1.5 text-sm font-semibold text-slate-700">{label}</p>
      <div className="min-h-12 rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm leading-6 text-slate-800">
        {value || "-"}
      </div>
    </div>
  );
}

function traitmentIsValidated(status) {
  return status === "VALIDÉ" || status === "VALIDE";
}

function downloadBlob(blob, filename) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

