import { useState } from "react";
import Button from "../../components/common/Button";

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

const statutCndpOptions = ["NON DÉCLARÉ", "EN COURS", "DÉCLARÉ", "AUTORISÉ"];

const inputClass =
  "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 hover:border-blue-200 focus:border-blue-700 focus:ring-4 focus:ring-blue-100";

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
    categories_donnees: normalizeCategories(initialData?.categories_donnees),
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
      newErrors.categories_donnees = "Selectionnez au moins une categorie";
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
    <form onSubmit={submitForm} className="space-y-10">
      <FormSection
        title="Identification"
        description="Les informations qui permettent d'identifier la fiche."
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Field label="Intitule du traitement" error={errors.intitule}>
            <input
              type="text"
              name="intitule"
              value={formData.intitule}
              onChange={handleChange}
              className={inputClass}
              placeholder="Ex : Gestion des dossiers RH"
            />
          </Field>

          <Field
            label="Responsable du traitement"
            error={errors.responsable}
          >
            <input
              type="text"
              name="responsable"
              value={formData.responsable}
              onChange={handleChange}
              className={inputClass}
              placeholder="Nom du service ou direction"
            />
          </Field>
        </div>

        <Field label="Finalite" error={errors.finalite}>
          <textarea
            name="finalite"
            value={formData.finalite}
            onChange={handleChange}
            rows="4"
            className={inputClass}
            placeholder="Pourquoi les donnees sont-elles collectees ?"
          />
        </Field>
      </FormSection>

      <FormSection
        title="Cadre juridique"
        description="Base legale, declaration CNDP et donnees concernees."
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Field label="Base legale" error={errors.base_legale}>
            <select
              name="base_legale"
              value={formData.base_legale}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Selectionner</option>
              {baseLegaleOptions.map((option) => (
                <option key={option} value={option}>
                  {option.replaceAll("_", " ")}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Statut CNDP" error={errors.statut_cndp}>
            <select
              name="statut_cndp"
              value={formData.statut_cndp}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Selectionner</option>
              {statutCndpOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-gray-700">
            Categories de donnees
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categoriesOptions.map((categorie) => (
              <label
                key={categorie}
                className={`flex items-center gap-3 rounded-xl border p-4 text-sm font-semibold transition ${
                  formData.categories_donnees.includes(categorie)
                    ? "border-blue-300 bg-blue-50 text-blue-900"
                    : "border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50/40"
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData.categories_donnees.includes(categorie)}
                  onChange={() => handleCheckboxChange(categorie)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-700 focus:ring-blue-700"
                />
                <span>{categorie.replaceAll("_", " ")}</span>
              </label>
            ))}
          </div>
          {errors.categories_donnees && (
            <p className="mt-2 text-sm font-medium text-red-700">
              {errors.categories_donnees}
            </p>
          )}
        </div>
      </FormSection>

      <FormSection
        title="Perimetre et securite"
        description="Personnes concernees, destinataires, conservation et securite."
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Field
            label="Personnes concernees"
            error={errors.personnes_concernees}
          >
            <input
              type="text"
              name="personnes_concernees"
              value={formData.personnes_concernees}
              onChange={handleChange}
              className={inputClass}
              placeholder="Ex : Agents, etudiants, prestataires"
            />
          </Field>

          <Field label="Duree de conservation" error={errors.duree_conservation}>
            <input
              type="text"
              name="duree_conservation"
              value={formData.duree_conservation}
              onChange={handleChange}
              className={inputClass}
              placeholder="Ex : 5 ans apres fin de contrat"
            />
          </Field>
        </div>

        <Field label="Destinataires" error={errors.destinataires}>
          <input
            type="text"
            name="destinataires"
            value={formData.destinataires}
            onChange={handleChange}
            className={inputClass}
            placeholder="Qui recoit les donnees ?"
          />
        </Field>

        <Field label="Mesures de securite" error={errors.mesures_securite}>
          <textarea
            name="mesures_securite"
            value={formData.mesures_securite}
            onChange={handleChange}
            rows="4"
            className={inputClass}
            placeholder="Ex : chiffrement, controle d'acces, sauvegardes..."
          />
        </Field>
      </FormSection>

      <div className="flex justify-end border-t border-gray-200 pt-8">
        <Button type="submit" size="lg" disabled={submitting}>
          {submitting ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </div>
    </form>
  );
}

function FormSection({ title, description, children }) {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-950">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
      <div className="space-y-6">{children}</div>
    </section>
  );
}

function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-slate-700">
        {label}
      </span>
      {children}
      {error && <p className="mt-2 text-sm font-medium text-red-700">{error}</p>}
    </label>
  );
}
