import "../../../styles/estilos_admin/proveedoresadmin.css";

import { useState } from "react";
import {
  CalendarDays,
  Bell,
  Search,
  Filter,
  Plus,
  Users,
  UserCheck,
  UserX,
  UserPlus,
  X,
} from "lucide-react";


interface Proveedor {
  id: number;
  nombre: string;
  iniciales: string;
  avatarColor: string;
  cliente: string;
  telefono: string;
  email: string;
  productos: number;
  badgeColor: string;
  estado: "Activo" | "Inactivo";
}


const proveedoresData: Proveedor[] = [
  {
    id: 1,
    nombre: "Abarrotes del Sur",
    iniciales: "AS",
    avatarColor: "pink",
    cliente: "Camila Lopez",
    telefono: "71234568",
    email: "adsur.bo@gmail.com",
    productos: 45,
    badgeColor: "purple",
    estado: "Activo",
  },
  {
    id: 2,
    nombre: "Productos la Roca",
    iniciales: "PR",
    avatarColor: "green-avatar",
    cliente: "Diego Fernández",
    telefono: "76543210",
    email: "plroca@gmail.com",
    productos: 32,
    badgeColor: "green-products",
    estado: "Activo",
  },
  {
    id: 3,
    nombre: "Mayorista Tito",
    iniciales: "MT",
    avatarColor: "purple-avatar",
    cliente: "Valeria Quispe",
    telefono: "70192837",
    email: "mtito.bo@gmail.com",
    productos: 28,
    badgeColor: "purple",
    estado: "Activo",
  },
  {
    id: 4,
    nombre: "Distribuidora Norte",
    iniciales: "DN",
    avatarColor: "pink",
    cliente: "Roberto Mamani",
    telefono: "79876543",
    email: "dnorte@gmail.com",
    productos: 15,
    badgeColor: "purple",
    estado: "Inactivo",
  },
  {
    id: 5,
    nombre: "Importaciones La Paz",
    iniciales: "IL",
    avatarColor: "green-avatar",
    cliente: "Sofía Choque",
    telefono: "72345678",
    email: "ilpaz@gmail.com",
    productos: 60,
    badgeColor: "green-products",
    estado: "Inactivo",
  },
];


const formVacio = {
  nombre: "",
  cliente: "",
  telefono: "",
  email: "",
  productos: "",
  estado: "Activo" as "Activo" | "Inactivo",
};


