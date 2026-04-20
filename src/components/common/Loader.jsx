export default function Loader({ label = "Chargement en cours..." }) {
  return (
    <div className="flex min-h-56 items-center justify-center rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
      <div>
        <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-blue-700" />
        <p className="mt-4 text-sm font-semibold text-gray-600">{label}</p>
      </div>
    </div>
  );
}
