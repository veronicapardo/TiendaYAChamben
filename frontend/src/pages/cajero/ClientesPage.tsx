import { useEffect, useMemo, useRef, useState } from "react";
import {
  LayoutDashboard,
  ShoppingCart,
  ClipboardList,
  Search,
  PackageCheck,
  Users,
  WalletCards,
  BarChart3,
  LogOut,
  Plus,
  Eye,
  MoreVertical,
  X,
  Phone,
  MapPin,
  ShoppingBag,
  Calendar,
  CreditCard,
  FileText,
  ChevronLeft,
  ChevronRight,
  Edit,
  Star,
  MessageCircle,
  Clock,
} from "lucide-react";
import type { UsuarioLogueado } from "../../App";
import type { VistaCajero } from "../../types/navigation";
import {
  obtenerClientes,
  crearCliente,
  actualizarCliente,
  type ClienteApi,
} from "../../services/api";
 
type Props = {
  usuario: UsuarioLogueado;
  onNavigate: (vista: VistaCajero) => void;
  onLogout: () => void;
};
type EstadoCliente = "Activo" | "Inactivo";
 
type Cliente = {
  id: number;
  nombre: string;
  telefono: string;
  nit?: string;
  ultimaCompra: string;
  estado: EstadoCliente;
  tipo: "frecuente" | "nuevo" | "normal";
  direccion?: string;
  totalCompras?: number;
  comprasRealizadas?: number;
  formaPagoPreferida?: string;
  notas?: string;
};
 
type Venta = {
  fecha: string;
  detalle: string;
  total: number;
  pago: "Efectivo" | "Tarjeta";
};
 

const HISTORIAL_MOCK: Record<number, Venta[]> = {
  1: [
    { fecha: "20/5/2026", detalle: "Venta #V-0002543", total: 180, pago: "Efectivo" },
    { fecha: "18/5/2026", detalle: "Venta #V-0002521", total: 250, pago: "Tarjeta" },
    { fecha: "15/5/2026", detalle: "Venta #V-0002487", total: 95, pago: "Efectivo" },
    { fecha: "12/5/2026", detalle: "Venta #V-0002450", total: 320, pago: "Tarjeta" },
  ],
  2: [
    { fecha: "18/5/2026", detalle: "Venta #V-0002519", total: 340, pago: "Tarjeta" },
    { fecha: "10/5/2026", detalle: "Venta #V-0002480", total: 150, pago: "Tarjeta" },
  ],
};
 
const ITEMS_POR_PAGINA = 6;
 
