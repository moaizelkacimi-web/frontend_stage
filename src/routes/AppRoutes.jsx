import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "../pages/auth/LoginPage";
import DashboardPage from "../pages/dashboard/DashboardPage";
import TraitementsListPage from "../pages/traitements/TraitementListPage";
import TraitementCreatePage from "../pages/traitements/TraitementCreatePage";
import TraitementEditPage from "../pages/traitements/TraitementEditPage";
import TraitementShowPage from "../pages/traitements/TraitementShowPage";
import UnauthorizedPage from "../pages/errors/UnauthorizedPage";
import NotFoundPage from "../pages/errors/NotFoundPage";

import ProtectedRoute from "../components/common/ProtectedRoute";
import RoleRoute from "../components/common/RoleRoute";
import MainLayout from "../components/layout/MainLayout";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout>
                <DashboardPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/traitements"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["CPD", "DAG", "JURIDIQUE"]}>
                <MainLayout>
                  <TraitementsListPage />
                </MainLayout>
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/traitements/create"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["CPD", "DAG"]}>
                <MainLayout>
                  <TraitementCreatePage />
                </MainLayout>
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/traitements/:id"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["CPD", "DAG", "JURIDIQUE"]}>
                <MainLayout>
                  <TraitementShowPage />
                </MainLayout>
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/traitements/:id/edit"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["CPD", "DAG"]}>
                <MainLayout>
                  <TraitementEditPage />
                </MainLayout>
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<NotFoundPage />} />

      </Routes>
    </BrowserRouter>
  );
}