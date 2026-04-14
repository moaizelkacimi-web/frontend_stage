export default function SearchFilters({ filters, setFilters, onSearch, onReset }) {
  const handleChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="mb-6 rounded-2xl bg-white p-4 shadow">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        <input
          type="text"
          name="search"
          value={filters.search}
          onChange={handleChange}
          placeholder="Recherche par intitulé ou finalité"
          className="rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          name="statut"
          value={filters.statut}
          onChange={handleChange}
          className="rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Tous les statuts</option>
          <option value="BROUILLON">Brouillon</option>
          <option value="SOUMIS">Soumis</option>
          <option value="VALIDE">Validé</option>
          <option value="ARCHIVE">Archivé</option>
        </select>

        <input
          type="text"
          name="responsable"
          value={filters.responsable}
          onChange={handleChange}
          placeholder="Responsable"
          className="rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          name="statut_cndp"
          value={filters.statut_cndp}
          onChange={handleChange}
          className="rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Tous statuts CNDP</option>
          <option value="NON DÉCLARÉ">Non déclaré</option>
          <option value="EN COURS">En cours</option>
          <option value="DÉCLARÉ">Déclaré</option>
          <option value="AUTORISÉ">Autorisé</option>
        </select>

        <div className="flex gap-2">
          <button
            onClick={onSearch}
            className="flex-1 rounded-xl bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700"
          >
            Rechercher
          </button>

          <button
            onClick={onReset}
            className="flex-1 rounded-xl border px-4 py-3 font-medium text-gray-700 hover:bg-gray-50"
          >
            Réinitialiser
          </button>
        </div>
      </div>
    </div>
  );
}