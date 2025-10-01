import { NavLink } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import s from "./Sidebar.module.css";

const sections = [
  {
    title: "MENU",
    items: [
      { to: "/", label: "Dashboard", icon: "🏠", end: true },
    ],
  },
  {
    title: "GESTIÓN",
    items: [
      { to: "/productos", label: "Productos", icon: "📦" },
      { to: "/proveedores", label: "Proveedores", icon: "🤝" },
      { to: "/reportes", label: "Reportes", icon: "📈" },
      { to: "/configuracion", label: "Configuración", icon: "⚙️" },
    ],
  },
];

export default function Sidebar() {
  const { logout } = useAuth();

  return (
    <aside className={s.aside}>
      <div className={s.topbarMini}>
        <span className={s.brandText}>InventSmart</span>
      </div>

      {sections.map(sec => (
        <div key={sec.title} className={s.section}>
          <div className={s.sectionTitle}>{sec.title}</div>
          <nav className={s.nav}>
            {sec.items.map(i => (
              <NavLink
                key={i.to}
                to={i.to}
                end={i.end}
                className={({ isActive }) => [s.link, isActive ? s.active : ""].join(" ")}
              >
                <span className={s.bullet}>{i.icon}</span>
                <span>{i.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      ))}

      <div className={s.footer}>
        <button className={s.logout} onClick={logout}>
          <svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2" fill="none" /><path d="M16 17l5-5-5-5" stroke="currentColor" strokeWidth="2" fill="none" /><path d="M21 12H9" stroke="currentColor" strokeWidth="2" fill="none" /></svg>
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
