import { useState, useEffect, useMemo } from "react";
import ProductList from "../../components/products/ProductList";
import ProductForm from "../../components/products/ProductForm";
import ProductsCard from "../../components/products/ProductCard";
import ConfirmModal from "../../components/common/ConfirmModal/ConfirmModal";
import MessageModal from "../../components/common/MessageModal/MessageModal"; // <-- Importamos
import s from "./Products.module.css";
import Button from "../../components/common/Button/Button";
import Icon from "../../components/common/icon";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStockProduct,
  searchProducts
} from "../../services/productService";

export default function Products() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Estado para mensaje modal
  const [messageModal, setMessageModal] = useState({ visible: false, title: "", message: "", type: "info" });

  const showMessage = (title, message, type = "info") => {
    setMessageModal({ visible: true, title, message, type });
  };

  useEffect(() => {
    async function fetchProducts() {
      try {
        const products = await getProducts();
        setItems(products);
      } catch (err) {
        console.error("Error al cargar productos:", err);
        showMessage("Error", "No se pudieron cargar los productos", "error");
      }
    }
    fetchProducts();
  }, []);

  const stats = useMemo(() => {
    const total = items.length;
    const activos = items.filter(i => i.estado === 'activo').length;
    const bajo = items.filter(i => i.stock > 0 && i.stock <= 5).length;
    const agot = items.filter(i => i.stock === 0 || i.estado === 'desactivado').length;
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
      setItems(prev => prev.map(p => p.id === productToDelete ? { ...p, estado: 'desactivado' } : p));
      showMessage("Éxito", "Producto desactivado correctamente", "success");
    } catch (err) {
      console.error("Error al eliminar producto:", err);
      showMessage("Error", "No se pudo eliminar el producto", "error");
    } finally {
      setShowConfirm(false);
      setProductToDelete(null);
    }
  };

  const handleSubmit = async (product) => {
    try {
      if (selectedProduct) {
        if (Number(product.stock) !== Number(selectedProduct.stock)) {
          await updateStockProduct(selectedProduct.id, Number(product.stock), 'Actualización desde formulario');
        }

        const updated = await updateProduct(selectedProduct.id, { ...product });
        setItems(items.map(p => p.id === updated.id ? updated : p));
        showMessage("Éxito", "Producto actualizado correctamente", "success");
      } else {
        const created = await createProduct(product);
        setItems([...items, created]);
        showMessage("Éxito", "Producto creado correctamente", "success");
      }

      setShowForm(false);
      setSelectedProduct(null);
    } catch (err) {
      console.error("Error al guardar producto:", err);
      showMessage("Error", "No se pudo guardar el producto", "error");
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
          onRemove={confirmDeleteProduct}
          onSearch={async (term) => {
            if (!term) {
              const all = await getProducts();
              setItems(all);
            } else {
              const results = await searchProducts(term);
              setItems(results);
            }
          }}
        />
      </section>

      {showConfirm && (
        <ConfirmModal
          title="Confirmar eliminación"
          message="¿Deseas eliminar este producto?"
          onConfirm={handleDelete}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      {messageModal.visible && (
        <MessageModal
          title={messageModal.title}
          message={messageModal.message}
          type={messageModal.type}
          onClose={() => setMessageModal({ visible: false, title: "", message: "", type: "info" })}
        />
      )}
    </div>
  );
}
