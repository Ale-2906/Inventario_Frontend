import { useState, useEffect, useMemo } from "react";
import SuppliersCard from "../../components/suppliers/SuppliersCard";
import SuppliersList from "../../components/suppliers/SuppliersList";
import SuppliersForm from "../../components/suppliers/SuppliersForm";
import Button from "../../components/common/Button/Button";
import Icon from "../../components/common/icon";
import ConfirmModal from "../../components/common/ConfirmModal/ConfirmModal";
import MessageModal from "../../components/common/MessageModal/MessageModal";
import s from "./Suppliers.module.css";
import {
  getSuppliers,
  createSupplier,
  updateSupplier,      
  deleteSupplierSmart     // inteligente: hard si 0 productos, si no soft
} from "../../services/supplierService";

export default function Suppliers() {
  const [items, setItems] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Confirmación genérica para eliminar/desactivar
  const [confirm, setConfirm] = useState({ open: false, id: null });

  // Mensajes globales
  const [msg, setMsg] = useState({ open: false, type: "success", title: "", message: "" });

  useEffect(() => {
    async function fetchSuppliers() {
      try {
        const data = await getSuppliers(true); // incluye inactivos
        setItems(data);
      } catch (err) {
        console.error("Error al cargar proveedores:", err);
        setMsg({
          open: true,
          type: "error",
          title: "Error",
          message: "No se pudieron cargar los proveedores."
        });
      }
    }
    fetchSuppliers();
  }, []);

  // KPIs
  const stats = useMemo(() => {
    const total = items.length;
    const activos = items.filter(i => i.status === "Activo").length;
    const proveedoresConCategorias = items.filter(i => i.categorias?.length > 0).length;
    const totalProductosAsociados = items.reduce((acc, i) => acc + (i.cantidadProductos ?? i.totalProducts ?? 0), 0);
    return { total, activos, proveedoresConCategorias, totalProductosAsociados };
  }, [items]);

  const editSupplier = (id) => {
    const supplier = items.find(p => p.id === id);
    setSelectedSupplier(supplier);
    setShowForm(true);
  };

  const handleSubmit = async (supplier) => {
    try {
      let saved;
      if (selectedSupplier) {
        // EDITAR
        saved = await updateSupplier(selectedSupplier.id, supplier);
        setItems(items.map(p => (p.id === saved.id ? saved : p)));

        setMsg({
          open: true,
          type: "success",
          title: "Proveedor actualizado",
          message: `Se actualizó correctamente: ${saved.company ?? saved.empresa ?? ""}.`
        });
      } else {
        // CREAR
        saved = await createSupplier(supplier);
        setItems([...items, saved]);

        setMsg({
          open: true,
          type: "success",
          title: "Proveedor creado",
          message: `Se creó correctamente: ${saved.company ?? saved.empresa ?? ""}.`
        });
      }
    } catch (err) {
      console.error("Error al guardar proveedor:", err);
      setMsg({
        open: true,
        type: "error",
        title: "No se pudo guardar",
        message: err?.response?.data?.message || err.message || "Error desconocido"
      });
    } finally {
      setShowForm(false);
      setSelectedSupplier(null);
    }
  };

  // 🔹 Abrir confirmación de **eliminar inteligente**
  const askRemove = (id) => {
    setConfirm({ open: true, id });
  };

  // 🔹 Confirmar eliminación inteligente
  const confirmRemove = async () => {
    const id = confirm.id;
    setConfirm({ open: false, id: null });

    // Tomamos la fila para usar su conteo como fallback si el backend /:id no está
    const row = items.find(s => s.id === id);
    const fallbackCount = row?.totalProducts ?? row?.cantidadProductos ?? 0;

    try {
      const res = await deleteSupplierSmart(id, { fallbackCount });
      if (res.action === "hard") {
        // Borrado definitivo
        setItems(prev => prev.filter(s => s.id !== id));
        setMsg({
          open: true,
          type: "success",
          title: "Proveedor eliminado",
          message: "El proveedor se eliminó definitivamente (no tenía productos asociados)."
        });
      } else {
        // Soft delete (desactivado)
        setItems(prev =>
          prev.map(s => s.id === id ? { ...s, status: "Desactivado", estado: false } : s)
        );
        setMsg({
          open: true,
          type: "info",
          title: "Proveedor desactivado",
          message: "El proveedor tiene productos asociados, por lo que se desactivó."
        });
      }
    } catch (err) {
      console.error("Error al eliminar/desactivar proveedor:", err);
      setMsg({
        open: true,
        type: "error",
        title: "No se pudo eliminar",
        message: err?.response?.data?.message || err.message || "Ocurrió un error al intentar eliminar/desactivar el proveedor."
      });
    }
  };

  const cancelRemove = () => setConfirm({ open: false, id: null });
  const closeMsg = () => setMsg(m => ({ ...m, open: false }));

  // Nuevo Proveedor (form limpio)
  const openNewSupplier = () => {
    setSelectedSupplier(null);
    setShowForm(true);
  };

  return (
    <div className={s.page}>
      <header className={s.header}>
        <div>
          <h1 className={s.title}>Gestión de Proveedores</h1>
          <p className={s.subtitle}>Administra tu red de proveedores</p>
        </div>
        <Button
          variant="outline"
          style={{ width: "20%", marginTop: 16 }}
          onClick={openNewSupplier}
        >
          <Icon name="suppliers" className={s.iconWrap} />
          Nuevo Proveedor
        </Button>
      </header>

      {showForm && (
        <SuppliersForm
          key={selectedSupplier?.id ?? "new"}
          supplier={selectedSupplier}
          onSubmit={handleSubmit}
          onClose={() => {
            setShowForm(false);
            setSelectedSupplier(null);
          }}
        />
      )}

      <SuppliersCard stats={stats} />

      <section className={s.panel}>
        <SuppliersList
          suppliers={items}
          onEdit={editSupplier}
          onRemove={askRemove}   // ⬅️ ahora dispara eliminación inteligente
        />
      </section>

      {/* Modal de confirmación de ELIMINAR (inteligente) */}
      {confirm.open && (
        <ConfirmModal
          title="Eliminar proveedor"
          message="¿Deseas eliminar este proveedor? Si tiene productos asociados, no se borrará definitivamente: se desactivará para mantener la integridad."
          onConfirm={confirmRemove}
          onCancel={cancelRemove}
        />
      )}

      {/* Modal de mensaje (éxito / error / info) */}
      {msg.open && (
        <MessageModal
          title={msg.title}
          message={msg.message}
          type={msg.type}     // "success" | "error" | "info"
          onClose={closeMsg}
        />
      )}
    </div>
  );
}
