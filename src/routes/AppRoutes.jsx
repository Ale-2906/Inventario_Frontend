import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "../components/common/layout/MainLayout";
import ProtectedRoute from "./ProtectedRoute";

// Páginas
import Login from "../pages/auth/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import Products from "../pages/Products/Products";
import Reports from '../pages/Reports/Reports';
//Recuperar Contraseña
import ForgotPassword from "../pages/auth/ForgotPassword";  
import ResetPassword from "../pages/auth/ResetPassword"; 

export default createBrowserRouter([
  { path: "/login", element: <Login /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/reset-password", element: <ResetPassword /> },
  {
    path: "/",
    element: <ProtectedRoute element={<MainLayout />} />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "productos", element: <Products />},
      {path: "reportes", element: <Reports />},
    ],
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);
