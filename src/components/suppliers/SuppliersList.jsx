// src/components/suppliers/SuppliersList.jsx
import { useEffect, useState } from "react";
import s from "../../pages/Suppliers/Suppliers.module.css";
import DataTable from "../common/Datatable/DataTable";

export default function SuppliersList({ suppliers = [], onEdit, onRemove }) {

  return (
    <div className="space-y-6">
      <section className={s.panel}>
        <div className={s.panelHead}>
          <div>
            <h2 className={s.panelTitle}>Lista de Proveedores</h2>
            <p className={s.panelHint}>Gestiona todos los proveedores de tu inventario</p>
          </div>
        </div>

        <DataTable
        pageSize={5}
          columns={[
            { key: "company", label: "Empresa", render: r => r.company ?? r.empresa ?? "-" },
            { key: "contact", label: "Contacto", render: r => r.contact ?? r.contacto ?? "-" },
            {
              key: "categorias",
              label: "Categorías",
              render: r => r.categorias?.map(c => c.nombre).join(", ") || "-"
            },
            {
              key: "cantidadProductos",
              label: "Productos Asociados",
              render: r => r.cantidadProductos ?? r.totalProducts ?? 0
            },
            { key: "status", label: "Estado", render: r => <StatusPill status={r.status} /> },
            {
              key: "actions",
              label: "Acciones",
              align: "right",
              render: (r) => (
                <>
                  <button className={s.iconBtn} title="Editar" onClick={() => onEdit?.(r.id)}>
                    <svg viewBox="0 0 24 24">
                      <path d="M4 20h4l10-10-4-4L4 16v4zM14 6l4 4" stroke="currentColor" strokeWidth="2" fill="none" />
                    </svg>
                  </button>
                  <button className={`${s.iconBtn} ${s.danger}`} title="Eliminar" onClick={() => onRemove?.(r.id)}>
                    <svg viewBox="0 0 24 24">
                      <path d="M6 7h12M9 7V5h6v2m-8 0l1 12h8l1-12" stroke="currentColor" strokeWidth="2" fill="none" />
                    </svg>
                  </button>
                </>
              ),
            },
          ]}
          data={suppliers}
          emptyText="No hay proveedores que coincidan."
        />
      </section>
    </div>
  );
}

// Componente para mostrar estado con colores
function StatusPill({ status }) {
  const map = {
    "Activo": { bg: "#e8fff3", color: "#059669" },
    "Desactivado": { bg: "#ffe9ec", color: "#d23c52" }
  };
  const style = map[status] || { bg: "#f3f4f6", color: "#374151" };
  return (
    <span style={{
      background: style.bg,
      color: style.color,
      padding: "6px 10px",
      borderRadius: 999,
      fontSize: 12,
      fontWeight: 700,
      display: "inline-block",
      minWidth: 72,
      textAlign: "center"
    }}>
      {status}
    </span>
  );
}
