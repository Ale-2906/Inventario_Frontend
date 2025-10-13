import { useState, useMemo } from "react";
import SuppliersCard from "../../components/suppliers/SuppliersCard"; // <-- Importamos el componente de KPIs
import s from "./Suppliers.module.css";
import Button from "../../components/common/Button/Button";
import Icon from "../../components/common/icon";
import SuppliersList from "../../components/suppliers/SuppliersList"
import SuppliersForm from "../../components/suppliers/SuppliersForm";
const seed = [
  {
    id: 1,
    company: "Tech Solutions",
    contact: "Juan Pérez",
    category: "Electrónicos",
    status: "Activo",
  },
  {
    id: 2,
    company: "Periféricos LTDA",
    contact: "María Gómez",
    category: "Accesorios",
    status: "Activo",
  },
  {
    id: 3,
    company: "Office Center",
    contact: "Carlos Ruiz",
    category: "Muebles",
    status: "Stock bajo",
  },
  {
    id: 4,
    company: "Tech Solutions",
    contact: "Lucía Fernández",
    category: "Electrónicos",
    status: "Agotado",
  },
];


export default function Products() {
  const [items, setItems] = useState(seed);
  const [q, setQ] = useState("");
  const [selectedSupplier,setSelectedSupplier] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const stats = useMemo(() => {
    const total = items.length;
    const activos = items.filter(i => i.status === "Activo").length;
    const bajo = items.filter(i => i.stock > 0 && i.stock <= 5).length;
    const agot = items.filter(i => i.stock === 0 || i.status === "Agotado").length;
    return { total, activos, bajo, agot };
  }, [items]);

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return items;
    return items.filter(i =>
      [i.company, i.category, i.contact].some(v => v.toLowerCase().includes(t))
    );
  }, [q, items]);


  const editSupplier = (id) => {
    const suplier = items.find(p => p.id === id);
    setSelectedSupplier(suplier);
    setShowForm(true); // Mostrar formulario de edición
  };

  const removeProduct = (id) => {
    if (confirm("¿Eliminar este producto?")) {
      setItems(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleSubmit = (supplier) => {
    if (selectedSupplier) {
      setItems(items.map(p => p.id === supplier.id ? supplier : p)); // Editar producto
    } else {
      setItems([...items, { ...supplier, id: items.length + 1 }]); // Agregar producto
    }
    setShowForm(false); // Cerrar el formulario
    setSelectedProduct(null); // Resetear el producto seleccionado
  };

  return (
    <div className={s.page}>
      <header className={s.header}>
        <div>
          <h1 className={s.title}>Gestión de Proveedores</h1>
          <p className={s.subtitle}>Administra tu red de proveedores</p>
        </div>
        <Button variant="outline" style={{ width: "20%", marginTop: 16 }} onClick={() => setShowForm(true)}>
          <Icon name="suppliers" className={s.iconWrap} />
          Nuevo Proveedor
        </Button>
      </header>

      {showForm && <SuppliersForm suppliers={selectedSupplier} onSubmit={handleSubmit} onClose={() => setShowForm(false)} />}

      {/* KPIs */}
      <SuppliersCard stats={stats} />

      <section className={s.panel}>
        <SuppliersList
          suppliers={filtered}
          stats={stats}
          onEdit={editSupplier}
          onRemove={removeProduct}
        />
      </section>

    </div>
  );  
}
