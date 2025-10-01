import { createContext, useContext, useEffect, useState } from "react";
import { getItem, setItem, removeItem } from "../lib/storage";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const u = getItem("demo_auth");
        if (u) {
            setUser(u);
        }
        setLoading(false);
    }, []);
    const login = ({ username }) => {
        const fake = { name: username.trim(), role: "admin" };
        setItem("demo_auth", fake);
        setUser(fake);
    };
    const logout = () => {
        removeItem("demo_auth");
        setUser(null);
    }
    return (
        < AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}
