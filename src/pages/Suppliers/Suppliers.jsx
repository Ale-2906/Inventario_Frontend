import { useState, useEffect, useMemo } from "react";
import SuppliersCard from "../../components/suppliers/SuppliersCard";
import SuppliersList from "../../components/suppliers/SuppliersList";
import SuppliersForm from "../../components/suppliers/SuppliersForm";
import Button from "../../components/common/Button/Button";
import Icon from "../../components/common/icon";
import ConfirmModal from "../../components/common/ConfirmModal/ConfirmModal";
import MessageModal from "../../components/common/MessageModal/MessageModal";
import s from "./Suppliers.module.css";
import { getSuppliers, createSupplier, updateSupplier, deleteSupplier } from "../../services/supplierService";

export default function Suppliers() {
  const [items, setItems] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // 🔹 Estado para confirmación de desactivación
  const [confirm, setConfirm] = useState({ open: false, id: null });

  // 🔹 Estado para mensajes (éxito/error)
  const [msg, setMsg] = useState({ open: false, type: "success", title: "", message: "" });

  useEffect(() => {
    async function fetchSuppliers() {
      try {
        const data = await getSuppliers(true);
        setItems(data);
      } catch (err) {
        console.error("Error al cargar proveedores:", err);
      }
    }
    fetchSuppliers();
  }, []);

  // KPIs
  const stats = useMemo(() => {
    const total = items.length;
    const activos = items.filter(i => i.status === "Activo").length;
    const proveedoresConCategorias = items.filter(i => i.categorias?.length > 0).length;
    const totalProductosAsociados = items.reduce((acc, i) => acc + (i.cantidadProductos ?? 0), 0);
    return { total, activos, proveedoresConCategorias, totalProductosAsociados };
  }, [items]);

  const editSupplier = (id) => {
    const supplier = items.find(p => p.id === id);
    setSelectedSupplier(supplier);
    setShowForm(true);
  };

  // Dentro de Suppliers.jsx
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


  // 🔹 Abrir confirmación (se llama desde la lista)
  const askDeactivate = (id) => {
    setConfirm({ open: true, id });
  };

  // 🔹 Confirmar desactivación
  const confirmDeactivate = async () => {
    const id = confirm.id;
    setConfirm({ open: false, id: null });

    try {
      await deleteSupplier(id); // PATCH /:id/status { estado:false }
      // Optimistic UI: marcar como desactivado de inmediato
      setItems(prev =>
        prev.map(p =>
          p.id === id ? { ...p, status: "Desactivado", estado: false } : p
        )
      );

      setMsg({
        open: true,
        type: "success",
        title: "Proveedor desactivado",
        message: "El proveedor fue desactivado correctamente."
      });
    } catch (err) {
      console.error("Error al desactivar proveedor:", err);
      setMsg({
        open: true,
        type: "error",
        title: "No se pudo desactivar",
        // message: err.response?.data?.message || err.message
      });
    }
  };

  const cancelDeactivate = () => setConfirm({ open: false, id: null });
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
          onRemove={askDeactivate}  // 🔹 ahora abre confirmación
        />
      </section>

      {/* 🔹 Modal de confirmación */}
      {confirm.open && (
        <ConfirmModal
          title="Desactivar proveedor"
          message="¿Seguro que deseas desactivar este proveedor? Si tiene productos asociados, se mantendrá el vínculo pero el proveedor quedará inactivo."
          onConfirm={confirmDeactivate}
          onCancel={cancelDeactivate}
        />
      )}

      {/* 🔹 Modal de mensaje (éxito / error) */}
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
