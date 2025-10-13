import s from "./Topbar.module.css";
import logo from "../../../assets/images/logo_navbar.png";
import { useAuth } from "../../../context/AuthContext";

export default function Topbar({ onToggleSidebar }) {
  const { user } = useAuth();

  return (
    <header className={s.topbar}>
      <div className={s.brand}>
        <img src={logo} alt="InventSmart" className={s.logo} />
      </div>

      <div className={s.spacer} />

      <div className={s.actions}>
        <button className={s.iconBtn} title="Menu" onClick={onToggleSidebar}>
          <svg viewBox="0 0 24 24">
            <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
        </button>

        <div className={s.profile}>
          <div className={s.profileInfo}>
            {user?.nombre || "Usuario"} <br />
            {user?.rol || "Invitado"}
          </div>
        </div>
      </div>
    </header>
  );
}
