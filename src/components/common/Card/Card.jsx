import s from "./Card.module.css";

export default function Card({ title, children, actions }) {
  return (
    <div className={s.card}>
      {title && <h2 className={s.title}>{title}</h2>}
      {children}
      {actions && <div className={s.actions}>{actions}</div>}
    </div>
  );
}
