import { useState, useEffect } from "react";
import styles from "./ProductForm.module.css";
import { getCategories } from "../../services/categoryService";
import { getSuppliers } from "../../services/supplierService";

export default function ProductForm({ product, onSubmit, onClose }) {
  const [form, setForm] = useState({
    name: "",
    category_id: "",
    supplier_id: "",
    price: "",
    stock: "",
    stock_minimo: 5,
    status: 1
  });

  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  // Cargar datos del producto al abrir form
  useEffect(() => {
    if (product) {
      setForm({
        name: product.nombre || "",
        category_id: product.categoria_id || "",
        supplier_id: product.proveedor_id || "",
        price: product.precio || "",
        stock: product.stock || "",
        stock_minimo: product.stock_minimo || 5,
        status: product.estado ?? 1
      });
    } else {
      setForm({
        name: "",
        category_id: "",
        supplier_id: "",
        price: "",
        stock: "",
        stock_minimo: 5,
        status: "activo"
      });
    }
  }, [product]);

  useEffect(() => {
    async function fetchData() {
      try {
        const cats = await getCategories();
        setCategories(cats);
        const sups = await getSuppliers();
        setSuppliers(sups);
      } catch (err) {
        console.error("Error al cargar categorías o proveedores:", err);
      }
    }
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
     const payload = {
      nombre: form.name,
      categoria_id: form.category_id || null,
      proveedor_id: form.supplier_id || null,
      precio: Number(form.price),
      stock: Number(form.stock),
      stock_minimo: Number(form.stock_minimo),
      // Estado debe enviarse como enum string
      estado: form.status
    };
    onSubmit(payload);
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <span className={styles.modalClose} onClick={onClose}>×</span>
        <h2 className={styles.modalTitle}>{product ? "Editar Producto" : "Nuevo Producto"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label>Producto</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} className={styles.inputField} />
          </div>
          <div>
            <label>Categoría</label>
            <select name="category_id" value={form.category_id} onChange={handleChange} className={styles.inputField}>
              <option value="">Seleccione una categoría</option>
              {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.nombre}</option>)}
            </select>
          </div>
          <div>
            <label>Proveedor</label>
            <select name="supplier_id" value={form.supplier_id} onChange={handleChange} className={styles.inputField}>
              <option value="">Seleccione un proveedor</option>
              {suppliers.map(sup => <option key={sup.id} value={sup.id}>{sup.empresa}</option>)}
            </select>
          </div>
          <div>
            <label>Precio</label>
            <input type="number" name="price" value={form.price} onChange={handleChange} className={styles.inputField} />
          </div>
          <div>
            <label>Stock</label>
            <input type="number" name="stock" value={form.stock} onChange={handleChange} className={styles.inputField} />
          </div>
          <div>
            <label>Stock mínimo</label>
            <input type="number" name="stock_minimo" value={form.stock_minimo} onChange={handleChange} className={styles.inputField} />
          </div>
          <div>
            <label>Estado</label>
            <select name="status" value={form.status} onChange={handleChange} className={styles.inputField}>
              <option value="activo">Activo</option>
              <option value="desactivado">Inactivo</option>
              <option value="agotado">Agotado</option>
            </select>
          </div>
          <div className={styles.modalActions}>
            <button type="submit" className={styles.submitBtn}>{product ? "Actualizar Producto" : "Agregar Producto"}</button>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
