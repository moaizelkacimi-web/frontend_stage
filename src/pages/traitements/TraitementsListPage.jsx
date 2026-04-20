import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Alert from "../../components/common/Alert";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import Loader from "../../components/common/Loader";
import Pagination from "../../components/common/Pagination";
import StatusBadge from "../../components/common/StatusBadge";
import SearchFilters from "../../components/traitements/SearchFilters";
import { useAuth } from "../../context/AuthContext";

export default function TraitementsListPage() {
  const { role } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [traitements, setTraitements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(
    location.state?.successMessage || ""
  );
  const [errorMessage, setErrorMessage] = useState("");

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
    setErrorMessage("");

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
      setErrorMessage(
        error.response?.data?.message ||
          "Erreur lors du chargement des traitements."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!location.state?.successMessage) return;

    navigate(location.pathname, { replace: true, state: {} });
  }, [location.pathname, location.state, navigate]);

  useEffect(() => {
    if (!successMessage) return;

    const timeout = window.setTimeout(() => setSuccessMessage(""), 4000);
    return () => window.clearTimeout(timeout);
  }, [successMessage]);

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

  const handleExportExcel = async () => {
    setExporting(true);
    setErrorMessage("");

    try {
      const res = await api.get("/api/traitements/export/excel", {
        responseType: "blob",
      });

      downloadBlob(
        res.data,
        `liste-traitements-${new Date().toISOString().slice(0, 10)}.xlsx`
      );
    } catch (error) {
      console.error("Erreur export Excel :", error);
      setErrorMessage(
        error.response?.data?.message || "Erreur lors de l'export Excel."
      );
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
            Registre RGPD
          </p>
          <h1 className="mt-2 text-2xl font-bold text-slate-950 sm:text-3xl">
            Fiches de traitement
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
            Parcourez le registre, controlez les statuts et accedez rapidement
            aux actions utiles.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            variant="secondary"
            size="lg"
            onClick={handleExportExcel}
            disabled={exporting}
          >
            {exporting ? "Export..." : "Exporter Excel"}
          </Button>

          {(role === "DAG" || role === "CPD") && (
            <Button as={Link} to="/traitements/create" size="lg">
              Nouvelle fiche
            </Button>
          )}
        </div>
      </div>

      {successMessage && <Alert type="success">{successMessage}</Alert>}
      {errorMessage && <Alert type="error">{errorMessage}</Alert>}

      <SearchFilters
        filters={filters}
        setFilters={setFilters}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      <Card className="overflow-hidden">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="text-lg font-bold text-slate-950">
            Registre courant
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {traitements.length} resultat(s) affiche(s)
          </p>
        </div>

        {loading ? (
          <div className="p-6">
            <Loader label="Chargement des traitements..." />
          </div>
        ) : traitements.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-sm font-semibold text-slate-700">
              Aucun traitement trouve.
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Modifiez les filtres ou creez une nouvelle fiche.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                      Intitule
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                      Responsable
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                      Statut
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                      Statut CNDP
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 bg-white">
                  {traitements.map((traitement) => (
                    <tr key={traitement.id} className="hover:bg-blue-50/40">
                      <td className="px-6 py-5 text-sm font-semibold text-slate-950">
                        {traitement.intitule}
                      </td>

                      <td className="px-6 py-5 text-sm text-slate-600">
                        {traitement.responsable || "-"}
                      </td>

                      <td className="px-6 py-5">
                        <StatusBadge status={traitement.statut} />
                      </td>

                      <td className="px-6 py-5">
                        <StatusBadge status={traitement.statut_cndp} />
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex justify-end gap-3">
                          <Button
                            as={Link}
                            to={`/traitements/${traitement.id}`}
                            variant="secondary"
                            size="sm"
                          >
                            Voir
                          </Button>

                          {(role === "DAG" || role === "CPD") && (
                            <Button
                              as={Link}
                              to={`/traitements/${traitement.id}/edit`}
                              size="sm"
                            >
                              Modifier
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              currentPage={pagination.current_page}
              lastPage={pagination.last_page}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </Card>
    </div>
  );
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
