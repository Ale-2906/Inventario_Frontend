import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "../components/common/layout/MainLayout";
import ProtectedRoute from "./ProtectedRoute";

// Páginas
import Login from "../pages/auth/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import Products from "../pages/Products/Products";

export default createBrowserRouter([
  { path: "/login", element: <Login /> },
  {
    path: "/",
    element: <ProtectedRoute element={<MainLayout />} />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "productos", element: <Products />},
    ],
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);
