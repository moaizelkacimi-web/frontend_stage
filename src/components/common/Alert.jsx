export default function Alert({ type = "success", children }) {
  const styles = {
    success: "border-emerald-200 bg-emerald-50 text-emerald-800",
    error: "border-red-200 bg-red-50 text-red-800",
    info: "border-blue-200 bg-blue-50 text-blue-800",
  };

  return (
    <div
      className={`rounded-lg border px-4 py-3 text-sm font-medium ${
        styles[type] || styles.info
      }`}
    >
      {children}
    </div>
  );
}
