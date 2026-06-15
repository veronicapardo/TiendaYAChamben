import "../../styles/estilos_admin/pedidosadmin.css";

import { useState } from "react";
import {
  CalendarDays,
  Bell,
  Package,
  Loader,
  Truck,
  CheckCircle,
  Search,
  Plus,
  SlidersHorizontal,
  X,
} from "lucide-react";

// ── Tipos ────────────────────────────────────────────────────────────────────
type EstadoPedido = "En preparación" | "En camino" | "Pedido entregado";

interface Pedido {
  id: number;
  numero: string;
  fecha: string;
  clienteNombre: string;
  clienteIniciales: string;
  clienteAvatarColor: string;
  clienteTelefono: string;
  direccion: string;
  hora: string;
  total: string;
  estado: EstadoPedido;
}

// ── Datos de ejemplo ─────────────────────────────────────────────────────────
const pedidosData: Pedido[] = [
  {
    id: 1,
    numero: "#021",
    fecha: "12/05/2026",
    clienteNombre: "Maria Lopez",
    clienteIniciales: "ML",
    clienteAvatarColor: "pink",
    clienteTelefono: "77232321",
    direccion: "Av. America 123",
    hora: "10:25 am",
    total: "Bs/ 45.00",
    estado: "En preparación",
  },
  {
    id: 2,
    numero: "#020",
    fecha: "12/05/2026",
    clienteNombre: "Juan Pérez",
    clienteIniciales: "JP",
    clienteAvatarColor: "green-avatar",
    clienteTelefono: "70012123",
    direccion: "Av. Libertador 453",
    hora: "10:05 am",
    total: "Bs/ 32.50",
    estado: "En camino",
  },
  {
    id: 3,
    numero: "#019",
    fecha: "12/05/2026",
    clienteNombre: "Ana Torres",
    clienteIniciales: "AT",
    clienteAvatarColor: "purple",
    clienteTelefono: "78182394",
    direccion: "Av. Beijing 1001",
    hora: "09:45 am",
    total: "Bs/ 50.75",
    estado: "Pedido entregado",
  },
  {
    id: 4,
    numero: "#018",
    fecha: "11/05/2026",
    clienteNombre: "Carlos Mendoza",
    clienteIniciales: "CM",
    clienteAvatarColor: "pink",
    clienteTelefono: "71987654",
    direccion: "Calle 6 de Agosto 789",
    hora: "09:10 am",
    total: "Bs/ 78.00",
    estado: "En preparación",
  },
  {
    id: 5,
    numero: "#017",
    fecha: "11/05/2026",
    clienteNombre: "Lucia Quispe",
    clienteIniciales: "LQ",
    clienteAvatarColor: "green-avatar",
    clienteTelefono: "76543219",
    direccion: "Av. Montes 302",
    hora: "08:50 am",
    total: "Bs/ 21.00",
    estado: "Pedido entregado",
  },
];

// ── Badge color por estado ────────────────────────────────────────────────────
const badgeClass: Record<EstadoPedido, string> = {
  "En preparación": "blue",
  "En camino": "orange",
  "Pedido entregado": "green",
};

// ── Formulario vacío ─────────────────────────────────────────────────────────
const formVacio = {
  numero: "",
  fecha: "",
  clienteNombre: "",
  clienteTelefono: "",
  direccion: "",
  hora: "",
  total: "",
  estado: "En preparación" as EstadoPedido,
};

