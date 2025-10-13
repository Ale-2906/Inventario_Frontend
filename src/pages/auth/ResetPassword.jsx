import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Button from "../../components/common/Button/Button";
import Input from "../../components/common/Input/Input";
import Card from "../../components/common/Card/Card";
import Alert from "../../components/common/Alert/Alert";
import s from "./Login.module.css";
import logo from "../../assets/images/logo.png";

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const emailFromState = location.state?.email || "";

  const [form, setForm] = useState({
    email: emailFromState,
    code: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const invalid =
    !form.email.trim() ||
    !form.code.trim() ||
    form.code.length !== 6 ||
    !form.newPassword.trim() ||
    form.newPassword.length < 6 ||
    !form.confirmPassword.trim();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (invalid) {
      setError("Por favor, completa todos los campos correctamente.");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          correo: form.email,
          codigo: form.code,
          nuevaContrasena: form.newPassword,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        // Redirigir al login después de 2 segundos
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 2000);
      } else {
        setError(data.message || "Error al cambiar la contraseña");
      }
    } catch (err) {
      setError("Error de conexión. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <section className={s.screen}>
        <Card
          title={
            <div className={s.logoWrap}>
              <img src={logo} alt="Logo Inventario" className={s.logo} />
            </div>
          }
        >
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
            <h2 style={{ color: "#10b981", marginBottom: 8 }}>¡Contraseña actualizada!</h2>
            <p style={{ color: "#64748b" }}>Redirigiendo al inicio de sesión...</p>
          </div>
        </Card>
      </section>
    );
  }

  return (
    <section className={s.screen}>
      <form onSubmit={onSubmit} noValidate>
        <Card
          title={
            <div className={s.logoWrap}>
              <img src={logo} alt="Logo Inventario" className={s.logo} />
              <p className={s.appSubtitle}>Restablecer contraseña</p>
            </div>
          }
          actions={
            <>
              <Button
                type="submit"
                variant="outline"
                disabled={invalid || loading}
                style={{ width: "100%", marginTop: 16 }}
              >
                {loading ? "Actualizando..." : "Cambiar contraseña"}
              </Button>
              <Link to="/login" className={s.forgotLink}>
                Volver al inicio de sesión
              </Link>
            </>
          }
        >
          {error && <Alert variant="error">{error}</Alert>}

          <Input
            label="Correo electrónico"
            type="email"
            placeholder="tu@email.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            autoComplete="email"
            disabled={loading}
          />

          <Input
            label="Código de verificación"
            type="text"
            placeholder="000000"
            value={form.code}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "").slice(0, 6);
              setForm({ ...form, code: value });
            }}
            maxLength={6}
            autoComplete="off"
            disabled={loading}
            style={{ textAlign: "center", letterSpacing: "0.5em", fontSize: 20 }}
          />
          <p style={{ fontSize: 12, color: "#94a3b8", marginTop: -8, marginBottom: 16 }}>
            El código expira en 15 minutos
          </p>

          <Input
            label="Nueva contraseña"
            type={showPass ? "text" : "password"}
            placeholder="••••••••"
            value={form.newPassword}
            onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
            autoComplete="new-password"
            disabled={loading}
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
          <p style={{ fontSize: 12, color: "#94a3b8", marginTop: -8, marginBottom: 16 }}>
            Mínimo 6 caracteres
          </p>

          <Input
            label="Confirmar contraseña"
            type={showConfirm ? "text" : "password"}
            placeholder="••••••••"
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            autoComplete="new-password"
            disabled={loading}
            rightAdornment={
              <button
                type="button"
                className={s.eyeBtn}
                onClick={() => setShowConfirm((v) => !v)}
                aria-label={showConfirm ? "Ocultar contraseña" : "Mostrar contraseña"}
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