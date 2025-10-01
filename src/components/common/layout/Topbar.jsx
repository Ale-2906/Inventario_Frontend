import s from "./Topbar.module.css";
import logo from "../../../assets/images/logo.png";
import {useAuth} from "../../../context/AuthContext"

export default function Topbar({ onToggleSidebar }) {
  const { user } = useAuth();

  return (
    <header className={s.topbar}>
      {/* Izquierda: marca */}
      <div className={s.brand}>
        <img src={logo} alt="InventSmart" className={s.logo} />
      </div>

      {/* Centro vacío: empuja contenido a los extremos */}
      <div className={s.spacer} />

      {/* Derecha: búsqueda circular + menú + perfil */}
      <div className={s.actions}>
        <button className={s.iconBtn} title="Search">
          <svg viewBox="0 0 24 24"><path d="M11 4a7 7 0 1 0 4.9 12l3.6 3.6 1.4-1.4-3.6-3.6A7 7 0 0 0 11 4Zm0 2a5 5 0 1 1 0 10A5 5 0 0 1 11 6Z" /></svg>
        </button>
      <button className={s.iconBtn} title="Menu" onClick={onToggleSidebar}>
          <svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" fill="none"/></svg>
        </button>

        <div className={s.profile}>
          <div className={s.profileInfo}>
            {user?.name || "usuario"}
          <br></br>
            Administrador
          </div>
        </div>
      </div>
    </header>
  );
}
