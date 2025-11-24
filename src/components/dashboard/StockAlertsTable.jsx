import { AlertTriangle, Package, RefreshCw } from 'lucide-react';
import styles from './StockAlertsTable.module.css';

export default function StockAlertsTable({ data }) {
  const getNivelAlerta = (stock, stockMinimo) => {
    if (stock === 0) return { texto: 'Agotado', color: '#ef4444' };
    if (stock <= stockMinimo * 0.5) return { texto: 'Crítico', color: '#f97316' };
    return { texto: 'Bajo', color: '#f59e0b' };
  };

  if (!data || data.length === 0) {
    return (
      <div className={styles.empty}>
        <Package size={48} />
        <p>No hay productos con stock crítico</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>
          <AlertTriangle size={24} />
          <h2>Alertas de Stock Crítico</h2>
        </div>
        <span className={styles.badge}>{data.length} productos</span>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Estado</th>
              <th>Producto</th>
              <th>Stock Actual</th>
              <th>Stock Mínimo</th>
              <th>Faltante</th>
            </tr>
          </thead>
          <tbody>
            {data.map((producto) => {
              const alerta = getNivelAlerta(producto.stock, producto.stock_minimo);
              const faltante = Math.max(0, producto.stock_minimo - producto.stock);

              return (
                <tr key={producto.id}>
                  <td>
                    <span 
                      className={styles.statusBadge}
                      style={{ backgroundColor: alerta.color }}
                    >
                      {alerta.texto}
                    </span>
                  </td>
                  <td className={styles.productName}>{producto.nombre}</td>
                  <td className={styles.stockValue}>{producto.stock}</td>
                  <td>{producto.stock_minimo}</td>
                  <td className={styles.faltante}>
                    {faltante > 0 ? `-${faltante}` : '0'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}