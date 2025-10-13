import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            const storedUser = JSON.parse(localStorage.getItem("user"));
            setUser(storedUser);
        }
        setLoading(false);
    }, [token]);

    const login = async ({ correo, contrasena }) => {
        try {
            const res = await axios.post(`${API_URL}/auth/login`, { correo, contrasena });
            if (res.data.success) {
                const { token, usuario } = res.data.data;
                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify(usuario));
                setUser(usuario);
                setToken(token);
                return { success: true };
            }
            return { success: false, message: res.data.message };
        } catch (err) {
            return { success: false, message: err.message };
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}
