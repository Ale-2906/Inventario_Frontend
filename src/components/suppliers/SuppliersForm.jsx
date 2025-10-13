import { useState, useEffect } from "react";
import styles from "../products/ProductForm.module.css";
import { getCategories } from "../../services/categoryService";

export default function SuppliersForm({ supplier, onSubmit, onClose }) {
  const [form, setForm] = useState({
    company: supplier?.company ?? "",
    contact: supplier?.contact ?? "",
    status: supplier?.status ?? "Activo",
    categoriesIds: supplier?.categorias?.map(c => c.id) ?? []
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetchCategories() {
      const cats = await getCategories();
      setCategories(cats);
    }
    fetchCategories();
  }, []);

  // SuppliersForm.jsx
useEffect(() => {
  if (supplier) {
    setForm({
      empresa: supplier.empresa ?? "",
      contacto: supplier.contacto ?? "",
      status: supplier.status ?? "Activo",
      categoriesIds: supplier.categorias?.map(c => c.id) ?? []
    });
  } else {
    // ← reset completo para "Nuevo Proveedor"
    setForm({
      empresa: "",
      contacto: "",
      status: "Activo",
      categoriesIds: []
    });
  }
}, [supplier]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e) => {
    const id = Number(e.target.value);
    setForm(prev => ({
      ...prev,
      categoriesIds: e.target.checked
        ? [...prev.categoriesIds, id]
        : prev.categoriesIds.filter(c => c !== id)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <span className={styles.modalClose} onClick={onClose}>×</span>
        <h2 className={styles.modalTitle}>{supplier ? "Editar Proveedor" : "Nuevo Proveedor"}</h2>

        <form onSubmit={handleSubmit}>
          <div>
            <label>Empresa</label>
            <input
              type="text"
              name="empresa"
              value={form.empresa ?? ""}
              onChange={handleChange}
              className={styles.inputField}
            />
          </div>

          <div>
            <label>Contacto</label>
            <input
              type="text"
              name="contacto"
              value={form.contacto ?? ""}
              onChange={handleChange}
              className={styles.inputField}
            />
          </div>

          <div>
            <label>Categorías</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: 4 }}>
              {categories.map(cat => (
                <label key={cat.id} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <input
                    type="checkbox"
                    value={cat.id}
                    checked={form.categoriesIds?.includes(cat.id) ?? false}
                    onChange={handleCategoryChange}
                  />
                  {cat.nombre}
                </label>
              ))}
            </div>
          </div>

          <div className={styles.modalActions}>
            <button type="submit" className={styles.submitBtn}>
              {supplier ? "Actualizar" : "Crear"}
            </button>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
