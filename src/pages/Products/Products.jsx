import { useState, useEffect, useMemo } from "react";
import ProductList from "../../components/products/ProductList";
import ProductForm from "../../components/products/ProductForm";
import ProductsCard from "../../components/products/ProductCard";
import ConfirmModal from "../../components/common/ConfirmModal/ConfirmModal";
import s from "./Products.module.css";
import Button from "../../components/common/Button/Button";
import Icon from "../../components/common/icon";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../../services/productService";

export default function Products() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Para modal de confirmación
  const [showConfirm, setShowConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const products = await getProducts();
        setItems(products);
      } catch (err) {
        console.error("Error al cargar productos:", err);
      }
    }
    fetchProducts();
  }, []);

  const stats = useMemo(() => {
    const total = items.length;
    const activos = items.filter(i => i.estado === 1).length;
    const bajo = items.filter(i => i.stock > 0 && i.stock <= 5).length;
    const agot = items.filter(i => i.stock === 0 || i.estado === 0).length;
    return { total, activos, bajo, agot };
  }, [items]);

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return items;
    return items.filter(i =>
      [i.nombre, i.categoria_nombre, i.proveedor_nombre].some(v => v?.toString().toLowerCase().includes(t))
    );
  }, [q, items]);

  const editProduct = (id) => {
    const product = items.find(p => p.id === id);
    setSelectedProduct(product);
    setShowForm(true);
  };

  const confirmDeleteProduct = (id) => {
    setProductToDelete(id);
    setShowConfirm(true);
  };

  const handleDelete = async () => {
    try {
      await deleteProduct(productToDelete);
      setItems(prev => prev.filter(p => p.id !== productToDelete));
    } catch (err) {
      console.error("Error al eliminar producto:", err);
    } finally {
      setShowConfirm(false);
      setProductToDelete(null);
    }
  };

  const handleSubmit = async (product) => {
    try {
      if (selectedProduct) {
        const updated = await updateProduct(selectedProduct.id, product);
        setItems(items.map(p => p.id === updated.id ? updated : p));
      } else {
        const created = await createProduct(product);
        setItems([...items, created]);
      }
      setShowForm(false);
      setSelectedProduct(null);
    } catch (err) {
      console.error("Error al guardar producto:", err);
    }
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

      {showForm && (
        <ProductForm
          product={selectedProduct}
          onSubmit={handleSubmit}
          onClose={() => setShowForm(false)}
        />
      )}

      <ProductsCard stats={stats} />

      <section className={s.panel}>
        <ProductList
          products={filtered}
          stats={stats}
          onEdit={editProduct}
          onRemove={confirmDeleteProduct} // Abrir modal
        />
      </section>

      {/* Modal de confirmación */}
      {showConfirm && (
        <ConfirmModal
          title="Confirmar eliminación"
          message="¿Deseas eliminar este producto?"
          onConfirm={handleDelete}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
}
