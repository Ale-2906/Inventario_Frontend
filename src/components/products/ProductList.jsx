import s from "../../pages/Products/Products.module.css";
import DataTable from "../../components/common/Datatable/DataTable";

export default function ProductList({ products, stats, onEdit, onRemove }) {
  return (
    <div className="space-y-6">
      <section className={s.panel}>
        <div className={s.panelHead}>
          <div>
            <h2 className={s.panelTitle}>Lista de Productos</h2>
            <p className={s.panelHint}>Gestiona todos los productos de tu inventario</p>
          </div>
        </div>

        <DataTable
          columns={[
            { key: "nombre", label: "Producto" },
            { key: "categoria_nombre", label: "Categoría" },
            { key: "precio", label: "Precio", render: (r) => toMoney(r.precio) },
            { key: "stock", label: "Stock" },
            { key: "proveedor_nombre", label: "Proveedor" },
            { key: "estado", label: "Estado", render: (r) => <StatusPill status={r.estado} /> },
            {
              key: "actions",
              label: "Acciones",
              align: "right",
              render: (r) => (
                <>
                  <button className={s.iconBtn} title="Editar" onClick={() => onEdit(r.id)}>
                    <svg viewBox="0 0 24 24">
                      <path d="M4 20h4l10-10-4-4L4 16v4zM14 6l4 4" stroke="currentColor" strokeWidth="2" fill="none" />
                    </svg>
                  </button>
                  <button className={`${s.iconBtn} ${s.danger}`} title="Eliminar" onClick={() => onRemove(r.id)}>
                    <svg viewBox="0 0 24 24">
                      <path d="M6 7h12M9 7V5h6v2m-8 0l1 12h8l1-12" stroke="currentColor" strokeWidth="2" fill="none" />
                    </svg>
                  </button>
                </>
              ),
            },
          ]}
          data={products}
          emptyText="No hay productos que coincidan."
        />
      </section>
    </div>
  );
}

// Helper Functions
function toMoney(n) {
  if (n === undefined || n === null) return "$0.00";
  return n.toLocaleString("es-ES", { style: "currency", currency: "USD", minimumFractionDigits: 2 });
}

// StatusPill corregido para usar string
function StatusPill({ status }) {
  const map = {
    activo: { bg: "#e8fff3", color: "#059669", label: "Activo" },
    desactivado: { bg: "#ffe9ec", color: "#d23c52", label: "Inactivo" },
    agotado: { bg: "#fff7e6", color: "#b7791f", label: "Agotado" }
  };
  const style = map[status] || { bg: "#f3f4f6", color: "#374151", label: "Desconocido" };
  return (
    <span
      style={{
        background: style.bg,
        color: style.color,
        padding: "6px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 700,
        display: "inline-block",
        minWidth: 72,
        textAlign: "center"
      }}
    >
      {style.label}
    </span>
  );
}
