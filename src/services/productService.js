// src/services/productService.js
import axios from "axios";

const API_URL = "http://localhost:3000/api/productos";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

// Obtener todos los productos
export const getProducts = async (filters = {}) => {
  try {
    const { data } = await axios.get(API_URL, {
      params: filters,
      headers: getAuthHeader()
    });
    return data.data;
  } catch (err) {
    console.error("Error al obtener productos:", err);
    throw err;
  }
};

// Crear nuevo producto
export const createProduct = async (producto) => {
  try {
    // Transformar estado a 1 o 0
    const payload = {
      ...producto,
      estado: producto.estado ? 1 : 0
    };
    const { data } = await axios.post(API_URL, payload, {
      headers: getAuthHeader()
    });
    return data.data;
  } catch (err) {
    console.error("Error al crear producto:", err);
    throw err;
  }
};

// Actualizar producto existente
export const updateProduct = async (id, producto) => {
  try {
    if (!id) throw new Error("ID del producto es obligatorio");
    const payload = {
      ...producto,
      estado: producto.estado ? 1 : 0
    };
    const { data } = await axios.put(`${API_URL}/${id}`, payload, {
      headers: getAuthHeader()
    });
    return data.data;
  } catch (err) {
    console.error("Error al actualizar producto:", err);
    throw err;
  }
};

// Eliminar producto
export const deleteProduct = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeader() });
  } catch (err) {
    console.error("Error al eliminar producto:", err);
    throw err;
  }
};
