// src/pages/Dashboard/Dashboard.jsx
import { useState, useEffect } from 'react';
import styles from './Dashboard.module.css';
import SalesChart from '../../components/reports/SalesChart';
import { obtenerTendenciasVentas } from '../../services/reportes.service';

export default function Dashboard() {
  const [tendencias, setTendencias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const tendenciasData = await obtenerTendenciasVentas();
      setTendencias(tendenciasData);
    } catch (error) {
      console.error('Error al cargar tendencias:', error);
      alert('Error al cargar las tendencias. Verifica que el backend esté corriendo.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingContent}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.headerTitle}>Dashboard</h1>
        <p className={styles.headerSubtitle}>Tendencias de ventas del inventario</p>
      </div>

      {tendencias.length > 0 && (
        <div className={styles.chartWrapper}>
          <SalesChart data={tendencias} />
        </div>
      )}

      {tendencias.length === 0 && (
        <div className={styles.emptyState}>
          📊 No hay datos de tendencias disponibles
        </div>
      )}
    </div>
  );
}