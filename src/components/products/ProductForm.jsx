import { useState, useEffect } from "react";
import styles from "./ProductForm.module.css";  // Importa el archivo CSS

export default function ProductForm({ product, onSubmit, onClose }) {
  const [form, setForm] = useState({
    name: product ? product.name : "",
    category: product ? product.category : "",
    price: product ? product.price : "",
    stock: product ? product.stock : "",
    supplier: product ? product.supplier : "",
    status: product ? product.status : "Activo"
  });

  useEffect(() => {
    if (product) {
      setForm({ ...product });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    onClose(); // Cerrar el modal después de enviar
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <span className={styles.modalClose} onClick={onClose}>
          ×
        </span>
        <h2 className={styles.modalTitle}>
          {product ? "Editar Producto" : "Nuevo Producto"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block">Producto</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className={styles.inputField}
            />
          </div>
          <div>
            <label className="block">Categoría</label>
            <input
              type="text"
              name="category"
              value={form.category}
              onChange={handleChange}
              className={styles.inputField}
            />
          </div>
          <div>
            <label className="block">Precio</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              className={styles.inputField}
            />
          </div>
          <div>
            <label className="block">Stock</label>
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              className={styles.inputField}
            />
          </div>
          <div>
            <label className="block">Proveedor</label>
            <input
              type="text"
              name="supplier"
              value={form.supplier}
              onChange={handleChange}
              className={styles.inputField}
            />
          </div>
          <div>
            <label className="block">Estado</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className={styles.inputField}
            >
              <option value="Activo">Activo</option>
              <option value="Stock bajo">Stock bajo</option>
              <option value="Agotado">Agotado</option>
            </select>
          </div>
          <div className={styles.modalActions}>
            <button
              type="submit"
              className={styles.submitBtn}
            >
              {product ? "Actualizar Producto" : "Agregar Producto"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelBtn}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
