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

  // 🆕 FUNCIÓN PARA EXPORTAR A PDF
  // 🔧 SOLUCIÓN: Importación dinámica
  const exportarPDF = async () => {
    try {
      const jsPDF = (await import('jspdf')).jsPDF;
      const doc = new jsPDF();
      
      // Encabezado del documento
      doc.setFontSize(20);
      doc.setTextColor(40, 40, 40);
      
      let titulo = '';
      let datos = [];
      
      // Configurar según la vista actual
      if (vistaActual === 'ventas') {
        titulo = 'Reporte de Ventas';
        datos = ventas;
      } else if (vistaActual === 'stock') {
        titulo = 'Historial de Stock';
        datos = stock;
      } else if (vistaActual === 'agotados') {
        titulo = 'Productos Próximos a Agotarse';
        datos = productosAgotados;
      }
      
      doc.text(titulo, 14, 22);
      
      // Información adicional
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, 14, 30);
      doc.text(`Total registros: ${datos.length}`, 14, 36);
      
      // Línea decorativa
      doc.setDrawColor(200, 200, 200);
      doc.line(14, 40, 196, 40);
      
      // Tabla simple manualmente
      let y = 50;
      doc.setFontSize(9);
      doc.setTextColor(50, 50, 50);
      
      if (vistaActual === 'ventas') {
        // Encabezados
        doc.setFont(undefined, 'bold');
        doc.text('ID', 14, y);
        doc.text('Fecha', 30, y);
        doc.text('Producto', 55, y);
        doc.text('Unidades', 110, y);
        doc.text('Total', 140, y);
        doc.text('Usuario', 165, y);
        y += 7;
        
        doc.setFont(undefined, 'normal');
        let totalGeneral = 0;
        
        ventas.forEach((v, i) => {
          if (y > 270) {
            doc.addPage();
            y = 20;
          }
          doc.text(String(v.id), 14, y);
          doc.text(new Date(v.fecha).toLocaleDateString('es-ES'), 30, y);
          doc.text(v.producto.substring(0, 25), 55, y);
          doc.text(String(v.unidades), 110, y);
          doc.text(`$${parseFloat(v.total).toFixed(2)}`, 140, y);
          doc.text(v.usuario.substring(0, 15), 165, y);
          totalGeneral += parseFloat(v.total);
          y += 7;
        });
        
        // Total
        y += 5;
        doc.setFont(undefined, 'bold');
        doc.setFontSize(12);
        doc.text(`Total General: $${totalGeneral.toFixed(2)}`, 14, y);
      } else if (vistaActual === 'stock') {
        // Encabezados
        doc.setFont(undefined, 'bold');
        doc.text('ID', 14, y);
        doc.text('Producto', 30, y);
        doc.text('Cambio', 80, y);
        doc.text('Stock', 110, y);
        doc.text('Motivo', 140, y);
        doc.text('Fecha', 170, y);
        y += 7;
        
        doc.setFont(undefined, 'normal');
        stock.forEach((s) => {
          if (y > 270) {
            doc.addPage();
            y = 20;
          }
          doc.text(String(s.id), 14, y);
          doc.text(s.producto.substring(0, 20), 30, y);
          doc.text(`${s.cambio > 0 ? '+' : ''}${s.cambio}`, 80, y);
          doc.text(String(s.stock_despues), 110, y);
          doc.text(s.motivo.substring(0, 15), 140, y);
          doc.text(new Date(s.fecha).toLocaleDateString('es-ES'), 170, y);
          y += 7;
        });
      } else if (vistaActual === 'agotados') {
        // Encabezados
        doc.setFont(undefined, 'bold');
        doc.text('ID', 14, y);
        doc.text('Producto', 30, y);
        doc.text('Stock Actual', 100, y);
        doc.text('Stock Mínimo', 140, y);
        y += 7;
        
        doc.setFont(undefined, 'normal');
        productosAgotados.forEach((p) => {
          if (y > 270) {
            doc.addPage();
            y = 20;
          }
          doc.text(String(p.id), 14, y);
          doc.text(p.nombre.substring(0, 30), 30, y);
          doc.text(String(p.stock), 100, y);
          doc.text(String(p.stock_minimo), 140, y);
          y += 7;
        });
      }
      
      // Pie de página
      const pageCount = doc.internal.getNumberOfPages();
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.text(
          `Página ${i} de ${pageCount}`,
          doc.internal.pageSize.width / 2,
          doc.internal.pageSize.height - 10,
          { align: 'center' }
        );
      }
      
      // Guardar PDF
      const fecha = new Date().toISOString().split('T')[0];
      const nombreArchivo = `reporte-${vistaActual}-${fecha}.pdf`;
      doc.save(nombreArchivo);
    } catch (error) {
      console.error('Error al generar PDF:', error);
      alert('Error al generar el PDF. Por favor, intenta nuevamente.');
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
      label: 'Movimiento', 
      render: (row) => (
        <span className={row.cambio > 0 ? styles.cambioPositivo : styles.cambioNegativo}>
          {row.cambio > 0 ? '+' : ''}{row.cambio}
        </span>
      )
    },
    { key: 'stock_despues', label: 'Stock' },
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
        <h1 className={styles.headerTitle}>Reportes de Gestión</h1>
        <p className={styles.headerSubtitle}>Visualice el rendimiento de su inventario y ventas</p>
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span className={styles.contentCount}>{ventas.length} registros</span>
                {/* 🆕 BOTÓN EXPORTAR */}
                <button 
                  onClick={exportarPDF}
                  className={styles.exportButton}
                  title="Exportar a PDF"
                >
                  📥 Exportar PDF
                </button>
              </div>
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span className={styles.contentCount}>{stock.length} movimientos</span>
                {/* 🆕 BOTÓN EXPORTAR */}
                <button 
                  onClick={exportarPDF}
                  className={styles.exportButton}
                  title="Exportar a PDF"
                >
                  📥 Exportar PDF
                </button>
              </div>
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span className={
                  productosAgotados.length > 0 ? styles.contentCountDanger : styles.contentCountSuccess
                }>
                  {productosAgotados.length} productos
                </span>
                {/* 🆕 BOTÓN EXPORTAR */}
                <button 
                  onClick={exportarPDF}
                  className={styles.exportButton}
                  title="Exportar a PDF"
                >
                  📥 Exportar PDF
                </button>
              </div>
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