import { useState, useMemo } from "react";
import ProductList from "../../components/products/ProductList";
import ProductForm from "../../components/products/ProductForm";
import ProductsCard from "../../components/products/ProductCard"; 
import s from "./Products.module.css";
import Button from "../../components/common/Button/Button";
import Icon from "../../components/common/icon";
  const seed = [
  { id: 1, name: "Laptop Dell XPS 13", category: "Electrónicos", price: 1299.99, stock: 15, supplier: "Tech Solutions", status: "Activo" },
  { id: 2, name: "Mouse Logitech MX Master 3", category: "Accesorios", price: 89.9, stock: 6, supplier: "Periféricos LTDA", status: "Activo" },
  { id: 3, name: "Silla Ergonómica", category: "Muebles", price: 259.0, stock: 2, supplier: "Office Center", status: "Stock bajo" },
  { id: 4, name: "Monitor 27'' 144Hz", category: "Electrónicos", price: 339.99, stock: 0, supplier: "Tech Solutions", status: "Agotado" },
];

export default function Products() {
  const [items, setItems] = useState(seed);
  const [q, setQ] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
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
      [i.name, i.category, i.supplier].some(v => v.toLowerCase().includes(t))
    );
  }, [q, items]);


 const editProduct = (id) => {
    const product = items.find(p => p.id === id);
    setSelectedProduct(product);
    setShowForm(true); // Mostrar formulario de edición
  };

  const removeProduct = (id) => {
    if (confirm("¿Eliminar este producto?")) {
      setItems(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleSubmit = (product) => {
    if (selectedProduct) {
      setItems(items.map(p => p.id === product.id ? product : p)); // Editar producto
    } else {
      setItems([...items, { ...product, id: items.length + 1 }]); // Agregar producto
    }
    setShowForm(false); // Cerrar el formulario
    setSelectedProduct(null); // Resetear el producto seleccionado
  };

  return (
    <div className={s.page}>
      <header className={s.header}>
        <div>
          <h1 className={s.title}>Gestión de Productos</h1>
          <p className={s.subtitle}>Administra tu inventario de productos</p>
        </div>
        <Button variant="outline" style={{ width: "20%", marginTop: 16 }} onClick={() => setShowForm(true)}>
           <Icon name="add" className={s.iconWrap} /> 
          Nuevo Producto
        </Button>
      </header>

      {showForm && <ProductForm product={selectedProduct} onSubmit={handleSubmit} onClose={() => setShowForm(false)} />}

      {/* KPIs */}
      <ProductsCard stats={stats} />

      <section className={s.panel}>
        <ProductList 
          products={filtered} 
          stats={stats}
          onEdit={editProduct} 
          onRemove={removeProduct} 
        />
      </section>
    </div>
  );
}
