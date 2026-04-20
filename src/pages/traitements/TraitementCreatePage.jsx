import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Alert from "../../components/common/Alert";
import Card from "../../components/common/Card";
import Loader from "../../components/common/Loader";
import TraitementForm from "./TraitementForm";

export default function TraitementCreatePage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleCreate = async (formData) => {
    setSubmitting(true);
    setServerError("");

    try {
      await api.post("/api/traitements", formData);
      navigate("/traitements", {
        state: { successMessage: "Fiche créée avec succès" },
      });
    } catch (error) {
      console.error(error);
      setServerError(
        error.response?.data?.message ||
          "Erreur lors de la création"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
          Registre RGPD
        </p>
        <h1 className="mt-2 text-2xl font-bold text-slate-950 sm:text-3xl">
          Nouvelle fiche de traitement
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          Renseignez les informations essentielles avant la validation.
        </p>
      </div>

      {serverError && (
        <Alert type="error">{serverError}</Alert>
      )}

      <Card className="p-6 sm:p-8">
        {submitting ? (
          <Loader label="Création de la fiche en cours..." />
        ) : (
          <TraitementForm onSubmit={handleCreate} submitting={submitting} />
        )}
      </Card>
    </div>
  );
}
