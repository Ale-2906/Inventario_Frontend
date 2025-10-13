import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Button from "../../components/common/Button/Button";
import Input from "../../components/common/Input/Input";
import Card from "../../components/common/Card/Card";
import Alert from "../../components/common/Alert/Alert";
import s from "./Login.module.css";
import logo from "../../assets/images/logo.png";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const invalid = !email.trim() || !isValidEmail(email);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (invalid) {
      setError("Por favor, ingresa un correo electrónico válido.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ correo: email }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        // Redirigir a la página de reset después de 2 segundos
        setTimeout(() => {
          navigate("/reset-password", { state: { email } });
        }, 2000);
      } else {
        setError(data.message || "Error al enviar el código");
      }
    } catch (err) {
      setError("Error de conexión. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={s.screen}>
      <form onSubmit={onSubmit} noValidate>
        <Card
          title={
            <div className={s.logoWrap}>
              <img src={logo} alt="Logo Inventario" className={s.logo} />
              <p className={s.appSubtitle}>Recuperar contraseña</p>
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
                {loading ? "Enviando..." : "Enviar código"}
              </Button>
              <Link to="/login" className={s.forgotLink}>
                Volver al inicio de sesión
              </Link>
            </>
          }
        >
          {error && <Alert variant="error">{error}</Alert>}
          {success && (
            <Alert variant="success">
              Código enviado. Revisa tu correo electrónico.
            </Alert>
          )}

          <p style={{ marginBottom: 16, color: "#64748b", fontSize: 14 }}>
            Ingresa tu correo electrónico y te enviaremos un código de verificación.
          </p>

          <Input
            label="Correo electrónico"
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
            autoComplete="email"
            disabled={loading || success}
          />
        </Card>
      </form>
    </section>
  );
}