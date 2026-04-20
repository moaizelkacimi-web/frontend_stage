import Button from "../common/Button";
import Card from "../common/Card";

export default function SearchFilters({ filters, setFilters, onSearch, onReset }) {
  const handleChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <Card className="p-6 sm:p-8">
      <div className="mb-6">
        <h2 className="text-base font-bold text-slate-950">Recherche rapide</h2>
        <p className="mt-1 text-sm text-slate-500">
          Retrouvez une fiche par intitule, responsable ou statut.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-5">
        <Field label="Recherche">
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleChange}
            placeholder="Intitule ou finalite"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 hover:border-blue-200 focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
          />
        </Field>

        <Field label="Statut">
          <select
            name="statut"
            value={filters.statut}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors hover:border-blue-200 focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
          >
            <option value="">Tous les statuts</option>
            <option value="BROUILLON">Brouillon</option>
            <option value="SOUMIS">Soumis</option>
            <option value="VALIDE">Valide</option>
            <option value="ARCHIVE">Archive</option>
          </select>
        </Field>

        <Field label="Responsable">
          <input
            type="text"
            name="responsable"
            value={filters.responsable}
            onChange={handleChange}
            placeholder="Service ou direction"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 hover:border-blue-200 focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
          />
        </Field>

        <Field label="Statut CNDP">
          <select
            name="statut_cndp"
            value={filters.statut_cndp}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors hover:border-blue-200 focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
          >
            <option value="">Tous les statuts CNDP</option>
            <option value="NON DÉCLARÉ">Non declare</option>
            <option value="EN COURS">En cours</option>
            <option value="DÉCLARÉ">Declare</option>
            <option value="AUTORISÉ">Autorise</option>
          </select>
        </Field>

        <div className="grid min-w-0 grid-cols-1 gap-3 self-end sm:grid-cols-2 xl:grid-cols-1">
          <Button type="button" onClick={onSearch} className="w-full">
            Rechercher
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={onReset}
            className="w-full"
          >
            Reinitialiser
          </Button>
        </div>
      </div>
    </Card>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-slate-700">
        {label}
      </span>
      {children}
    </label>
  );
}