export function ProveedoresPage() {
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [form, setForm] = useState(formVacio);
  const [modoEdicion, setModoEdicion] = useState(false);

  
  const proveedoresFiltrados = proveedoresData.filter((p) => {
    const coincideBusqueda =
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.cliente.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.email.toLowerCase().includes(busqueda.toLowerCase());

    const coincideEstado =
      filtroEstado === "Todos" || p.estado === filtroEstado;

    return coincideBusqueda && coincideEstado;
  });

  
  const totalProveedores = proveedoresData.length;
  const activos = proveedoresData.filter((p) => p.estado === "Activo").length;
  const inactivos = proveedoresData.filter((p) => p.estado === "Inactivo").length;

  
  const abrirModalNuevo = () => {
    setForm(formVacio);
    setModoEdicion(false);
    setModalAbierto(true);
  };

  
  const seleccionarProveedor = (p: Proveedor) => {
    setForm({
      nombre: p.nombre,
      cliente: p.cliente,
      telefono: p.telefono,
      email: p.email,
      productos: String(p.productos),
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
    <div className="proveedores-page">

      
      <div className="topbar-admin">
        <div className="page-title">
          <Users size={30} />
          <h1>Proveedores</h1>
        </div>

        <div className="topbar-right">
          <div className="top-icon">
            <CalendarDays size={20} />
          </div>
          <span>May 12, 2026</span>
          <span>9:41 AM</span>
          <div className="top-icon">
            <Bell size={20} />
          </div>
        </div>
      </div>

      {/* CARDS */}
      <div className="cards-grid">
        <div className="admin-card">
          <div>
            <h3>Total de Proveedores</h3>
            <h2>{totalProveedores}</h2>
            <p>Proveedores</p>
          </div>
          <Users className="card-icon black-icon" size={38} />
        </div>

        <div className="admin-card">
          <div>
            <h3>Activos</h3>
            <h2 className="green">{activos}</h2>
            <p>Proveedores</p>
          </div>
          <UserCheck className="card-icon green-icon" size={38} />
        </div>

        <div className="admin-card">
          <div>
            <h3>Inactivos</h3>
            <h2 className="red">{inactivos}</h2>
            <p>Proveedores</p>
          </div>
          <UserX className="card-icon red-icon" size={38} />
        </div>

        <div className="admin-card">
          <div>
            <h3>Nuevos este mes</h3>
            <h2 className="blue">11</h2>
            <p>Proveedores</p>
          </div>
          <UserPlus className="card-icon blue-icon" size={38} />
        </div>
      </div>

      {/* FILTROS */}
      <div className="filters-row">
        <div className="search-box">
          <input
            type="text"
            placeholder="Buscar proveedor..."
            className="search-input"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <Search size={18} className="search-icon" />
        </div>

        <div className="filter-wrapper">
          <Filter size={18} className="filter-icon" />
          <select
            className="filter-select"
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
          >
            <option value="Todos">Todos los estados</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>

        <button className="add-btn" onClick={abrirModalNuevo}>
          <Plus size={18} />
          Agregar proveedor
        </button>
      </div>

      {/* TABLA */}
      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Proveedor</th>
              <th>Cliente</th>
              <th>Teléfono</th>
              <th>Email</th>
              <th>Productos que suministra</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {proveedoresFiltrados.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "2rem", color: "#888" }}>
                  No se encontraron proveedores
                </td>
              </tr>
            ) : (
              proveedoresFiltrados.map((p) => (
                <tr
                  key={p.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => seleccionarProveedor(p)}
                >
                  <td>
                    <div className="cliente-info">
                      <div className={`avatar ${p.avatarColor}`}>
                        {p.iniciales}
                      </div>
                      {p.nombre}
                    </div>
                  </td>
                  <td>{p.cliente}</td>
                  <td>{p.telefono}</td>
                  <td>{p.email}</td>
                  <td>
                    <span className={`badge ${p.badgeColor}`}>
                      {p.productos} Productos
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${p.estado === "Activo" ? "green" : "red"}`}>
                      {p.estado}
                    </span>
                  </td>
                  <td className="acciones" onClick={(e) => e.stopPropagation()}>
                    Ver lotes &nbsp; Editar &nbsp; Umbral
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      
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
            className="modal-box"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: "14px",
              padding: "2rem",
              width: "100%",
              maxWidth: "480px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
              position: "relative",
            }}
          >
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 700 }}>
                {modoEdicion ? "Editar Proveedor" : "Agregar Proveedor"}
              </h2>
              <button
                onClick={cerrarModal}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#555" }}
              >
                <X size={22} />
              </button>
            </div>

            
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

              <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "0.9rem", fontWeight: 600 }}>
                Nombre del proveedor
                <input
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  placeholder="Ej: Abarrotes del Sur"
                  style={inputStyle}
                />
              </label>

              <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "0.9rem", fontWeight: 600 }}>
                Cliente / Contacto
                <input
                  name="cliente"
                  value={form.cliente}
                  onChange={handleChange}
                  placeholder="Ej: Camila Lopez"
                  style={inputStyle}
                />
              </label>

              <div style={{ display: "flex", gap: "1rem" }}>
                <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "0.9rem", fontWeight: 600, flex: 1 }}>
                  Teléfono
                  <input
                    name="telefono"
                    value={form.telefono}
                    onChange={handleChange}
                    placeholder="71234567"
                    style={inputStyle}
                  />
                </label>

                <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "0.9rem", fontWeight: 600, flex: 1 }}>
                  Nº de productos
                  <input
                    name="productos"
                    value={form.productos}
                    onChange={handleChange}
                    placeholder="0"
                    type="number"
                    style={inputStyle}
                  />
                </label>
              </div>

              <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "0.9rem", fontWeight: 600 }}>
                Email
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="proveedor@gmail.com"
                  type="email"
                  style={inputStyle}
                />
              </label>

              <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "0.9rem", fontWeight: 600 }}>
                Estado
                <select
                  name="estado"
                  value={form.estado}
                  onChange={handleChange}
                  style={inputStyle}
                >
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </label>
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
                  background: "#111",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                }}
              >
                {modoEdicion ? "Guardar cambios" : "Agregar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


const inputStyle: React.CSSProperties = {
  padding: "0.5rem 0.75rem",
  borderRadius: "8px",
  border: "1px solid #ddd",
  fontSize: "0.9rem",
  outline: "none",
  fontFamily: "inherit",
  background: "#fafafa",
};
