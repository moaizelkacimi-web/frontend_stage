import { useEffect, useState } from "react";
import api from "../../api/axios";
import Alert from "../../components/common/Alert";
import Card from "../../components/common/Card";
import Loader from "../../components/common/Loader";
import { useAuth } from "../../context/AuthContext";

export default function ProfilePage() {
  const { user: currentUser, setUser } = useAuth();
  const [user, setLocalUser] = useState(currentUser);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setErrorMessage("");

      try {
        const res = await api.get("/api/user");
        setLocalUser(res.data);
        setUser(res.data);
      } catch (error) {
        console.error("Erreur profil :", error);
        setErrorMessage(
          error.response?.data?.message ||
            "Impossible de charger le profil utilisateur."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [setUser]);

  if (loading) {
    return <Loader label="Chargement du profil utilisateur..." />;
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
          Compte utilisateur
        </p>
        <h1 className="mt-2 text-2xl font-bold text-slate-950 sm:text-3xl">
          Profil
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          Consultez les informations de votre session active.
        </p>
      </div>

      {errorMessage && <Alert type="error">{errorMessage}</Alert>}

      <Card className="p-6 sm:p-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <ProfileField label="Nom" value={user?.name} />
          <ProfileField label="Email" value={user?.email} />
          <ProfileField label="Role" value={user?.role} />
          <ProfileField label="Identifiant" value={user?.id} />
        </div>
      </Card>
    </div>
  );
}

function ProfileField({ label, value }) {
  return (
    <div>
      <p className="mb-1.5 text-sm font-semibold text-slate-700">{label}</p>
      <div className="min-h-12 rounded-lg border border-slate-200 bg-slate-50 px-5 py-4 text-sm font-semibold text-slate-900">
        {value || "-"}
      </div>
    </div>
  );
}
