import { useState, useEffect } from "react";
import styles from "../products/ProductForm.module.css";  // Importa el archivo CSS

export default function SuppliersForm({ supplier, onSubmit, onClose }) {
  const [form, setForm] = useState({
    company: supplier ? supplier.company : "",
    contact: supplier ? supplier.contact : "",
    category: supplier ? supplier.category : "",
    status: supplier ? supplier.status : "Activo"
  });

  useEffect(() => {
    if (supplier) {
      setForm({ ...supplier });
    }
  }, [supplier]);

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
          {supplier ? "Editar Proveedor" : "Nuevo Proveedor"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block">Empresa</label>
            <input
              type="text"
              name="company"
              value={form.company}
              onChange={handleChange}
              className={styles.inputField}
            />
          </div>
          <div>
            <label className="block">Contacto</label>
            <input
              type="text"
              name="contact"
              value={form.contact}
              onChange={handleChange}
              className={styles.inputField}
            />
          </div>
          <div>
            <label className="block">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className={styles.inputField}
            />
          </div>
           <div>
            <label className="block">Teléfono</label>
            <input
              type="text"
              name="teléfono"
              value={form.telefono}
              onChange={handleChange}
              className={styles.inputField}
            />
          </div>
          <div>
            <label className="block">Dirección</label>
            <input
              type="text"
              name="direccion"
              value={form.direccion}
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
            <label className="block">Notas</label>
            <input
              type="text"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              className={styles.inputField}
            />
          </div>
          
          <div className={styles.modalActions}>
            <button
              type="submit"
              className={styles.submitBtn}
            >
              {supplier ? "Actualizar Proveedor" : "Crear Proveedor"}
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
