import React from "react";
import s from "./MessageModal.module.css";
import Button from "../Button/Button";
import { FaCheckCircle } from "react-icons/fa"; // ícono de éxito

export default function MessageModal({ title, message, type = "info", onClose }) {
  const showIcon = type === "success";
  const accentColor = type === "success" ? "#22c55e" :
                      type === "error" ? "#ef4444" : "#3b82f6";

  return (
    <div className={s.overlay}>
      <div className={s.modal}>
        {showIcon && (
          <div className={s.iconWrapper}>
            <FaCheckCircle size={48} color={accentColor} />
          </div>
        )}
        <div className={s.header}>
          <h3>{title}</h3>
          <span className={s.close} onClick={onClose}>×</span>
        </div>
        <div className={s.body}>
          <p>{message}</p>
        </div>
        <div className={s.actions}>
          <Button variant="outline" onClick={onClose}>Cerrar</Button>
        </div>
      </div>
    </div>
  );
}