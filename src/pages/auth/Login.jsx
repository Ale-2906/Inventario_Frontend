import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import Button from "../../components/common/Button/Button";
import Input from "../../components/common/Input/Input";
import Card from "../../components/common/Card/Card";
import Alert from "../../components/common/Alert/Alert";

import s from "./Login.module.css";
import logo from "../../assets/images/logo.png";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ username: "", password: "" });
  const [err, setErr] = useState("");
  const [showPass, setShowPass] = useState(false);

  const invalid = !form.username.trim() || !form.password.trim();

  const onSubmit = (e) => {
    e.preventDefault();
    setErr("");
    if (invalid) {
      setErr("Ingresa usuario y contraseña.");
      return;
    }
    login({ username: form.username });
    navigate("/", { replace: true });
  };

  return (
    <section className={s.screen}>

      <form onSubmit={onSubmit} noValidate>
       
        <Card title={ <div className={s.logoWrap}>
          <img src={logo} alt="Logo Inventario" className={s.logo} />
          <p className={s.appSubtitle}>Acceso para administradores</p>
        </div>
        }

          actions={
            <Button type="submit" variant="outline"  disabled={invalid} style={{ width: "100%", marginTop: 16 }}>
              Ingresar
            </Button>

          }

        >

          {err && <Alert>{err}</Alert>}

          <Input
            label="Usuario"
            placeholder="ej. admin"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            autoFocus
            autoComplete="username"
          />

          <Input
            label="Contraseña"
            type={showPass ? "text" : "password"}
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            autoComplete="current-password"
            rightAdornment={
              <button
                type="button"
                className={s.eyeBtn}
                onClick={() => setShowPass((v) => !v)}
                aria-label={showPass ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                <svg viewBox="0 0 24 24" className={s.eyeIcon} aria-hidden="true">
                  <path d="M12 5C7 5 2.73 8.11 1 12c1.73 3.89 6 7 11 7s9.27-3.11 11-7c-1.73-3.89-6-7-11-7Zm0 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z" />
                </svg>
              </button>
            }
          />
        </Card>
      </form>
    </section>
  );
}
