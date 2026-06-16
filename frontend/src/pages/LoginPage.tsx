import { useState, type FormEvent } from "react";
import type { RolUsuario, UsuarioLogueado } from "../App";
import { loginUsuario, type RolBackend } from "../services/api";

type Props = {
  rol: RolUsuario;
  onVolver: () => void;
  onLoginCorrecto: (usuario: UsuarioLogueado) => void;
};

function convertirRolABackend(rol: RolUsuario): RolBackend {
  if (rol === "ADMINISTRADOR") {
    return "DUENO";
  }

  return rol;
}

export function LoginPage({ rol, onVolver, onLoginCorrecto }: Props) {
  const [usuario, setUsuario] = useState("");
  const [contrasenia, setContrasenia] = useState("");
  const [mensajeError, setMensajeError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function iniciarSesion(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    setMensajeError("");
    setCargando(true);

    try {
      const respuesta = await loginUsuario({
        email: usuario,
        password: contrasenia,
        rol: convertirRolABackend(rol),
      });

      onLoginCorrecto(respuesta);
    } catch (error) {
      if (error instanceof Error) {
        setMensajeError(error.message);
      } else {
        setMensajeError("Error inesperado al iniciar sesión");
      }
    } finally {
      setCargando(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-background">
        <form className="login-box" onSubmit={iniciarSesion}>
          <header className="login-header">
            <h1>Inicio</h1>
          </header>

          <div className="login-content">
            <p>Ingrese los datos correspondientes:</p>

            <input
              type="email"
              placeholder="Correo electrónico"
              value={usuario}
              onChange={(evento) => setUsuario(evento.target.value)}
            />

            <input
              type="password"
              placeholder="Contraseña"
              value={contrasenia}
              onChange={(evento) => setContrasenia(evento.target.value)}
            />

            {mensajeError && <p className="login-error">{mensajeError}</p>}

            <button type="submit" className="btn-ingresar" disabled={cargando}>
              {cargando ? "Ingresando..." : "Ingresar"}
            </button>

            <button type="button" className="btn-volver" onClick={onVolver}>
              Volver
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}