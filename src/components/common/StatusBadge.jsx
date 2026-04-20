const styles = {
  BROUILLON: "border-gray-200 bg-gray-100 text-gray-700",
  SOUMIS: "border-amber-200 bg-amber-50 text-amber-800",
  VALIDE: "border-green-200 bg-green-50 text-green-800",
  "VALIDÉ": "border-green-200 bg-green-50 text-green-800",
  ARCHIVE: "border-blue-200 bg-blue-50 text-blue-800",
  "ARCHIVÉ": "border-blue-200 bg-blue-50 text-blue-800",
  "NON DÉCLARÉ": "border-red-200 bg-red-50 text-red-800",
  "EN COURS": "border-amber-200 bg-amber-50 text-amber-800",
  "DÉCLARÉ": "border-indigo-200 bg-indigo-50 text-indigo-800",
  "AUTORISÉ": "border-emerald-200 bg-emerald-50 text-emerald-800",
};

export default function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-wide ${
        styles[status] || "border-gray-200 bg-gray-100 text-gray-700"
      }`}
    >
      {status || "Non renseigné"}
    </span>
  );
}
