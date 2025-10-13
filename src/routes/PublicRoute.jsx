import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PublicRoute({ element }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="container">..Cargando</div>;
  }

  // Si ya está logueado, redirigir al dashboard
  return user ? <Navigate to="/" replace /> : element;
}