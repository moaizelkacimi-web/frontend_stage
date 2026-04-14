import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import Loader from "../../components/common/Loader";
import Pagination from "../../components/common/Pagination";
import StatusBadge from "../../components/common/StatusBadge";
import SearchFilters from "../../components/traitements/SearchFilters";
import { useAuth } from "../../context/AuthContext";

export default function TraitementsListPage() {
  const { role } = useAuth();

  const [traitements, setTraitements] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    search: "",
    statut: "",
    responsable: "",
    statut_cndp: "",
  });

  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
  });

  const fetchTraitements = async (page = 1, customFilters = filters) => {
    setLoading(true);

    try {
      const res = await api.get("/api/traitements", {
        params: {
          page,
          search: customFilters.search,
          statut: customFilters.statut,
          responsable: customFilters.responsable,
          statut_cndp: customFilters.statut_cndp,
        },
      });

      const responseData = res.data;

      setTraitements(responseData.data || []);
      setPagination({
        current_page: responseData.current_page || 1,
        last_page: responseData.last_page || 1,
      });
    } catch (error) {
      console.error("Erreur lors du chargement des traitements :", error);
      setTraitements([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTraitements();
  }, []);

  const handleSearch = () => {
    fetchTraitements(1, filters);
  };

  const handleReset = () => {
    const resetFilters = {
      search: "",
      statut: "",
      responsable: "",
      statut_cndp: "",
    };

    setFilters(resetFilters);
    fetchTraitements(1, resetFilters);
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > pagination.last_page) return;
    fetchTraitements(page);
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Liste des traitements
          </h1>
          <p className="mt-1 text-gray-600">
            Consultation, recherche et suivi des fiches de traitement
          </p>
        </div>

        {(role === "DAG" || role === "CPD") && (
          <Link
            to="/traitements/create"
            className="rounded-xl bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
          >
            + Nouvelle fiche
          </Link>
        )}
      </div>

      <SearchFilters
        filters={filters}
        setFilters={setFilters}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      <div className="overflow-hidden rounded-2xl bg-white shadow">
        {loading ? (
          <Loader />
        ) : traitements.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Aucun traitement trouvé.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr className="text-left text-sm text-gray-600">
                  <th className="px-6 py-4">Intitulé</th>
                  <th className="px-6 py-4">Responsable</th>
                  <th className="px-6 py-4">Statut</th>
                  <th className="px-6 py-4">Statut CNDP</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {traitements.map((traitement) => (
                  <tr
                    key={traitement.id}
                    className="border-t text-sm hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {traitement.intitule}
                    </td>

                    <td className="px-6 py-4 text-gray-700">
                      {traitement.responsable}
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge status={traitement.statut} />
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge status={traitement.statut_cndp} />
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Link
                          to={`/traitements/${traitement.id}`}
                          className="rounded-lg bg-gray-100 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-200"
                        >
                          Voir
                        </Link>

                        {(role === "DAG" || role === "CPD") && (
                          <Link
                            to={`/traitements/${traitement.id}/edit`}
                            className="rounded-lg bg-blue-100 px-3 py-2 text-xs font-medium text-blue-700 hover:bg-blue-200"
                          >
                            Modifier
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="p-4">
              <Pagination
                currentPage={pagination.current_page}
                lastPage={pagination.last_page}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}