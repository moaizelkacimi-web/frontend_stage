import { useState } from "react";

const categoriesOptions = [
  "IDENTITE",
  "SANTE",
  "FINANCIERES",
  "PROFESSIONNELLES",
  "BIOMETRIQUES",
  "AUTRES",
];

const baseLegaleOptions = [
  "CONSENTEMENT",
  "OBLIGATION_LEGALE",
  "INTERET_LEGITIME",
  "MISSION_PUBLIQUE",
  "CONTRAT",
];

const statutCndpOptions = [
  "NON DÉCLARÉ",
  "EN COURS",
  "DÉCLARÉ",
  "AUTORISÉ",
];

export default function TraitementForm({
  initialData = null,
  onSubmit,
  submitting = false,
}) {
  const [formData, setFormData] = useState({
    intitule: initialData?.intitule || "",
    finalite: initialData?.finalite || "",
    base_legale: initialData?.base_legale || "",
    responsable: initialData?.responsable || "",
    categories_donnees: initialData?.categories_donnees || [],
    personnes_concernees: initialData?.personnes_concernees || "",
    destinataires: initialData?.destinataires || "",
    duree_conservation: initialData?.duree_conservation || "",
    mesures_securite: initialData?.mesures_securite || "",
    statut_cndp: initialData?.statut_cndp || "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCheckboxChange = (categorie) => {
    setFormData((prev) => {
      const exists = prev.categories_donnees.includes(categorie);

      return {
        ...prev,
        categories_donnees: exists
          ? prev.categories_donnees.filter((item) => item !== categorie)
          : [...prev.categories_donnees, categorie],
      };
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.intitule.trim()) newErrors.intitule = "Champ obligatoire";
    if (!formData.finalite.trim()) newErrors.finalite = "Champ obligatoire";
    if (!formData.base_legale) newErrors.base_legale = "Champ obligatoire";
    if (!formData.responsable.trim()) newErrors.responsable = "Champ obligatoire";
    if (formData.categories_donnees.length === 0)
      newErrors.categories_donnees = "Sélectionnez au moins une catégorie";
    if (!formData.personnes_concernees.trim())
      newErrors.personnes_concernees = "Champ obligatoire";
    if (!formData.destinataires.trim())
      newErrors.destinataires = "Champ obligatoire";
    if (!formData.duree_conservation.trim())
      newErrors.duree_conservation = "Champ obligatoire";
    if (!formData.mesures_securite.trim())
      newErrors.mesures_securite = "Champ obligatoire";
    if (!formData.statut_cndp) newErrors.statut_cndp = "Champ obligatoire";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitForm = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    onSubmit(formData);
  };

  return (
    <form onSubmit={submitForm} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Intitulé du traitement
          </label>
          <input
            type="text"
            name="intitule"
            value={formData.intitule}
            onChange={handleChange}
            className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex : Gestion des dossiers RH"
          />
          {errors.intitule && (
            <p className="mt-1 text-sm text-red-600">{errors.intitule}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Responsable du traitement
          </label>
          <input
            type="text"
            name="responsable"
            value={formData.responsable}
            onChange={handleChange}
            className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nom du service ou direction"
          />
          {errors.responsable && (
            <p className="mt-1 text-sm text-red-600">{errors.responsable}</p>
          )}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Finalité
        </label>
        <textarea
          name="finalite"
          value={formData.finalite}
          onChange={handleChange}
          rows="4"
          className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Pourquoi les données sont-elles collectées ?"
        />
        {errors.finalite && (
          <p className="mt-1 text-sm text-red-600">{errors.finalite}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Base légale
          </label>
          <select
            name="base_legale"
            value={formData.base_legale}
            onChange={handleChange}
            className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Sélectionner</option>
            {baseLegaleOptions.map((option) => (
              <option key={option} value={option}>
                {option.replaceAll("_", " ")}
              </option>
            ))}
          </select>
          {errors.base_legale && (
            <p className="mt-1 text-sm text-red-600">{errors.base_legale}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Statut CNDP
          </label>
          <select
            name="statut_cndp"
            value={formData.statut_cndp}
            onChange={handleChange}
            className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Sélectionner</option>
            {statutCndpOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.statut_cndp && (
            <p className="mt-1 text-sm text-red-600">{errors.statut_cndp}</p>
          )}
        </div>
      </div>

      <div>
        <label className="mb-3 block text-sm font-medium text-gray-700">
          Catégories de données
        </label>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {categoriesOptions.map((categorie) => (
            <label
              key={categorie}
              className="flex items-center gap-2 rounded-xl border p-3"
            >
              <input
                type="checkbox"
                checked={formData.categories_donnees.includes(categorie)}
                onChange={() => handleCheckboxChange(categorie)}
              />
              <span className="text-sm text-gray-700">
                {categorie.replaceAll("_", " ")}
              </span>
            </label>
          ))}
        </div>
        {errors.categories_donnees && (
          <p className="mt-1 text-sm text-red-600">
            {errors.categories_donnees}
          </p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Personnes concernées
        </label>
        <input
          type="text"
          name="personnes_concernees"
          value={formData.personnes_concernees}
          onChange={handleChange}
          className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ex : Agents, étudiants, prestataires"
        />
        {errors.personnes_concernees && (
          <p className="mt-1 text-sm text-red-600">
            {errors.personnes_concernees}
          </p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Destinataires
        </label>
        <input
          type="text"
          name="destinataires"
          value={formData.destinataires}
          onChange={handleChange}
          className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Qui reçoit les données ?"
        />
        {errors.destinataires && (
          <p className="mt-1 text-sm text-red-600">{errors.destinataires}</p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Durée de conservation
        </label>
        <input
          type="text"
          name="duree_conservation"
          value={formData.duree_conservation}
          onChange={handleChange}
          className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ex : 5 ans après fin de contrat"
        />
        {errors.duree_conservation && (
          <p className="mt-1 text-sm text-red-600">
            {errors.duree_conservation}
          </p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Mesures de sécurité
        </label>
        <textarea
          name="mesures_securite"
          value={formData.mesures_securite}
          onChange={handleChange}
          rows="4"
          className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ex : chiffrement, contrôle d’accès, sauvegardes..."
        />
        {errors.mesures_securite && (
          <p className="mt-1 text-sm text-red-600">
            {errors.mesures_securite}
          </p>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {submitting ? "Enregistrement..." : "Enregistrer"}
        </button>
      </div>
    </form>
  );
}