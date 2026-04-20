import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import Alert from "../../components/common/Alert";
import Card from "../../components/common/Card";
import Loader from "../../components/common/Loader";
import TraitementForm from "./TraitementForm";

export default function TraitementEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [traitement, setTraitement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    fetchTraitement();
    
  }, [id]);

  const fetchTraitement = async () => {
    setLoading(true);
    setServerError("");

    try {
      const res = await api.get(`/api/traitements/${id}`);
      setTraitement(res.data.data || res.data);
    } catch (error) {
      console.error(error);
      setServerError(
        error.response?.data?.message ||
          "Erreur lors du chargement de la fiche."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (formData) => {
    setSubmitting(true);
    setServerError("");

    try {
      await api.put(`/api/traitements/${id}`, formData);
      navigate("/traitements", {
        state: { successMessage: "Fiche modifiée avec succès" },
      });
    } catch (error) {
      console.error(error);
      setServerError(
        error.response?.data?.message ||
          "Erreur lors de la modification"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader label="Chargement de la fiche..." />;

  if (!traitement) {
    return (
      <Card className="p-6">
        <p className="text-sm font-semibold text-gray-700">Fiche introuvable.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
          Registre RGPD
        </p>
        <h1 className="mt-2 text-2xl font-bold text-slate-950 sm:text-3xl">
          Modifier la fiche de traitement
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          Ajustez les informations de la fiche avant de revenir au registre.
        </p>
      </div>

      {serverError && (
        <Alert type="error">{serverError}</Alert>
      )}

      <Card className="p-6 sm:p-8">
        {submitting ? (
          <Loader label="Modification de la fiche en cours..." />
        ) : (
          <TraitementForm
            initialData={traitement}
            onSubmit={handleUpdate}
            submitting={submitting}
          />
        )}
      </Card>
    </div>
  );
}
