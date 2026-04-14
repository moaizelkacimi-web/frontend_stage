import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import TraitementForm from "../../components/traitements/TraitementForm";

export default function TraitementCreatePage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleCreate = async (formData) => {
    setSubmitting(true);
    setServerError("");

    try {
      await api.post("/api/traitements", formData);
      navigate("/traitements");
    } catch (error) {
      console.error(error);
      setServerError(
        error.response?.data?.message ||
          "Erreur lors de la création de la fiche."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Nouvelle fiche de traitement
        </h1>
        <p className="mt-1 text-gray-600">
          Créer une nouvelle fiche conforme au registre RGPD
        </p>
      </div>

      {serverError && (
        <div className="mb-4 rounded-xl bg-red-100 px-4 py-3 text-red-700">
          {serverError}
        </div>
      )}

      <div className="rounded-2xl bg-white p-6 shadow">
        <TraitementForm onSubmit={handleCreate} submitting={submitting} />
      </div>
    </div>
  );
}