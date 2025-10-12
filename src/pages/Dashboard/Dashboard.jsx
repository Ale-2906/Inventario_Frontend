// src/pages/Dashboard/Dashboard.jsx
import { useState, useEffect } from 'react';
import styles from './Dashboard.module.css';

// Componentes de gráficos
import SalesChart from '../../components/reports/SalesChart';
import StockAlertsTable from '../../components/dashboard/StockAlertsTable';
import StockOverviewChart from '../../components/dashboard/StockOverviewChart';
import StockByCategoryChart from '../../components/dashboard/StockByCategoryChart';

// Services
import { 
  obtenerTendenciasVentas,
  obtenerProductosAgotados,
  obtenerStockOverview,
  obtenerStockPorCategoria
} from '../../services/reportes.service';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  
  // Estados para cada tipo de dato
  const [tendencias, setTendencias] = useState([]);
  const [productosAgotados, setProductosAgotados] = useState([]);
  const [stockOverview, setStockOverview] = useState([]);
  const [stockPorCategoria, setStockPorCategoria] = useState([]);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      
      // Cargar todos los datos en paralelo
      const [tendenciasData, agotadosData, overviewData, categoriaData] = await Promise.all([
        obtenerTendenciasVentas(),
        obtenerProductosAgotados(),
        obtenerStockOverview(),
        obtenerStockPorCategoria()
      ]);
      
      setTendencias(tendenciasData);
      setProductosAgotados(agotadosData);
      setStockOverview(overviewData);
      setStockPorCategoria(categoriaData);
      
    } catch (error) {
      console.error('Error al cargar datos:', error);
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
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.headerTitle}>Panel Principal </h1>
        <p className={styles.headerSubtitle}>Análisis y métricas del inventario</p>
      </div>

      {/* Contenido */}
      <div className={styles.content}>
        
        {/* Tendencias de Ventas */}
        {tendencias.length > 0 && (
          <div className={styles.chartWrapper}>
            <SalesChart data={tendencias} />
          </div>
        )}

        {/* Gráficos de stock */}
        <div className={styles.chartsGrid}>
          <div className={styles.chartCard}>
            <h3>Stock Actual vs Mínimo</h3>
            <StockOverviewChart data={stockOverview} />
          </div>
          
          <div className={styles.chartCard}>
            <h3>Stock por Categoría</h3>
            <StockByCategoryChart data={stockPorCategoria} />
          </div>
        </div>

        {/* Tabla de alertas */}
        <div className={styles.alertsSection}>
          <StockAlertsTable data={productosAgotados} />
        </div>

      </div>
    </div>
  );
}