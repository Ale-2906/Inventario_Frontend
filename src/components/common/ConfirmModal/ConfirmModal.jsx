// src/components/common/ConfirmModal.jsx
import styles from "./ConfirmModal.module.css";

export default function ConfirmModal({ title, message, onConfirm, onCancel }) {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3>{title}</h3>
        <p>{message}</p>
        <div className={styles.actions}>
          <button className={styles.confirmBtn} onClick={onConfirm}>Sí</button>
          <button className={styles.cancelBtn} onClick={onCancel}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}
