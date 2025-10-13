import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ResetPasswordRoute({ element }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  const emailFromState = location.state?.email;

  if (loading) {
    return <div className="container">..Cargando</div>;
  }

  // Si ya está logueado, redirigir al dashboard
  if (user) {
    return <Navigate to="/" replace />;
  }

  // Si no viene con email del state, redirigir a forgot-password
  if (!emailFromState) {
    return <Navigate to="/forgot-password" replace />;
  }

  // Si todo está bien, mostrar la página
  return element;
}