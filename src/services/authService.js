import axios from "axios";

const API_URL = "http://localhost:3000/api/auth";

export const loginUser = async (correo, contrasena) => {
  try {
    const { data } = await axios.post(`${API_URL}/login`, { correo, contrasena });
    if (data.success) {
      localStorage.setItem("token", data.data.token); // Guardar token
      return data;
    } else {
      throw new Error(data.message);
    }
  } catch (err) {
    console.error("Error en login:", err);
    throw err;
  }
};

export const getProfile = async () => {
  try {
    const token = localStorage.getItem("token");
    const { data } = await axios.get(`${API_URL}/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return data.data;
  } catch (err) {
    console.error("Error al obtener perfil:", err);
    throw err;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
};
