// services/supplierService.js
import axios from "axios";

const API_URL = "http://localhost:3000/api/proveedores";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

// Traer todos los proveedores
export const getSuppliers = async (includeInactive = false) => {
  try {
    const { data } = await axios.get(API_URL, {
      params: { includeInactive },
      headers: getAuthHeader(),
    });

    return data.data.map((s) => ({
      ...s,
      status: s.estado ? "Activo" : "Desactivado",
      // normalizamos campo conteo
      totalProducts: s.totalProducts ?? s.cantidadProductos ?? 0,
      categorias: s.categorias ?? [],
    }));
  } catch (err) {
    console.error("Error al obtener proveedores:", err);
    throw err;
  }
};

// Traer proveedor por id (para tener conteo fresco)
export const getSupplierById = async (id) => {
  try {
    const { data } = await axios.get(`${API_URL}/${id}`, {
      headers: getAuthHeader(),
    });
    const s = data.data;
    return {
      ...s,
      status: s.estado ? "Activo" : "Desactivado",
      totalProducts: s.totalProducts ?? s.cantidadProductos ?? 0,
      categorias: s.categorias ?? [],
    };
  } catch (err) {
    // Si tu backend no tiene este endpoint, el que llama podrá usar fallbackCount
    console.warn("No se pudo obtener el proveedor por id; usando fallback si existe.", err);
    return null;
  }
};

// Crear proveedor
export const createSupplier = async (supplier) => {
  try {
    const payload = {
      empresa: supplier.empresa,
      contacto: supplier.contacto,
      categorias: supplier.categoriesIds || [],
      estado: supplier.status === "Activo",
    };
    const { data } = await axios.post(API_URL, payload, { headers: getAuthHeader() });
    return {
      ...data.data,
      status: data.data.estado ? "Activo" : "Desactivado",
      totalProducts: data.data.totalProducts ?? data.data.cantidadProductos ?? 0,
      categorias: data.data.categorias ?? [],
    };
  } catch (err) {
    console.error("Error al crear proveedor:", err);
    throw err;
  }
};

// Actualizar proveedor
export const updateSupplier = async (id, supplier) => {
  try {
    const payload = {
      empresa: supplier.empresa,
      contacto: supplier.contacto,
      categorias: supplier.categoriesIds || [],
      estado: supplier.status === "Activo",
    };
    const { data } = await axios.put(`${API_URL}/${id}`, payload, {
      headers: getAuthHeader(),
    });

    return {
      id: data.data.id,
      company: data.data.empresa,
      contact: data.data.contacto,
      status: data.data.estado ? "Activo" : "Desactivado",
      categorias: data.data.categorias || [],
      totalProducts: data.data.totalProducts ?? data.data.cantidadProductos ?? 0,
    };
  } catch (err) {
    console.error("Error al actualizar proveedor:", err);
    throw err;
  }
};

// SOFT delete = desactivar
export const softDeleteSupplier = async (id) => {
  try {
    const { data } = await axios.put(
      `${API_URL}/${id}/status`,
      { estado: false },
      { headers: getAuthHeader() }
    );
    return data; // { success, message }
  } catch (err) {
    console.error("Error al desactivar proveedor:", err);
    throw err;
  }
};

// HARD delete = eliminar de DB (incluye proveedor_categoria en backend)
export const hardDeleteSupplier = async (id) => {
  try {
    const { data } = await axios.delete(`${API_URL}/${id}`, {
      headers: getAuthHeader(),
    });
    return data; // { success, message }
  } catch (err) {
    console.error("Error al eliminar proveedor:", err);
    throw err;
  }
};

/**
 * Eliminar proveedor “inteligente”:
 * - Si cantidad de productos == 0 => hard delete (DELETE)
 * - Si > 0 => soft delete (PUT /status)
 *
 * Intentamos leer el proveedor por id para tener un conteo fresco.
 * Si no se puede (no existe el endpoint o falla), usamos el fallbackCount.
 */
export const deleteSupplierSmart = async (id, { fallbackCount } = {}) => {
  // 1) Intentar conteo fresco desde backend
  let count = null;
  try {
    const s = await getSupplierById(id);
    if (s) count = Number(s.totalProducts ?? 0);
  } catch (_) {
    /* ya manejamos advertencia arriba */
  }

  // 2) Fallback si no pudimos leer detalle
  if (count === null || Number.isNaN(count)) {
    count = Number(fallbackCount ?? 0);
  }

  if (count <= 0) {
    // Elimina definitivamente (incluyendo relaciones en proveedor_categoria)
    const res = await hardDeleteSupplier(id);
    return { ...res, action: "hard" };
  }

  // Tiene productos: solo desactivar
  const res = await softDeleteSupplier(id);
  return { ...res, action: "soft" };
};
