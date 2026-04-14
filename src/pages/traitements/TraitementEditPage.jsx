import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import Loader from "../../components/common/Loader";
import TraitementForm from "../../components/traitements/TraitementForm";

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
      navigate("/traitements");
    } catch (error) {
      console.error(error);
      setServerError(
        error.response?.data?.message ||
          "Erreur lors de la modification de la fiche."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  if (!traitement) {
    return <div>Fiche introuvable</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Modifier la fiche de traitement
        </h1>
        <p className="mt-1 text-gray-600">
          Mise à jour des informations de la fiche
        </p>
      </div>

      {serverError && (
        <div className="mb-4 rounded-xl bg-red-100 px-4 py-3 text-red-700">
          {serverError}
        </div>
      )}

      <div className="rounded-2xl bg-white p-6 shadow">
        <TraitementForm
          initialData={traitement}
          onSubmit={handleUpdate}
          submitting={submitting}
        />
      </div>
    </div>
  );
}