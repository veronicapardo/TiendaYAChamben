import { useEffect, useState } from "react";
import "../../../styles/estilos_admin/proveedoresadmin.css";
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
} from "lucide-react";

type Proveedor = {
  id: number;
  nombre: string;
  contactoNombre: string;
  telefono: string;
  email: string | null;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
};

const API_URL = "http://localhost:3000";

async function obtenerProveedores(): Promise<Proveedor[]> {
  const res = await fetch(`${API_URL}/v1/proveedores`);
  if (!res.ok) throw new Error("Error al obtener proveedores");
  return res.json();
}

async function crearProveedor(data: {
  nombre: string;
  contactoNombre: string;
  telefono: string;
  email?: string;
}): Promise<Proveedor> {
  const res = await fetch(`${API_URL}/v1/proveedores`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.mensaje || "Error al crear proveedor");
  return json;
}

async function actualizarProveedor(
  id: number,
  data: Partial<{ nombre: string; contactoNombre: string; telefono: string; email: string; activo: boolean }>
): Promise<Proveedor> {
  const res = await fetch(`${API_URL}/v1/proveedores/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.mensaje || "Error al actualizar proveedor");
  return json;
}

async function desactivarProveedor(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/v1/proveedores/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al desactivar proveedor");
}

// ---- HELPERS ----
const iniciales = (nombre: string) =>
  nombre.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

const AVATAR_COLORES = ["pink", "green-avatar", "purple-avatar", "blue-avatar", "orange-avatar"];

const getAvatarColor = (id: number) => AVATAR_COLORES[id % AVATAR_COLORES.length];

const mesActual = (fecha: string) => {
  const f = new Date(fecha);
  const ahora = new Date();
  return f.getMonth() === ahora.getMonth() && f.getFullYear() === ahora.getFullYear();
};

export function ProveedoresPage() {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("Todos los estados");

  // Modal
  const [mostrarModal, setMostrarModal] = useState(false);
  const [editando, setEditando] = useState<Proveedor | null>(null);
  const [form, setForm] = useState({
    nombre: "",
    contactoNombre: "",
    telefono: "",
    email: "",
  });

  const cargar = async () => {
    try {
      const data = await obtenerProveedores();
      setProveedores(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  // Contadores para tarjetas
  const total = proveedores.length;
  const activos = proveedores.filter((p) => p.activo).length;
  const inactivos = proveedores.filter((p) => !p.activo).length;
  const nuevosEsteMes = proveedores.filter((p) => mesActual(p.createdAt)).length;

  // Filtrado
  const proveedoresFiltrados = proveedores.filter((p) => {
    const coincideBusqueda =
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.contactoNombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.telefono.includes(busqueda) ||
      (p.email || "").toLowerCase().includes(busqueda.toLowerCase());

    const coincideEstado =
      filtroEstado === "Todos los estados" ||
      (filtroEstado === "Activo" && p.activo) ||
      (filtroEstado === "Inactivo" && !p.activo);

    return coincideBusqueda && coincideEstado;
  });

  const abrirAgregar = () => {
    setEditando(null);
    setForm({ nombre: "", contactoNombre: "", telefono: "", email: "" });
    setMostrarModal(true);
  };

  const abrirEditar = (p: Proveedor) => {
    setEditando(p);
    setForm({
      nombre: p.nombre,
      contactoNombre: p.contactoNombre,
      telefono: p.telefono,
      email: p.email || "",
    });
    setMostrarModal(true);
  };

  const guardar = async () => {
    try {
      if (editando) {
        await actualizarProveedor(editando.id, {
          nombre: form.nombre,
          contactoNombre: form.contactoNombre,
          telefono: form.telefono,
          email: form.email || undefined,
        });
      } else {
        await crearProveedor({
          nombre: form.nombre,
          contactoNombre: form.contactoNombre,
          telefono: form.telefono,
          email: form.email || undefined,
        });
      }
      setMostrarModal(false);
      cargar();
    } catch (e: any) {
      alert("Error: " + e.message);
    }
  };

  const desactivar = async (id: number) => {
    if (!confirm("¿Desactivar este proveedor?")) return;
    try {
      await desactivarProveedor(id);
      cargar();
    } catch (e: any) {
      alert("Error: " + e.message);
    }
  };

  if (cargando) return <div className="proveedores-page"><p>Cargando proveedores...</p></div>;
  if (error) return <div className="proveedores-page"><p style={{ color: "red" }}>Error: {error}</p></div>;

  return (
    <div className="proveedores-page">

      {/* TOPBAR */}
      <div className="topbar-admin">
        <div className="page-title">
          <Users size={30} />
          <h1>Proveedores</h1>
        </div>
        <div className="topbar-right">
          <div className="top-icon"><CalendarDays size={20} /></div>
          <span>{new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
          <div className="top-icon"><Bell size={20} /></div>
        </div>
      </div>

      {/* TARJETAS */}
      <div className="cards-grid">
        <div className="admin-card">
          <div>
            <h3>Total de Proveedores</h3>
            <h2>{total}</h2>
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
            <h2 className="blue">{nuevosEsteMes}</h2>
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
            <option>Todos los estados</option>
            <option>Activo</option>
            <option>Inactivo</option>
          </select>
        </div>
        <button className="add-btn" onClick={abrirAgregar}>
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
              <th>Contacto</th>
              <th>Teléfono</th>
              <th>Email</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {proveedoresFiltrados.map((p) => (
              <tr key={p.id}>
                <td>
                  <div className="cliente-info">
                    <div className={`avatar ${getAvatarColor(p.id)}`}>
                      {iniciales(p.nombre)}
                    </div>
                    {p.nombre}
                  </div>
                </td>
                <td>{p.contactoNombre}</td>
                <td>{p.telefono}</td>
                <td>{p.email || "—"}</td>
                <td>
                  <span className={`badge ${p.activo ? "green" : "red"}`}>
                    {p.activo ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="acciones">
                  <button
                    onClick={() => abrirEditar(p)}
                    style={{ color: "#f59e0b", background: "none", border: "none", cursor: "pointer", marginRight: 8 }}
                  >
                    Editar
                  </button>
                  {p.activo && (
                    <button
                      onClick={() => desactivar(p.id)}
                      style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer" }}
                    >
                      Desactivar
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {proveedoresFiltrados.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "2rem", color: "#9ca3af" }}>
                  No se encontraron proveedores
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL AGREGAR / EDITAR */}
      {mostrarModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999
        }}>
          <div style={{ background: "white", padding: 24, borderRadius: 12, width: 420 }}>
            <h2 style={{ marginBottom: 16 }}>
              {editando ? "Editar Proveedor" : "Agregar Proveedor"}
            </h2>

            {([
              { campo: "nombre", label: "Nombre de la empresa" },
              { campo: "contactoNombre", label: "Nombre del contacto" },
              { campo: "telefono", label: "Teléfono" },
              { campo: "email", label: "Email (opcional)" },
            ] as { campo: keyof typeof form; label: string }[]).map(({ campo, label }) => (
              <div key={campo} style={{ marginBottom: 12 }}>
                <label style={{ display: "block", marginBottom: 4, fontWeight: 600, fontSize: 14 }}>
                  {label}
                </label>
                <input
                  type={campo === "email" ? "email" : "text"}
                  value={form[campo]}
                  onChange={(e) => setForm({ ...form, [campo]: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #ddd", fontSize: 14 }}
                />
              </div>
            ))}

            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 16 }}>
              <button
                onClick={() => setMostrarModal(false)}
                style={{ padding: "8px 16px", borderRadius: 6, border: "1px solid #ddd", cursor: "pointer" }}
              >
                Cancelar
              </button>
              <button
                onClick={guardar}
                style={{ padding: "8px 16px", borderRadius: 6, background: "#f59e0b", color: "white", border: "none", cursor: "pointer" }}
              >
                {editando ? "Guardar cambios" : "Agregar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}