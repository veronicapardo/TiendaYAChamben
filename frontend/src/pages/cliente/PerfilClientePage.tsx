import "../../styles/cliente/perfil-cliente.css";

import { useState, useEffect } from "react";
import { NavbarCliente } from "../../components/cliente/NavbarCliente";
import { Logo } from "../../components/logo";
import { PaginaActualC } from "../../components/cliente/PaginaActualC";
import {
  MapPin,
  CreditCard,
  Bell,
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
  const [nombre, setNombre] =useState("Juan");
  const [apellido, setApellido] =useState("Pérez");
  const [email, setEmail] =useState("juan@gmail.com");
  const [telefono, setTelefono] =useState("76543210");

  // 🚀 NUEVO: Control de modo edición en interfaz
  const [editando, setEditando] = useState(false);

  useEffect(() => {
    /* CONEXIÓN BACKEND (Instrucciones para el desarrollador Backend):
       - MÉTODO HTTP: GET
       - ENDPOINT RECOMENDADO: /api/cliente/perfil
       - DESCRIPCIÓN: Carga los datos del cliente que se encuentra autenticado en su sesión actual.
       - MAPEO: setNombre(res.nombre), setApellido(res.apellido), setEmail(res.email), setTelefono(res.telefono)
    */
  }, []);

  function guardarCambios() {
    /* 🔌 CONEXIÓN BACKEND (Instrucciones para el desarrollador Backend):
       - MÉTODO HTTP: PUT o PATCH
       - ENDPOINT RECOMENDADO: /api/cliente/perfil/actualizar
       - BODY: { nombre, apellido, email, telefono }
    */
    setEditando(false);
    alert("Información actualizada correctamente");
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
          {nombre} {apellido}
        </h1>
      </section>

      {/* TARJETA INFO (Cambia dinámicamente si el usuario da clic en editar) */}
      <section className={`perfil-tarjeta-gris ${editando ? "en-edicion" : ""}`}>
        <div className="tarjeta-info-contenido" style={{ width: "100%" }}>
          <strong>Información personal</strong>
          
          {editando ? (
            <div className="inputs-edicion-perfil" style={{ display: "flex", flexDirection: "column", gap: "5px", marginTop: "8px" }}>
              <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre" />
              <input type="text" value={apellido} onChange={(e) => setApellido(e.target.value)} placeholder="Apellido" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
              <input type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="Teléfono" />
            </div>
          ) : (
            <>
              <span className="tarjeta-subtexto">{email}</span>
              <span className="tarjeta-subtexto">+591 {telefono}</span>
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

      {/* OPCIONES */}
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
        </div>

        {/* MÉTODOS PAGO */}
        <div className="opcion-item">
          <div className="opcion-izquierda">
            <CreditCard size={20} />
            <span className="opcion-texto">Métodos de pago</span>
          </div>
          <button className="btn-editar-lapiz" onClick={() => onNavigate("metodos-pago-cliente")}>
            <Pencil size={18} />
          </button>
        </div>

        {/* NOTIFICACIONES */}
        <div className="opcion-item">
          <div className="opcion-izquierda">
            <Bell size={20} />
            <span className="opcion-texto">Historial de notificaciones</span>
          </div>
        </div>
      </section>

      {/* LOGOUT */}
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