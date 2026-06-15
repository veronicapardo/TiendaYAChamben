import "../../../styles/estilos_admin/stockadmin.css";

import { useState } from "react";
import {
  CalendarDays,
  Bell,
  Package,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Search,
  Plus,
  X,
} from "lucide-react";


type EstadoStock = "En stock" | "Bajo Stock" | "Agotado";

interface Producto {
  id: number;
  nombre: string;
  stockDisponible: number;
  stockMinimo: number;
  estado: EstadoStock;
  ultimaActualizacion: string;
  categoria: string;
}


const productosData: Producto[] = [
  {
    id: 1,
    nombre: "Nuggets Dino Sofía 1 kg",
    stockDisponible: 35,
    stockMinimo: 20,
    estado: "En stock",
    ultimaActualizacion: "12/05/2026",
    categoria: "Congelados",
  },
  {
    id: 2,
    nombre: "Leche pil",
    stockDisponible: 15,
    stockMinimo: 10,
    estado: "Bajo Stock",
    ultimaActualizacion: "12/05/2026",
    categoria: "Lácteos",
  },
  {
    id: 3,
    nombre: "Dulce de leche PIL 250 gr",
    stockDisponible: 0,
    stockMinimo: 20,
    estado: "Agotado",
    ultimaActualizacion: "12/05/2026",
    categoria: "Lácteos",
  },
  {
    id: 4,
    nombre: "Aceite Vegetol",
    stockDisponible: 30,
    stockMinimo: 10,
    estado: "En stock",
    ultimaActualizacion: "12/05/2026",
    categoria: "Aceites",
  },
  {
    id: 5,
    nombre: "Arroz Integral 1 kg",
    stockDisponible: 8,
    stockMinimo: 15,
    estado: "Bajo Stock",
    ultimaActualizacion: "11/05/2026",
    categoria: "Granos",
  },
  {
    id: 6,
    nombre: "Azúcar Refinada 2 kg",
    stockDisponible: 0,
    stockMinimo: 10,
    estado: "Agotado",
    ultimaActualizacion: "11/05/2026",
    categoria: "Abarrotes",
  },
];


const categorias = ["Todas las categorías", ...Array.from(new Set(productosData.map((p) => p.categoria)))];


const badgeClass: Record<EstadoStock, string> = {
  "En stock": "green",
  "Bajo Stock": "orange",
  "Agotado": "red",
};


const formVacio = {
  nombre: "",
  stockDisponible: "",
  stockMinimo: "",
  categoria: "",
  ultimaActualizacion: "",
  estado: "En stock" as EstadoStock,
};


