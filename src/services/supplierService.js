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
      headers: getAuthHeader()
    });

    return data.data.map(s => ({
      ...s,
      status: s.estado ? "Activo" : "Desactivado",
      totalProducts: s.totalProducts ?? 0,
      categorias: s.categorias ?? []
    }));
  } catch (err) {
    console.error("Error al obtener proveedores:", err);
    throw err;
  }
};

// Crear proveedor
export const createSupplier = async (supplier) => {
  try {
    const payload = {
      empresa: supplier.empresa,
      contacto: supplier.contacto,
      categorias: supplier.categoriesIds || [],
      estado: supplier.status === "Activo"
    };
    const { data } = await axios.post(API_URL, payload, { headers: getAuthHeader() });
    return {
      ...data.data,
      status: data.data.estado ? "Activo" : "Desactivado",
      totalProducts: data.data.totalProducts ?? 0
    };
  } catch (err) {
    console.error("Error al crear proveedor:", err);
    throw err;
  }
};

// Actualizar proveedor
// Actualizar proveedor
export const updateSupplier = async (id, supplier) => {
  try {
    // Estructura que espera tu backend
    const payload = {
      empresa: supplier.empresa,                    // nombre de la empresa
      contacto: supplier.contacto,                   // nombre del contacto
      categorias: supplier.categoriesIds || [],     // categorías seleccionadas
      estado: supplier.status === "Activo"          // true o false
    };

    // Petición PUT al backend
    const { data } = await axios.put(`${API_URL}/${id}`, payload, {
      headers: getAuthHeader()
    });

    // Devuelve el proveedor actualizado en el formato del frontend
    return {
      id: data.data.id,
      company: data.data.empresa,
      contact: data.data.contacto,
      status: data.data.estado ? "Activo" : "Desactivado",
      categorias: data.data.categorias || [],
      cantidadProductos: data.data.cantidadProductos ?? 0
    };

  } catch (err) {
    console.error("Error al actualizar proveedor:", err);
    throw err;
  }
};


// Eliminar proveedor (soft delete)
export const deleteSupplier = async (id) => {
  try {
    // Usamos el endpoint de cambio de estado
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

// Buscar proveedores por nombre (backend soporta ?search=)
export const searchSuppliers = async (term) => {
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