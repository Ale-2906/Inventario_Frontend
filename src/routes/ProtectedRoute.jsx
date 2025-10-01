import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({element}){
    const {user,loading}=useAuth();
    if(loading){
        return <div className="container">..Cargando</div>
    }
    return user ? element: <Navigate to="/login" replace />
}