export function StockPage() {
  const [busqueda, setBusqueda] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("Todas las categorías");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [form, setForm] = useState(formVacio);
  const [modoEdicion, setModoEdicion] = useState(false);

 
  const productosFiltrados = productosData.filter((p) => {
    const coincideBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria =
      filtroCategoria === "Todas las categorías" || p.categoria === filtroCategoria;
    return coincideBusqueda && coincideCategoria;
  });

  
  const total = productosData.length;
  const enStock = productosData.filter((p) => p.estado === "En stock").length;
  const bajStock = productosData.filter((p) => p.estado === "Bajo Stock").length;
  const agotado = productosData.filter((p) => p.estado === "Agotado").length;

  
  const abrirModalNuevo = () => {
    setForm(formVacio);
    setModoEdicion(false);
    setModalAbierto(true);
  };

  
  const seleccionarProducto = (p: Producto) => {
    setForm({
      nombre: p.nombre,
      stockDisponible: String(p.stockDisponible),
      stockMinimo: String(p.stockMinimo),
      categoria: p.categoria,
      ultimaActualizacion: p.ultimaActualizacion,
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
    <div className="stock-page">

      
      <div className="topbar-admin">
        <div className="topbar-title">
          <Package size={28} />
          <h1>Stock</h1>
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

      
      <div className="cards-grid">
        <div className="admin-card">
          <div>
            <h3>Total de Productos</h3>
            <h2>{total}</h2>
            <p>Productos</p>
          </div>
          <Package size={40} className="card-icon black" />
        </div>

        <div className="admin-card">
          <div>
            <h3>En Stock</h3>
            <h2 className="green">{enStock}</h2>
            <p>Productos</p>
          </div>
          <CheckCircle size={40} className="card-icon green" />
        </div>

        <div className="admin-card">
          <div>
            <h3>Stock Bajo</h3>
            <h2 className="orange">{bajStock}</h2>
            <p>Productos</p>
          </div>
          <AlertTriangle size={40} className="card-icon orange" />
        </div>

        <div className="admin-card">
          <div>
            <h3>Sin Stock</h3>
            <h2 className="red">{agotado}</h2>
            <p>Productos</p>
          </div>
          <XCircle size={40} className="card-icon red" />
        </div>
      </div>

      
      <div className="filters-row">
        <div className="search-box">
          <input
            type="text"
            placeholder="Buscar producto..."
            className="search-input"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <Search size={18} className="search-icon" />
        </div>

        <select
          className="filter-select"
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value)}
        >
          {categorias.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <button className="add-btn" onClick={abrirModalNuevo}>
          <Plus size={18} />
          Agregar producto
        </button>
      </div>

      
      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Stock Disponible</th>
              <th>Stock Mínimo</th>
              <th>Estado</th>
              <th>Última actualización</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {productosFiltrados.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "2rem", color: "#888" }}>
                  No se encontraron productos
                </td>
              </tr>
            ) : (
              productosFiltrados.map((p) => (
                <tr
                  key={p.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => seleccionarProducto(p)}
                >
                  <td>{p.nombre}</td>
                  <td>{p.stockDisponible} uds</td>
                  <td>{p.stockMinimo}</td>
                  <td>
                    <span className={`badge ${badgeClass[p.estado]}`}>
                      {p.estado}
                    </span>
                  </td>
                  <td>{p.ultimaActualizacion}</td>
                  <td className="acciones" onClick={(e) => e.stopPropagation()}>
                    Ver Lotes &nbsp; Editar &nbsp; Umbral
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      
      {modalAbierto && (
        <div
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
              maxWidth: "480px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
            }}
          >
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 700 }}>
                {modoEdicion ? "Editar Producto" : "Agregar Producto"}
              </h2>
              <button onClick={cerrarModal} style={{ background: "none", border: "none", cursor: "pointer", color: "#555" }}>
                <X size={22} />
              </button>
            </div>

            
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

              <label style={labelStyle}>
                Nombre del producto
                <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Ej: Leche PIL 1L" style={inputStyle} />
              </label>

              <label style={labelStyle}>
                Categoría
                <input name="categoria" value={form.categoria} onChange={handleChange} placeholder="Ej: Lácteos" style={inputStyle} />
              </label>

              <div style={{ display: "flex", gap: "1rem" }}>
                <label style={labelStyle}>
                  Stock disponible
                  <input name="stockDisponible" value={form.stockDisponible} onChange={handleChange} placeholder="0" type="number" style={inputStyle} />
                </label>
                <label style={labelStyle}>
                  Stock mínimo
                  <input name="stockMinimo" value={form.stockMinimo} onChange={handleChange} placeholder="0" type="number" style={inputStyle} />
                </label>
              </div>

              <div style={{ display: "flex", gap: "1rem" }}>
                <label style={labelStyle}>
                  Última actualización
                  <input name="ultimaActualizacion" value={form.ultimaActualizacion} onChange={handleChange} placeholder="dd/mm/aaaa" style={inputStyle} />
                </label>
                <label style={labelStyle}>
                  Estado
                  <select name="estado" value={form.estado} onChange={handleChange} style={inputStyle}>
                    <option value="En stock">En stock</option>
                    <option value="Bajo Stock">Bajo Stock</option>
                    <option value="Agotado">Agotado</option>
                  </select>
                </label>
              </div>

            </div>

            
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1.75rem" }}>
              <button
                onClick={cerrarModal}
                style={{ padding: "0.55rem 1.2rem", borderRadius: "8px", border: "1px solid #ddd", background: "#f5f5f5", cursor: "pointer", fontWeight: 600, fontSize: "0.9rem" }}
              >
                Cancelar
              </button>
              <button
                style={{ padding: "0.55rem 1.4rem", borderRadius: "8px", border: "none", background: "#f59e0b", color: "#fff", cursor: "pointer", fontWeight: 600, fontSize: "0.9rem" }}
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
