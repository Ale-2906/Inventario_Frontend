import styles from './Reports.module.css';
import { useState, useEffect } from 'react';
import KPICard from '../../components/common/KPICard/KPICard';
import DataTable from '../../components/common/DataTable/DataTable';
import Icon from '../../components/common/icon';
import { 
  obtenerReporteVentas, 
  obtenerReporteStock, 
  obtenerProductosAgotados,
  obtenerTendenciasVentas,
  obtenerEstadisticasGenerales 
} from '../../services/reportes.service';

export default function Reports() {
  const [estadisticas, setEstadisticas] = useState(null);
  const [ventas, setVentas] = useState([]);
  const [stock, setStock] = useState([]);
  const [productosAgotados, setProductosAgotados] = useState([]);
  const [tendencias, setTendencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vistaActual, setVistaActual] = useState('ventas');

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [statsData, ventasData, stockData, agotadosData, tendenciasData] = await Promise.all([
        obtenerEstadisticasGenerales(),
        obtenerReporteVentas(),
        obtenerReporteStock(),
        obtenerProductosAgotados(),
        obtenerTendenciasVentas()
      ]);

      setEstadisticas(statsData);
      setVentas(ventasData);
      setStock(stockData);
      setProductosAgotados(agotadosData);
      setTendencias(tendenciasData);
    } catch (error) {
      console.error('Error al cargar reportes:', error);
      alert('Error al cargar los reportes. Verifica que el backend esté corriendo.');
    } finally {
      setLoading(false);
    }
  };

  const columnasVentas = [
    { key: 'id', label: 'ID' },
    { 
      key: 'fecha', 
      label: 'Fecha', 
      render: (row) => new Date(row.fecha).toLocaleDateString('es-ES') 
    },
    { key: 'producto', label: 'Producto' },
    { key: 'unidades', label: 'Unidades' },
    { 
      key: 'total', 
      label: 'Total', 
      render: (row) => `$${parseFloat(row.total).toFixed(2)}` 
    },
    { key: 'usuario', label: 'Usuario' }
  ];

  const columnasStock = [
    { key: 'id', label: 'ID' },
    { key: 'producto', label: 'Producto' },
    { 
      key: 'cambio', 
      label: 'Cambio', 
      render: (row) => (
        <span className={row.cambio > 0 ? styles.cambioPositivo : styles.cambioNegativo}>
          {row.cambio > 0 ? '+' : ''}{row.cambio}
        </span>
      )
    },
    { key: 'motivo', label: 'Motivo' },
    { 
      key: 'fecha', 
      label: 'Fecha', 
      render: (row) => new Date(row.fecha).toLocaleDateString('es-ES') 
    }
  ];

  const columnasAgotados = [
    { key: 'id', label: 'ID' },
    { key: 'nombre', label: 'Producto' },
    { 
      key: 'stock', 
      label: 'Stock Actual', 
      render: (row) => (
        <span className={styles.stockCritico}>{row.stock}</span>
      )
    },
    { 
      key: 'stock_minimo', 
      label: 'Stock Mínimo', 
      render: (row) => (
        <span className={styles.stockMinimo}>{row.stock_minimo}</span>
      )
    }
  ];

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingContent}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Cargando reportes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.headerTitle}>Reportes e Informes</h1>
        <p className={styles.headerSubtitle}>Visualiza estadísticas y tendencias de tu inventario</p>
      </div>

      {estadisticas && (
        <div className={styles.kpiGrid}>
          <KPICard
            title="Total Ventas"
            value={estadisticas.total_ventas || 0}
            icon={<Icon name="sales" />}
            variant="cyan"
            subtitle="Ventas registradas"
          />
          <KPICard
            title="Monto Total"
            value={`$${parseFloat(estadisticas.monto_total || 0).toFixed(2)}`}
            icon={<Icon name="money" />}
            variant="teal"
            subtitle="Ingresos totales"
          />
          <KPICard
            title="Unidades Vendidas"
            value={estadisticas.unidades_totales || 0}
            icon={<Icon name="units" />}
            variant="purple"
            subtitle="Productos vendidos"
          />
          <KPICard
            title="Productos en Stock"
            value={estadisticas.stock_total || 0}
            icon={<Icon name="stock" />}
            variant="pink"
            subtitle="Inventario total"
          />
        </div>
      )}

      <div className={styles.tabsCard}>
        <div className={styles.tabsHeader}>
          <div className={styles.tabsContainer}>
            <button
              onClick={() => setVistaActual('ventas')}
              className={`${styles.tabButton} ${
                vistaActual === 'ventas' ? styles.tabButtonActive : styles.tabButtonInactive
              }`}
            >
               Reporte de Ventas
            </button>
            <button
              onClick={() => setVistaActual('stock')}
              className={`${styles.tabButton} ${
                vistaActual === 'stock' ? styles.tabButtonActive : styles.tabButtonInactive
              }`}
            >
               Historial de Stock
            </button>
            <button
              onClick={() => setVistaActual('agotados')}
              className={`${styles.tabButton} ${
                vistaActual === 'agotados' ? styles.tabButtonActive : styles.tabButtonInactive
              }`}
            >
              Productos por Agotarse ({productosAgotados.length})
            </button>
          </div>
        </div>
      </div>

      <div className={styles.contentCard}>
        {vistaActual === 'ventas' && (
          <>
            <div className={styles.contentHeader}>
              <h2 className={styles.contentTitle}>Historial de Ventas</h2>
              <span className={styles.contentCount}>{ventas.length} registros</span>
            </div>
            {ventas.length === 0 ? (
              <div className={styles.emptyState}>
                📭 No hay ventas registradas
              </div>
            ) : (
              <DataTable columns={columnasVentas} data={ventas} />
            )}
          </>
        )}

        {vistaActual === 'stock' && (
          <>
            <div className={styles.contentHeader}>
              <h2 className={styles.contentTitle}>Movimientos de Stock</h2>
              <span className={styles.contentCount}>{stock.length} movimientos</span>
            </div>
            {stock.length === 0 ? (
              <div className={styles.emptyState}>
                📭 No hay movimientos de stock
              </div>
            ) : (
              <DataTable columns={columnasStock} data={stock} />
            )}
          </>
        )}

        {vistaActual === 'agotados' && (
          <>
            <div className={styles.contentHeader}>
              <h2 className={styles.contentTitle}>Productos Próximos a Agotarse</h2>
              <span className={
                productosAgotados.length > 0 ? styles.contentCountDanger : styles.contentCountSuccess
              }>
                {productosAgotados.length} productos
              </span>
            </div>
            {productosAgotados.length === 0 ? (
              <div className={styles.emptyStateSuccess}>
                ✅ No hay productos próximos a agotarse
              </div>
            ) : (
              <DataTable columns={columnasAgotados} data={productosAgotados} />
            )}
          </>
        )}
      </div>
    </div>
  );
}