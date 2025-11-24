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
    // Transformar estado a string válido: 'activo' o 'desactivado'
    const payload = {
      ...producto,
      estado: producto.estado ? 'activo' : 'desactivado'
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
  if (!id) throw new Error("ID del producto es obligatorio");
  try {
    const payload = {
      ...producto,
      estado: producto.estado ? 'activo' : 'desactivado'
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

// Actualizar stock de producto
// Actualizar stock de producto (stock absoluto)
export const updateStockProduct = async (id, stock, motivo = 'Ajuste manual') => {
  if (!id) throw new Error("ID del producto es obligatorio");
  try {
    const { data } = await axios.patch(`${API_URL}/${id}/stock`, {
      stock,   // cantidad absoluta
      motivo
    }, {
      headers: getAuthHeader()
    });
    return data.data;
  } catch (err) {
    console.error("Error al actualizar stock:", err);
    throw err;
  }
};


// Eliminar producto (soft delete)
export const deleteProduct = async (id) => {
  if (!id) throw new Error("ID del producto es obligatorio");
  try {
    const { data } = await axios.delete(`${API_URL}/${id}`, {
      headers: getAuthHeader()
    });
    return data;
  } catch (err) {
    console.error("Error al eliminar producto:", err);
    throw err;
  }
};
// Buscar productos por nombre en backend
export const searchProducts = async (term) => {
  try {
    const { data } = await axios.get(`${API_URL}/search`, {
      params: { q: term },
      headers: getAuthHeader()
    });
    return data.data;
  } catch (err) {
    console.error("Error al buscar productos:", err);
    throw err;
  }
};

