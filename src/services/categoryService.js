// src/services/categoryService.js
import axios from "axios";

const API_URL = "http://localhost:3000/api/categorias";

// Obtiene el token guardado en localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

/**
 * Obtener todas las categorías
 */
export const getCategories = async () => {
  try {
    const response = await axios.get(API_URL, {
      headers: getAuthHeader(),
    });
    return response.data.data; // array de categorías
  } catch (err) {
    console.error("Error al obtener categorías:", err);
    throw err;
  }
};

/**
 * Obtener una categoría por ID
 */
export const getCategoryById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data.data;
  } catch (err) {
    console.error(`Error al obtener la categoría ${id}:`, err);
    throw err;
  }
};

/**
 * Crear nueva categoría
 */
export const createCategory = async (category) => {
  try {
    const response = await axios.post(API_URL, category, {
      headers: getAuthHeader(),
    });
    return response.data.data;
  } catch (err) {
    console.error("Error al crear categoría:", err);
    throw err;
  }
};

/**
 * Actualizar categoría
 */
export const updateCategory = async (id, category) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, category, {
      headers: getAuthHeader(),
    });
    return response.data.data;
  } catch (err) {
    console.error("Error al actualizar categoría:", err);
    throw err;
  }
};

/**
 * Eliminar categoría
 */
export const deleteCategory = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (err) {
    console.error("Error al eliminar categoría:", err);
    throw err;
  }
};
