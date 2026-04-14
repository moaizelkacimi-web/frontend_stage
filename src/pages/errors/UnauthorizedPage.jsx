// src/pages/errors/UnauthorizedPage.jsx
export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow rounded-xl p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-2">Accès refusé</h1>
        <p className="text-gray-600">
          Vous n’avez pas l’autorisation d’accéder à cette page.
        </p>
      </div>
    </div>
  );
}