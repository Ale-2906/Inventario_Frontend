// src/services/reportes.service.js

const API_URL = 'http://localhost:3000/api';

/**
 * Servicio para gestionar reportes e informes
 */

// 1️⃣ Obtener reporte de ventas
export const obtenerReporteVentas = async () => {
  try {
    const response = await fetch(`${API_URL}/reportes/ventas`);
    if (!response.ok) {
      throw new Error('Error al obtener reporte de ventas');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en obtenerReporteVentas:', error);
    throw error;
  }
};

// 2️⃣ Obtener reporte de stock
export const obtenerReporteStock = async () => {
  try {
    const response = await fetch(`${API_URL}/reportes/stock`);
    if (!response.ok) {
      throw new Error('Error al obtener reporte de stock');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en obtenerReporteStock:', error);
    throw error;
  }
};

// 3️⃣ Obtener productos próximos a agotarse
export const obtenerProductosAgotados = async () => {
  try {
    const response = await fetch(`${API_URL}/reportes/productos-agotados`);
    if (!response.ok) {
      throw new Error('Error al obtener productos agotados');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en obtenerProductosAgotados:', error);
    throw error;
  }
};

// 4️⃣ Obtener tendencias de ventas (para gráficos)
export const obtenerTendenciasVentas = async () => {
  try {
    const response = await fetch(`${API_URL}/reportes/tendencias`);
    if (!response.ok) {
      throw new Error('Error al obtener tendencias de ventas');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en obtenerTendenciasVentas:', error);
    throw error;
  }
};

// 5️⃣ Obtener estadísticas generales
export const obtenerEstadisticasGenerales = async () => {
  try {
    const response = await fetch(`${API_URL}/reportes/estadisticas`);
    if (!response.ok) {
      throw new Error('Error al obtener estadísticas generales');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en obtenerEstadisticasGenerales:', error);
    throw error;
  }
};

// FUNCIONES PARA GRAFICOS

export const obtenerStockOverview = async () => {
  try {
    const response = await fetch(`${API_URL}/reportes/stock-overview`);
    if (!response.ok) throw new Error('Error al obtener stock overview');
    return await response.json();
  } catch (error) {
    console.error('Error en obtenerStockOverview:', error);
    throw error;
  }
};

export const obtenerStockPorCategoria = async () => {
  try {
    const response = await fetch(`${API_URL}/reportes/stock-por-categoria`);
    if (!response.ok) throw new Error('Error al obtener stock por categoría');
    return await response.json();
  } catch (error) {
    console.error('Error en obtenerStockPorCategoria:', error);
    throw error;
  }
};

export const obtenerHistorialProducto = async (productoId, dias = 30) => {
  try {
    const response = await fetch(
      `${API_URL}/reportes/historial-producto/${productoId}?dias=${dias}`
    );
    if (!response.ok) throw new Error('Error al obtener historial del producto');
    return await response.json();
  } catch (error) {
    console.error('Error en obtenerHistorialProducto:', error);
    throw error;
  }
};