// ── Componente principal ─────────────────────────────────────────────────────
export function PedidosPendientesPage() {
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [form, setForm] = useState(formVacio);
  const [modoEdicion, setModoEdicion] = useState(false);

  // ── Filtrado ──────────────────────────────────────────────────────────────
  const pedidosFiltrados = pedidosData.filter((p) => {
    const coincideBusqueda =
      p.clienteNombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.numero.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.direccion.toLowerCase().includes(busqueda.toLowerCase());

    const coincideEstado =
      filtroEstado === "Todos" || p.estado === filtroEstado;

    return coincideBusqueda && coincideEstado;
  });

  // ── Contadores cards ──────────────────────────────────────────────────────
  const total = pedidosData.length;
  const enPreparacion = pedidosData.filter((p) => p.estado === "En preparación").length;
  const enCamino = pedidosData.filter((p) => p.estado === "En camino").length;
  const entregados = pedidosData.filter((p) => p.estado === "Pedido entregado").length;

  // ── Abrir modal nuevo ─────────────────────────────────────────────────────
  const abrirModalNuevo = () => {
    setForm(formVacio);
    setModoEdicion(false);
    setModalAbierto(true);
  };

  // ── Seleccionar pedido ────────────────────────────────────────────────────
  const seleccionarPedido = (p: Pedido) => {
    setForm({
      numero: p.numero,
      fecha: p.fecha,
      clienteNombre: p.clienteNombre,
      clienteTelefono: p.clienteTelefono,
      direccion: p.direccion,
      hora: p.hora,
      total: p.total,
      estado: p.estado,
    });
    setModoEdicion(true);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setForm(formVacio);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="pedidos-page">

      {/* TOPBAR */}
      <div className="topbar-admin">
        <div className="topbar-title">
          <Package size={28} />
          <h1>Pedidos recientes</h1>
        </div>

        <div className="topbar-right">
          <div className="topbar-box">
            <CalendarDays size={18} />
          </div>
          <div className="topbar-box">
            <span>May 12, 2026</span>
          </div>
          <div className="topbar-box">
            <span>9:41 AM</span>
          </div>
          <div className="topbar-box">
            <Bell size={18} />
          </div>
        </div>
      </div>

      {/* CARDS */}
      <div className="cards-grid">
        <div className="admin-card">
          <div>
            <h3>Total de Pedidos</h3>
            <h2>{total}</h2>
            <p>Pedidos</p>
          </div>
          <Package size={38} className="card-icon brown" />
        </div>

        <div className="admin-card">
          <div>
            <h3>En Preparación</h3>
            <h2 className="blue">{enPreparacion}</h2>
            <p>Pedidos</p>
          </div>
          <Loader size={38} className="card-icon blue" />
        </div>

        <div className="admin-card">
          <div>
            <h3>En Camino</h3>
            <h2 className="orange">{enCamino}</h2>
            <p>Pedidos</p>
          </div>
          <Truck size={38} className="card-icon orange" />
        </div>

        <div className="admin-card">
          <div>
            <h3>Entregados hoy</h3>
            <h2 className="green">{entregados}</h2>
            <p>Pedidos</p>
          </div>
          <CheckCircle size={38} className="card-icon green" />
        </div>
      </div>

      {/* FILTROS */}
      <div className="filters-row">
        <div className="search-box">
          <input
            type="text"
            placeholder="Buscar pedido..."
            className="search-input"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <Search size={18} className="search-icon" />
        </div>

        <div className="filter-wrapper">
          <SlidersHorizontal size={18} />
          <select
            className="filter-select"
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
          >
            <option value="Todos">Todos los estados</option>
            <option value="En preparación">En preparación</option>
            <option value="En camino">En camino</option>
            <option value="Pedido entregado">Pedido entregado</option>
          </select>
        </div>

        <button className="add-btn" onClick={abrirModalNuevo}>
          <Plus size={18} />
          Nuevo pedido
        </button>
      </div>

      {/* TABLA */}
      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Pedido</th>
              <th>Fecha del pedido</th>
              <th>Cliente</th>
              <th>Dirección</th>
              <th>Hora</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {pedidosFiltrados.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: "center", padding: "2rem", color: "#888" }}>
                  No se encontraron pedidos
                </td>
              </tr>
            ) : (
              pedidosFiltrados.map((p) => (
                <tr
                  key={p.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => seleccionarPedido(p)}
                >
                  <td>{p.numero}</td>
                  <td>{p.fecha}</td>

                  <td>
                    <div className="cliente-box">
                      <div className={`cliente-avatar ${p.clienteAvatarColor}`}>
                        {p.clienteIniciales}
                      </div>
                      <div>
                        <p className="cliente-nombre">{p.clienteNombre}</p>
                        <span className="cliente-phone">{p.clienteTelefono}</span>
                      </div>
                    </div>
                  </td>

                  <td>{p.direccion}</td>
                  <td>{p.hora}</td>
                  <td className="total-bold">{p.total}</td>

                  <td>
                    <span className={`badge ${badgeClass[p.estado]}`}>
                      {p.estado}
                    </span>
                  </td>

                  <td className="acciones" onClick={(e) => e.stopPropagation()}>
                    Ver Lotes
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {modalAbierto && (
        <div
          className="modal-overlay"
          onClick={cerrarModal}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: "14px",
              padding: "2rem",
              width: "100%",
              maxWidth: "500px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
              position: "relative",
            }}
          >
            {/* Cabecera */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 700 }}>
                {modoEdicion ? "Detalle del Pedido" : "Nuevo Pedido"}
              </h2>
              <button
                onClick={cerrarModal}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#555" }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Campos */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

              <div style={{ display: "flex", gap: "1rem" }}>
                <label style={labelStyle}>
                  Nº Pedido
                  <input name="numero" value={form.numero} onChange={handleChange} placeholder="#022" style={inputStyle} />
                </label>
                <label style={labelStyle}>
                  Fecha
                  <input name="fecha" value={form.fecha} onChange={handleChange} placeholder="dd/mm/aaaa" style={inputStyle} />
                </label>
              </div>

              <label style={labelStyle}>
                Cliente
                <input name="clienteNombre" value={form.clienteNombre} onChange={handleChange} placeholder="Nombre completo" style={inputStyle} />
              </label>

              <div style={{ display: "flex", gap: "1rem" }}>
                <label style={labelStyle}>
                  Teléfono
                  <input name="clienteTelefono" value={form.clienteTelefono} onChange={handleChange} placeholder="7xxxxxxx" style={inputStyle} />
                </label>
                <label style={labelStyle}>
                  Hora
                  <input name="hora" value={form.hora} onChange={handleChange} placeholder="10:00 am" style={inputStyle} />
                </label>
              </div>

              <label style={labelStyle}>
                Dirección
                <input name="direccion" value={form.direccion} onChange={handleChange} placeholder="Av. ..." style={inputStyle} />
              </label>

              <div style={{ display: "flex", gap: "1rem" }}>
                <label style={labelStyle}>
                  Total (Bs/)
                  <input name="total" value={form.total} onChange={handleChange} placeholder="0.00" style={inputStyle} />
                </label>
                <label style={labelStyle}>
                  Estado
                  <select name="estado" value={form.estado} onChange={handleChange} style={inputStyle}>
                    <option value="En preparación">En preparación</option>
                    <option value="En camino">En camino</option>
                    <option value="Pedido entregado">Pedido entregado</option>
                  </select>
                </label>
              </div>

            </div>

            {/* Botones */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1.75rem" }}>
              <button
                onClick={cerrarModal}
                style={{
                  padding: "0.55rem 1.2rem",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  background: "#f5f5f5",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                }}
              >
                Cancelar
              </button>
              <button
                style={{
                  padding: "0.55rem 1.4rem",
                  borderRadius: "8px",
                  border: "none",
                  background: "#f59e0b",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                }}
              >
                {modoEdicion ? "Guardar cambios" : "Crear pedido"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// ── Estilos reutilizables ────────────────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  padding: "0.5rem 0.75rem",
  borderRadius: "8px",
  border: "1px solid #ddd",
  fontSize: "0.9rem",
  outline: "none",
  fontFamily: "inherit",
  background: "#fafafa",
  width: "100%",
};

const labelStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  fontSize: "0.9rem",
  fontWeight: 600,
  flex: 1,
};
