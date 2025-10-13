import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "../components/common/layout/MainLayout";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import ResetPasswordRoute from "./ResetPasswordRoute";

// Páginas
import Login from "../pages/auth/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import Products from "../pages/Products/Products";
import Reports from '../pages/Reports/Reports';
//Recuperar Contraseña
import ForgotPassword from "../pages/auth/ForgotPassword";  
import ResetPassword from "../pages/auth/ResetPassword"; 

export default createBrowserRouter([
  // Rutas públicas protegidas
  { 
    path: "/login", 
    element: <PublicRoute element={<Login />} /> 
  },
  { 
    path: "/forgot-password", 
    element: <PublicRoute element={<ForgotPassword />} /> 
  },
  { 
    path: "/reset-password", 
    element: <ResetPasswordRoute element={<ResetPassword />} /> 
  },
  
  // Rutas privadas protegidas
  {
    path: "/",
    element: <ProtectedRoute element={<MainLayout />} />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "productos", element: <Products />},
      { path: "reportes", element: <Reports />},
    ],
  },
  
  { path: "*", element: <Navigate to="/" replace /> },
]);