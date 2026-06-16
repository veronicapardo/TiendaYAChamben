import "../../styles/cliente/perfil-cliente.css";

import { useState, useEffect } from "react";
import { NavbarCliente } from "../../components/cliente/NavbarCliente";
import { Logo } from "../../components/logo";
import { PaginaActualC } from "../../components/cliente/PaginaActualC";
import {
  MapPin,
  Pencil,
  LogOut,
  BadgeCheck,
  UserRound,
  Check,
} from "lucide-react";

type Props = {
  onNavigate: (pagina: string) => void;
};

export function PerfilClientePage({ onNavigate }: Props) {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");

  // 🚀 NUEVO: Control de modo edición en interfaz
  const [editando, setEditando] = useState(false);

  useEffect(() => {
  async function cargarPerfil() {
    try {
      const response = await fetch(
        "http://localhost:3000/api/clientes/perfil/1"
      );

      if (!response.ok) {
        throw new Error("Error al cargar perfil");
      }

      const data = await response.json();

      setNombre(data.nombre);
      setTelefono(data.telefono);
      setDireccion(data.direccion ?? "");
    } catch (error) {
      console.error(error);
    }
  }

  cargarPerfil();
  }, []);

  async function guardarCambios() {
  try {
    const response = await fetch(
      "http://localhost:3000/api/clientes/perfil/1",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre,
          telefono,
          direccion,
        }),
      }
    );

    if (!response.ok) {
      throw new Error();
    }

    setEditando(false);

    alert("Información actualizada");
  } catch (error) {
    console.error(error);
    alert("Error al actualizar");
  }
}

  function manejarCerrarSesion() {
    /* 🔌 CONEXIÓN BACKEND:
       - Aquí se debe remover el Token de autenticación (localStorage.removeItem("token"), etc.)
    */
    alert("Sesión cerrada");
    onNavigate("login"); // Te redirige a la pantalla de login o bienvenida
  }

  return (
    <main className="perfil-cliente-page">
      <header className="cliente-header">
        <Logo width="260px" />
      </header>

      <PaginaActualC titulo="Perfil" />

      {/* AVATAR */}
      <section className="perfil-avatar-seccion">
        <div className="avatar-contenedor">
          <div className="avatar-circulo">
            <UserRound size={50} />
          </div>
          <div className="avatar-check">
            <BadgeCheck size={18} />
          </div>
        </div>

        <h1 className="perfil-nombre-usuario">
          {nombre}
        </h1>
      </section>

      {/* TARJETA INFO (Cambia dinámicamente si el usuario da clic en editar) */}
      <section className={`perfil-tarjeta-gris ${editando ? "en-edicion" : ""}`}>
        <div className="tarjeta-info-contenido" style={{ width: "100%" }}>
          <strong>Información personal</strong>
          
          {editando ? (
            <div className="inputs-edicion-perfil" style={{ display: "flex", flexDirection: "column", gap: "5px", marginTop: "8px" }}>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Nombre"
              />

              <input
                type="text"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="Teléfono"
              />

              <input
                type="text"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                placeholder="Dirección"
              />
            </div>
          ) : (
            <>
              <span className="tarjeta-subtexto">
                +591 {telefono}
              </span>

              <span className="tarjeta-subtexto">
                {direccion}
              </span>
            </>
          )}
        </div>

        {editando ? (
          <button className="btn-editar-lapiz btn-guardar-cambios" onClick={guardarCambios} style={{ backgroundColor: "#22c55e", color: "white" }}>
            <Check size={18} />
          </button>
        ) : (
          <button className="btn-editar-lapiz" onClick={() => setEditando(true)}>
            <Pencil size={18} />
          </button>
        )}
      </section>

      <section className="perfil-menu-opciones">
        {/* DIRECCIONES */}
        <div className="opcion-item">
          <div className="opcion-izquierda">
            <MapPin size={20} />
            <span className="opcion-texto">Direcciones guardadas</span>
          </div>
          <button className="btn-editar-lapiz" onClick={() => onNavigate("direcciones-cliente")}>
            <Pencil size={18} />
          </button>
        </div>      </section>      {/* LOGOUT */}
      <footer className="perfil-footer-acciones">
        <button className="btn-logout" onClick={manejarCerrarSesion}>
          <LogOut size={18} />
          <span>Cerrar sesión</span>
        </button>
      </footer>

      {/* Navbar sincronizado */}
      <NavbarCliente paginaActiva="perfil" onNavigate={onNavigate} />
    </main>
  );
}