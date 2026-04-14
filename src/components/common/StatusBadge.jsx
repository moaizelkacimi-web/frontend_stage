export default function StatusBadge({ status }) {
  const styles = {
    BROUILLON: "bg-gray-200 text-gray-800",
    SOUMIS: "bg-orange-100 text-orange-700",
    VALIDE: "bg-green-100 text-green-700",
    VALIDÉ: "bg-green-100 text-green-700",
    ARCHIVE: "bg-blue-100 text-blue-700",
    ARCHIVÉ: "bg-blue-100 text-blue-700",
    "NON DÉCLARÉ": "bg-red-100 text-red-700",
    "EN COURS": "bg-yellow-100 text-yellow-700",
    DÉCLARÉ: "bg-indigo-100 text-indigo-700",
    AUTORISÉ: "bg-emerald-100 text-emerald-700",
  };

  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
        styles[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
}