function formatearBolivianos(valor: number) {
  return `Bs. ${Number(valor).toLocaleString("es-BO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
 
function getIniciales(nombre: string) {
  return nombre.split(" ").slice(0, 2).map((n) => n[0]).join("");
}
 
function getColorAvatar(nombre: string) {
  const colores = [
    "#F28C00", "#3B82F6", "#10B981", "#8B5CF6",
    "#EF4444", "#06B6D4", "#F59E0B", "#6366F1",
  ];
  let hash = 0;
  for (let i = 0; i < nombre.length; i++) hash += nombre.charCodeAt(i);
  return colores[hash % colores.length];
}

function adaptarClienteApi(cliente: ClienteApi): Cliente {
  const fechaCreacion = cliente.createdAt ? new Date(cliente.createdAt) : null;
  const hoy = new Date();

  const esNuevo =
    fechaCreacion !== null &&
    fechaCreacion.getMonth() === hoy.getMonth() &&
    fechaCreacion.getFullYear() === hoy.getFullYear();

  return {
    id: cliente.id,
    nombre: cliente.nombre,
    telefono: cliente.telefono,
    nit: undefined,
    ultimaCompra: cliente.createdAt
      ? new Date(cliente.createdAt).toLocaleDateString("es-BO")
      : "-",
    estado: cliente.activo ? "Activo" : "Inactivo",
    tipo: esNuevo ? "nuevo" : "normal",
    direccion: cliente.direccion || "Sin dirección registrada",
    totalCompras: 0,
    comprasRealizadas: 0,
    formaPagoPreferida: "-",
    notas: "Cliente registrado en el sistema.",
  };
}
 
export function ClientesPage({ usuario, onNavigate, onLogout }: Props) {
  const [busqueda, setBusqueda] = useState("");
  const [filtroActivo, setFiltroActivo] = useState<"Todos" | "Frecuentes" | "Con factura" | "Nuevos">("Todos");
  const [pagina, setPagina] = useState(1);
  const inputRef = useRef<HTMLInputElement>(null);
  const [clientes, setClientes] = useState<Cliente[]>([]);
const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null);
const [cargando, setCargando] = useState(false);
const [error, setError] = useState("");

const [mostrarModalNuevo, setMostrarModalNuevo] = useState(false);
const [guardandoCliente, setGuardandoCliente] = useState(false);
const [mensajeExito, setMensajeExito] = useState("");

const [nuevoNombre, setNuevoNombre] = useState("");
const [nuevoTelefono, setNuevoTelefono] = useState("");
const [nuevaDireccion, setNuevaDireccion] = useState("");

const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null);

const [editarNombre, setEditarNombre] = useState("");
const [editarTelefono, setEditarTelefono] = useState("");
const [editarDireccion, setEditarDireccion] = useState("");
const [mostrarModalDesactivar, setMostrarModalDesactivar] = useState(false);
const [clienteDesactivando, setClienteDesactivando] = useState<Cliente | null>(null);

 async function cargarClientes() {
  try {
    setCargando(true);
    setError("");

    const datos = await obtenerClientes();
    const clientesAdaptados = datos.map(adaptarClienteApi);

    setClientes(clientesAdaptados);

    if (clientesAdaptados.length > 0) {
      setClienteSeleccionado(clientesAdaptados[0]);
    } else {
      setClienteSeleccionado(null);
    }
  } catch (error) {
    if (error instanceof Error) {
      setError(error.message);
    } else {
      setError("No se pudieron cargar los clientes.");
    }
  } finally {
    setCargando(false);
  }
}

useEffect(() => {
  cargarClientes();
}, []);

async function guardarNuevoCliente() {
  if (!nuevoNombre.trim() || !nuevoTelefono.trim()) {
    setError("El nombre y el teléfono son obligatorios.");
    return;
  }

  

  try {
    setGuardandoCliente(true);
    setError("");
    setMensajeExito("");

    await crearCliente({
      nombre: nuevoNombre.trim(),
      telefono: nuevoTelefono.trim(),
      direccion: nuevaDireccion.trim() || undefined,
    });

    setNuevoNombre("");
    setNuevoTelefono("");
    setNuevaDireccion("");
    setMostrarModalNuevo(false);

    await cargarClientes();

    setMensajeExito("Cliente registrado correctamente.");
  } catch (error) {
    if (error instanceof Error) {
      setError(error.message);
    } else {
      setError("No se pudo registrar el cliente.");
    }
  } finally {
    setGuardandoCliente(false);
  }
}

function abrirModalEditar(cliente: Cliente) {
  setClienteEditando(cliente);
  setEditarNombre(cliente.nombre);
  setEditarTelefono(cliente.telefono);
  setEditarDireccion(cliente.direccion || "");
  setError("");
  setMensajeExito("");
  setMostrarModalEditar(true);
}

function abrirModalDesactivar(cliente: Cliente) {
  setClienteDesactivando(cliente);
  setError("");
  setMensajeExito("");
  setMostrarModalDesactivar(true);
}

async function guardarEdicionCliente() {
  if (!clienteEditando) {
    return;
  }

  if (!editarNombre.trim() || !editarTelefono.trim()) {
    setError("El nombre y el teléfono son obligatorios.");
    return;
  }

  try {
    setGuardandoCliente(true);
    setError("");
    setMensajeExito("");

    await actualizarCliente(clienteEditando.id, {
      nombre: editarNombre.trim(),
      telefono: editarTelefono.trim(),
      direccion: editarDireccion.trim() || undefined,
    });

    setMostrarModalEditar(false);
    setClienteEditando(null);

    await cargarClientes();

    setMensajeExito("Cliente actualizado correctamente.");
  } catch (error) {
    if (error instanceof Error) {
      setError(error.message);
    } else {
      setError("No se pudo actualizar el cliente.");
    }
  } finally {
    setGuardandoCliente(false);
  }
}

async function desactivarClienteSeleccionado() {
  if (!clienteDesactivando) {
    return;
  }

  try {
    setGuardandoCliente(true);
    setError("");
    setMensajeExito("");

    await actualizarCliente(clienteDesactivando.id, {
      activo: false,
    });

    setMostrarModalDesactivar(false);
    setClienteDesactivando(null);

    await cargarClientes();

    setMensajeExito("Cliente desactivado correctamente.");
  } catch (error) {
    if (error instanceof Error) {
      setError(error.message);
    } else {
      setError("No se pudo desactivar el cliente.");
    }
  } finally {
    setGuardandoCliente(false);
  }
}
  const ahora = new Date();
  const fechaStr = `${ahora.getDate()}/${ahora.getMonth() + 1}/${ahora.getFullYear()}`;
  const horaStr = ahora.toLocaleTimeString("es-BO", { hour: "2-digit", minute: "2-digit" });
 
  const clientesFiltrados = useMemo(() => {
    const q = busqueda.toLowerCase().trim();
    return clientes.filter((c) => {
      const matchBusqueda = !q || c.nombre.toLowerCase().includes(q) || c.telefono.includes(q) || (c.nit || "").includes(q);
      const matchFiltro =
        filtroActivo === "Todos" ||
        (filtroActivo === "Frecuentes" && c.tipo === "frecuente") ||
        (filtroActivo === "Con factura" && c.nit) ||
        (filtroActivo === "Nuevos" && c.tipo === "nuevo");
      return matchBusqueda && matchFiltro;
    });
  }, [clientes, busqueda, filtroActivo]);
 
  const totalPaginas = Math.max(
  1,
  Math.ceil(clientesFiltrados.length / ITEMS_POR_PAGINA)
);
  const clientesPagina = clientesFiltrados.slice((pagina - 1) * ITEMS_POR_PAGINA, pagina * ITEMS_POR_PAGINA);
 
  const historial = clienteSeleccionado ? (HISTORIAL_MOCK[clienteSeleccionado.id] || []) : [];
 
  const totalRegistrados = clientes.length;
  const totalFrecuentes = clientes.filter((c) => c.tipo === "frecuente").length;
  const totalNuevos = clientes.filter((c) => c.tipo === "nuevo").length;
  const totalFactura = clientes.filter((c) => c.nit).length;
 
  return (
    <main className="cajero-dashboard">
      <aside className="cajero-sidebar">
        <div className="cajero-logo">
          <span className="logo-text-small">tienda</span>
          <span className="logo-text-main">Ya!</span>
        </div>
        <nav className="cajero-menu">
          <button className="menu-item" onClick={() => onNavigate("dashboard")}><LayoutDashboard size={22} /><span>Dashboard</span></button>
          <button className="menu-item" onClick={() => onNavigate("nueva-venta")}><ShoppingCart size={22} /><span>Nueva Venta</span></button>
          <button className="menu-item" onClick={() => onNavigate("registrar-pedido")}><ClipboardList size={22} /><span>Registrar Pedido</span></button>
          <button className="menu-item" onClick={() => onNavigate("buscar-producto")}><Search size={22} /><span>Buscar Producto</span></button>
          <button className="menu-item" onClick={() => onNavigate("pedidos-pendientes")}><PackageCheck size={22} /><span>Pedidos Pendientes</span></button>
          <button className="menu-item active" onClick={() => onNavigate("clientes")}><Users size={22} /><span>Clientes</span></button>
          <button className="menu-item" onClick={() => onNavigate("cierre-caja")}><WalletCards size={22} /><span>Cierre de Caja</span></button>
          <button className="menu-item" onClick={() => onNavigate("reportes")}><BarChart3 size={22} /><span>Reportes</span></button>
        </nav>
        <div className="sidebar-user">
          <div className="sidebar-user-icon"><Users size={22} /></div>
          <div><strong>{usuario.nombre}</strong><p>Turno: Mañana</p></div>
         <button
  type="button"
  onClick={onLogout}
  style={{
    border: "none",
    background: "transparent",
    color: "#b91c1c",
    cursor: "pointer",
    display: "grid",
    placeItems: "center",
  }}
>
  <LogOut size={18} />
</button>
        </div>
      </aside>
 
      <section className="cajero-content">
        {/* Header */}
        <header className="cl-header">
          <div>
            <h1>Clientes</h1>
            <p>Consulta, registra y administra la información de tus clientes</p>
          </div>
          <div className="cl-header-meta">
            <span className="cl-meta-item"><Calendar size={16} /> {fechaStr}</span>
            <span className="cl-meta-item"><Clock size={16} /> {horaStr}</span>
            <span className="cl-online"><span className="cl-dot" />Online</span>
          </div>
        </header>
 
        {/* Stats */}
        <div className="cl-stats">
          <div className="cl-stat-card">
            <div className="cl-stat-icon" style={{ background: "#FFF0E0" }}><Users size={24} color="#F28C00" /></div>
            <div><div className="cl-stat-label">Clientes registrados</div><div className="cl-stat-value">{totalRegistrados}</div><div className="cl-stat-sub">Total en el sistema</div></div>
          </div>
          <div className="cl-stat-card">
            <div className="cl-stat-icon" style={{ background: "#F0FFF4" }}><Star size={24} color="#10B981" /></div>
            <div><div className="cl-stat-label">Clientes frecuentes</div><div className="cl-stat-value">{totalFrecuentes}</div><div className="cl-stat-sub">Compras recurrentes</div></div>
          </div>
          <div className="cl-stat-card">
            <div className="cl-stat-icon" style={{ background: "#EFF6FF" }}><Users size={24} color="#3B82F6" /></div>
            <div><div className="cl-stat-label">Nuevos este mes</div><div className="cl-stat-value">{totalNuevos}</div><div className="cl-stat-sub">Desde el 1 de mayo</div></div>
          </div>
          <div className="cl-stat-card">
            <div className="cl-stat-icon" style={{ background: "#F5F3FF" }}><FileText size={24} color="#8B5CF6" /></div>
            <div><div className="cl-stat-label">Con factura</div><div className="cl-stat-value">{totalFactura}</div><div className="cl-stat-sub">Clientes con NIT/CI</div></div>
          </div>
        </div>
 
        {/* Main layout */}
        <div className="cl-main-layout">
          {/* Left: listado */}
          <div className="cl-listado-col">
            <div className="cl-listado-header-row">
              <h2 className="cl-listado-title">Listado de clientes</h2>
            </div>
 
            {/* Search + button */}
            <div className="cl-search-row">
              <div className="cl-input-wrap">
                <Search size={18} className="cl-input-icon" />
                <input
                  ref={inputRef}
                  className="cl-input"
                  type="text"
                  placeholder="Buscar por nombre, teléfono o NIT/CI"
                  value={busqueda}
                  onChange={(e) => { setBusqueda(e.target.value); setPagina(1); }}
                />
                {busqueda && (
                  <button className="cl-input-clear" onClick={() => setBusqueda("")}><X size={15} /></button>
                )}
              </div>
              <button
  className="cl-btn-nuevo"
  onClick={() => {
    setError("");
    setMensajeExito("");
    setMostrarModalNuevo(true);
  }}
>
  <Plus size={16} /> Nuevo cliente
</button>
            </div>
 
            {/* Filtros */}
            <div className="cl-filtros">
              {(["Todos", "Frecuentes", "Con factura", "Nuevos"] as const).map((f) => (
                <button
                  key={f}
                  className={`cl-filtro-btn ${filtroActivo === f ? "active" : ""}`}
                  onClick={() => { setFiltroActivo(f); setPagina(1); }}
                >{f}</button>
              ))}
            </div>
 
            {cargando && (
  <div style={{ padding: "12px", color: "#475569", fontWeight: 700 }}>
    Cargando clientes...
  </div>
)}

{error && (
  <div style={{ padding: "12px", color: "#b91c1c", fontWeight: 700 }}>
    {error}
  </div>
)}

{mensajeExito && (
  <div style={{ padding: "12px", color: "#15803d", fontWeight: 700 }}>
    {mensajeExito}
  </div>
)}
            <div className="cl-tabla-wrap">
              <table className="cl-tabla">
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Teléfono</th>
                    <th>NIT/CI</th>
                    <th>Última compra</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {clientesPagina.map((c) => (
                    <tr
                      key={c.id}
                      className={clienteSeleccionado?.id === c.id ? "cl-fila-activa" : ""}
                      onClick={() => setClienteSeleccionado(clienteSeleccionado?.id === c.id ? null : c)}
                    >
                      <td>
                        <div className="cl-cliente-cell">
                          <div className="cl-avatar" style={{ background: getColorAvatar(c.nombre) }}>
                            {getIniciales(c.nombre)}
                          </div>
                          <div>
                            <div className="cl-cliente-nombre">{c.nombre}</div>
                            {c.tipo === "frecuente" && <div className="cl-cliente-tipo">Cliente frecuente</div>}
                            {c.tipo === "nuevo" && <div className="cl-cliente-tipo nuevo">Cliente nuevo</div>}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="cl-tel-cell">
                          {c.telefono}
                          <MessageCircle size={15} color="#25D366" />
                        </div>
                      </td>
                      <td>{c.nit || <span className="cl-dash">–</span>}</td>
                      <td>{c.ultimaCompra}</td>
                      <td>
                        <span className={`cl-estado-badge ${c.estado === "Activo" ? "activo" : "inactivo"}`}>
                          <span className="cl-estado-dot" />
                          {c.estado}
                        </span>
                      </td>
                      <td>
                        <div className="cl-acciones">
                          <button
  className="cl-accion-btn"
  onClick={(e) => {
    e.stopPropagation();
    setClienteSeleccionado(c);
  }}
>
  <Eye size={16} />
</button>
                       <button
  className="cl-accion-btn"
  onClick={(e) => {
    e.stopPropagation();
    abrirModalDesactivar(c);
  }}
  disabled={c.estado === "Inactivo"}
  title={c.estado === "Inactivo" ? "Cliente ya inactivo" : "Desactivar cliente"}
>
  <MoreVertical size={16} />
</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
 
            {/* Paginación */}
            <div className="cl-paginacion">
              <span className="cl-pag-info">Mostrando {Math.min((pagina - 1) * ITEMS_POR_PAGINA + 1, clientesFiltrados.length)} a {Math.min(pagina * ITEMS_POR_PAGINA, clientesFiltrados.length)} de {clientesFiltrados.length} clientes</span>
              <div className="cl-pag-controles">
                <button className="cl-pag-btn" disabled={pagina === 1} onClick={() => setPagina(p => p - 1)}><ChevronLeft size={16} /></button>
                {Array.from({ length: Math.min(totalPaginas, 3) }, (_, i) => i + 1).map((n) => (
                  <button key={n} className={`cl-pag-btn ${pagina === n ? "active" : ""}`} onClick={() => setPagina(n)}>{n}</button>
                ))}
                {totalPaginas > 3 && <span className="cl-pag-dots">...</span>}
                {totalPaginas > 3 && (
                  <button className={`cl-pag-btn ${pagina === totalPaginas ? "active" : ""}`} onClick={() => setPagina(totalPaginas)}>{totalPaginas}</button>
                )}
                <button className="cl-pag-btn" disabled={pagina === totalPaginas} onClick={() => setPagina(p => p + 1)}><ChevronRight size={16} /></button>
              </div>
            </div>
          </div>
 
          {/* Right: perfil */}
          {clienteSeleccionado && (
            <aside className="cl-perfil-panel">
              <div className="cl-perfil-title">Perfil del cliente</div>
              <div className="cl-perfil-top">
                <div className="cl-perfil-avatar" style={{ background: getColorAvatar(clienteSeleccionado.nombre) }}>
                  {getIniciales(clienteSeleccionado.nombre)}
                </div>
                <div>
                  <div className="cl-perfil-nombre">{clienteSeleccionado.nombre}</div>
                  {clienteSeleccionado.tipo === "frecuente" && (
                    <span className="cl-perfil-badge frecuente">Cliente frecuente</span>
                  )}
                  {clienteSeleccionado.tipo === "nuevo" && (
                    <span className="cl-perfil-badge nuevo">Cliente nuevo</span>
                  )}
                </div>
              </div>
 
              <div className="cl-perfil-filas">
                <div className="cl-perfil-fila">
                  <Phone size={15} color="#9ca3af" />
                  <span className="cl-perfil-fila-label">Teléfono</span>
                  <span className="cl-perfil-fila-val">
                    {clienteSeleccionado.telefono}
                    <MessageCircle size={14} color="#25D366" style={{ marginLeft: 4 }} />
                  </span>
                </div>
                <div className="cl-perfil-fila">
                  <CreditCard size={15} color="#9ca3af" />
                  <span className="cl-perfil-fila-label">NIT / CI</span>
                  <span className="cl-perfil-fila-val">{clienteSeleccionado.nit || "–"}</span>
                </div>
                <div className="cl-perfil-fila">
                  <MapPin size={15} color="#9ca3af" />
                  <span className="cl-perfil-fila-label">Dirección</span>
                  <span className="cl-perfil-fila-val">{clienteSeleccionado.direccion || "–"}</span>
                </div>
                <div className="cl-perfil-fila">
                  <ShoppingBag size={15} color="#9ca3af" />
                  <span className="cl-perfil-fila-label">Total de compras</span>
                  <span className="cl-perfil-fila-val bold orange">{formatearBolivianos(clienteSeleccionado.totalCompras || 0)}</span>
                </div>
                <div className="cl-perfil-fila">
                  <Calendar size={15} color="#9ca3af" />
                  <span className="cl-perfil-fila-label">Última compra</span>
                  <span className="cl-perfil-fila-val">{clienteSeleccionado.ultimaCompra}</span>
                </div>
                <div className="cl-perfil-fila">
                  <ShoppingCart size={15} color="#9ca3af" />
                  <span className="cl-perfil-fila-label">Compras realizadas</span>
                  <span className="cl-perfil-fila-val">{clienteSeleccionado.comprasRealizadas} compras</span>
                </div>
                <div className="cl-perfil-fila">
                  <CreditCard size={15} color="#9ca3af" />
                  <span className="cl-perfil-fila-label">Forma de pago preferida</span>
                  <span className="cl-perfil-fila-val">{clienteSeleccionado.formaPagoPreferida || "–"}</span>
                </div>
                {clienteSeleccionado.notas && (
                  <div className="cl-perfil-fila">
                    <FileText size={15} color="#9ca3af" />
                    <span className="cl-perfil-fila-label">Notas</span>
                    <span className="cl-perfil-fila-val">{clienteSeleccionado.notas}</span>
                  </div>
                )}
              </div>
 
             <div className="cl-perfil-acciones">
  <button
    className="cl-btn-editar"
    onClick={() => abrirModalEditar(clienteSeleccionado)}
  >
    <Edit size={15} /> Editar
  </button>

  <button
    className="cl-btn-venta-perfil"
    onClick={() => onNavigate("nueva-venta")}
  >
    <ShoppingCart size={15} /> Nueva venta
  </button>

  {clienteSeleccionado.estado === "Activo" && (
    <button
      className="cl-btn-desactivar"
      onClick={() => abrirModalDesactivar(clienteSeleccionado)}
    >
      <X size={15} /> Desactivar
    </button>
  )}
</div>
              {/* Historial */}
              <div className="cl-historial-header">
                <span className="cl-historial-title">Historial reciente</span>
                <button className="cl-ver-mas">Ver más</button>
              </div>
              <table className="cl-historial-tabla">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Detalle</th>
                    <th>Total</th>
                    <th>Pago</th>
                  </tr>
                </thead>
                <tbody>
                  {historial.length === 0 ? (
                    <tr><td colSpan={4} style={{ textAlign: "center", color: "#9ca3af", padding: "12px" }}>Sin historial</td></tr>
                  ) : historial.map((v, i) => (
                    <tr key={i}>
                      <td>{v.fecha}</td>
                      <td>{v.detalle}</td>
                      <td>Bs. {v.total.toFixed(2)}</td>
                      <td>
                        <span className={`cl-pago-badge ${v.pago === "Efectivo" ? "efectivo" : "tarjeta"}`}>
                          {v.pago === "Efectivo" ? <WalletCards size={12} /> : <CreditCard size={12} />}
                          {v.pago}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </aside>
          )}
        </div>

                {mostrarModalNuevo && (
          <div className="cl-modal-fondo">
            <div className="cl-modal">
              <div className="cl-modal-header">
                <div>
                  <h2>Nuevo cliente</h2>
                  <p>Registra la información básica del cliente.</p>
                </div>

                <button
                  type="button"
                  onClick={() => setMostrarModalNuevo(false)}
                  disabled={guardandoCliente}
                >
                  <X size={22} />
                </button>
              </div>

              <div className="cl-modal-form">
                <label>
                  Nombre *
                  <input
                    value={nuevoNombre}
                    onChange={(e) => setNuevoNombre(e.target.value)}
                    placeholder="Ej: Juan Pérez"
                  />
                </label>

                <label>
                  Teléfono *
                  <input
                    value={nuevoTelefono}
                    onChange={(e) => setNuevoTelefono(e.target.value)}
                    placeholder="Ej: 71234567"
                  />
                </label>

                <label>
                  Dirección
                  <textarea
                    value={nuevaDireccion}
                    onChange={(e) => setNuevaDireccion(e.target.value)}
                    placeholder="Ej: Av. América Oeste #1234"
                    rows={3}
                  />
                </label>
              </div>

              <div className="cl-modal-actions">
                <button
                  type="button"
                  className="cl-modal-btn-cancelar"
                  onClick={() => setMostrarModalNuevo(false)}
                  disabled={guardandoCliente}
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  className="cl-modal-btn-guardar"
                  onClick={guardarNuevoCliente}
                  disabled={guardandoCliente}
                >
                  <Plus size={16} />
                  {guardandoCliente ? "Guardando..." : "Guardar cliente"}
                </button>
              </div>
            </div>
          </div>
        )}

                {mostrarModalEditar && clienteEditando && (
          <div className="cl-modal-fondo">
            <div className="cl-modal">
              <div className="cl-modal-header">
                <div>
                  <h2>Editar cliente</h2>
                  <p>Actualiza la información registrada del cliente.</p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setMostrarModalEditar(false);
                    setClienteEditando(null);
                  }}
                  disabled={guardandoCliente}
                >
                  <X size={22} />
                </button>
              </div>

              <div className="cl-modal-form">
                <label>
                  Nombre *
                  <input
                    value={editarNombre}
                    onChange={(e) => setEditarNombre(e.target.value)}
                    placeholder="Ej: Juan Pérez"
                  />
                </label>

                <label>
                  Teléfono *
                  <input
                    value={editarTelefono}
                    onChange={(e) => setEditarTelefono(e.target.value)}
                    placeholder="Ej: 71234567"
                  />
                </label>

                <label>
                  Dirección
                  <textarea
                    value={editarDireccion}
                    onChange={(e) => setEditarDireccion(e.target.value)}
                    placeholder="Ej: Av. América Oeste #1234"
                    rows={3}
                  />
                </label>
              </div>

              <div className="cl-modal-actions">
                <button
                  type="button"
                  className="cl-modal-btn-cancelar"
                  onClick={() => {
                    setMostrarModalEditar(false);
                    setClienteEditando(null);
                  }}
                  disabled={guardandoCliente}
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  className="cl-modal-btn-guardar"
                  onClick={guardarEdicionCliente}
                  disabled={guardandoCliente}
                >
                  <Edit size={16} />
                  {guardandoCliente ? "Guardando..." : "Guardar cambios"}
                </button>
              </div>
            </div>
          </div>
        )}

        {mostrarModalDesactivar && clienteDesactivando && (
  <div className="cl-modal-fondo">
    <div className="cl-modal">
      <div className="cl-modal-header">
        <div>
          <h2>Desactivar cliente</h2>
          <p>
            El cliente no se eliminará del historial, solo quedará marcado como inactivo.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setMostrarModalDesactivar(false);
            setClienteDesactivando(null);
          }}
          disabled={guardandoCliente}
        >
          <X size={22} />
        </button>
      </div>

      <div className="cl-modal-confirmacion">
        <div
          className="cl-perfil-avatar"
          style={{ background: getColorAvatar(clienteDesactivando.nombre) }}
        >
          {getIniciales(clienteDesactivando.nombre)}
        </div>

        <div>
          <strong>{clienteDesactivando.nombre}</strong>
          <p>{clienteDesactivando.telefono}</p>
          <span>{clienteDesactivando.direccion || "Sin dirección registrada"}</span>
        </div>
      </div>

      <div className="cl-modal-alerta">
        Esta acción no borra pedidos, ventas ni historial. Solo impide tratarlo como cliente activo.
      </div>

      <div className="cl-modal-actions">
        <button
          type="button"
          className="cl-modal-btn-cancelar"
          onClick={() => {
            setMostrarModalDesactivar(false);
            setClienteDesactivando(null);
          }}
          disabled={guardandoCliente}
        >
          Cancelar
        </button>

        <button
          type="button"
          className="cl-modal-btn-desactivar"
          onClick={desactivarClienteSeleccionado}
          disabled={guardandoCliente}
        >
          <X size={16} />
          {guardandoCliente ? "Desactivando..." : "Desactivar cliente"}
        </button>
      </div>
    </div>
  </div>
)}
      </section>
    </main>
  );
}