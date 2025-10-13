// src/services/supplierService.js
import axios from "axios";

const API_URL = "http://localhost:3000/api/proveedores";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

/**
 * Obtener todos los proveedores
 */
export const getSuppliers = async () => {
  try {
    const response = await axios.get(API_URL, { headers: getAuthHeader() });
    return response.data.data;
  } catch (err) {
    console.error("Error al obtener proveedores:", err);
    throw err;
  }
};

/**
 * Obtener proveedor por ID
 */
export const getSupplierById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, { headers: getAuthHeader() });
    return response.data.data;
  } catch (err) {
    console.error(`Error al obtener proveedor ${id}:`, err);
    throw err;
  }
};

/**
 * Crear nuevo proveedor
 */
export const createSupplier = async (supplier) => {
  try {
    const response = await axios.post(API_URL, supplier, { headers: getAuthHeader() });
    return response.data.data;
  } catch (err) {
    console.error("Error al crear proveedor:", err);
    throw err;
  }
};

/**
 * Actualizar proveedor
 */
export const updateSupplier = async (id, supplier) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, supplier, { headers: getAuthHeader() });
    return response.data.data;
  } catch (err) {
    console.error("Error al actualizar proveedor:", err);
    throw err;
  }
};

/**
 * Eliminar proveedor
 */
export const deleteSupplier = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeader() });
    return response.data;
  } catch (err) {
    console.error("Error al eliminar proveedor:", err);
    throw err;
  }
};
export const searchSupplierByName = async (q) => {
  try {
    const { data } = await axios.get(`${API_URL}/search`, { 
      params: { q },
      headers: getAuthHeader()
    });
    return data.data;
  } catch (err) {
    console.error("Error al buscar proveedor:", err);
    throw err;
  }
};