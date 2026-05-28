import { useEffect, useState } from "react";
import "../../../styles/estilos_admin/pedidosadmin.css";
import {
  CalendarDays, Bell, Package, Loader,
  Truck, CheckCircle, Search, SlidersHorizontal,
} from "lucide-react";
import {
  obtenerPedidosAdmin,
  actualizarEstadoPedido,
  type PedidoAdminDto,
} from "../../../services/api";

const ESTADOS = [
  "Todos",
  "PENDIENTE",
  "EN_PREPARACION",
  "LISTO_PARA_ENTREGAR",
  "EN_CAMINO",
  "ENTREGADO",
  "CANCELADO",
];

const ESTADO_LABELS: Record<string, string> = {
  PENDIENTE: "Pendiente",
  EN_PREPARACION: "En preparación",
  LISTO_PARA_ENTREGAR: "Listo para entregar",
  EN_CAMINO: "En camino",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
  ENTREGA_FALLIDA: "Entrega fallida",
};

const ESTADO_CLASES: Record<string, string> = {
  EN_PREPARACION: "badge blue",
  EN_CAMINO: "badge orange",
  ENTREGADO: "badge green",
  PENDIENTE: "badge gray",
  CANCELADO: "badge red",
  LISTO_PARA_ENTREGAR: "badge purple",
  ENTREGA_FALLIDA: "badge red",
};

export function PedidosPage() {
  const [pedidos, setPedidos] = useState<PedidoAdminDto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("Todos");

  const cargar = async () => {
    try {
      const data = await obtenerPedidosAdmin();
      // Ordenar por fecha más reciente
      data.sort((a, b) => new Date(b.fechaHora).getTime() - new Date(a.fechaHora).getTime());
      setPedidos(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  // Contadores para tarjetas
  const hoy = new Date().toDateString();
  const totalHoy = pedidos.filter((p) => new Date(p.fechaHora).toDateString() === hoy).length;
  const enPreparacion = pedidos.filter((p) => p.estado === "EN_PREPARACION").length;
  const enCamino = pedidos.filter((p) => p.estado === "EN_CAMINO").length;
  const entregadosHoy = pedidos.filter(
    (p) => p.estado === "ENTREGADO" && new Date(p.fechaHora).toDateString() === hoy
  ).length;

  const pedidosFiltrados = pedidos.filter((p) => {
    const coincideBusqueda =
      String(p.id).includes(busqueda) ||
      p.clienteNombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.direccionEntrega.toLowerCase().includes(busqueda.toLowerCase());
    const coincideEstado = estadoFiltro === "Todos" || p.estado === estadoFiltro;
    return coincideBusqueda && coincideEstado;
  });

  const cambiarEstado = async (id: number, nuevoEstado: PedidoAdminDto["estado"]) => {
    try {
      await actualizarEstadoPedido(id, nuevoEstado);
      cargar();
    } catch (e: any) {
      alert("Error: " + e.message);
    }
  };

  // Iniciales del nombre
  const iniciales = (nombre: string) =>
    nombre.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  if (cargando) return <div className="pedidos-page"><p>Cargando pedidos...</p></div>;
  if (error) return <div className="pedidos-page"><p style={{ color: "red" }}>Error: {error}</p></div>;

  return (
    <div className="pedidos-page">
      {/* TOPBAR */}
      <div className="topbar-admin">
        <div className="topbar-title">
          <Package size={28} />
          <h1>Pedidos recientes</h1>
        </div>
        <div className="topbar-right">
          <div className="topbar-box"><CalendarDays size={18} /></div>
          <div className="topbar-box">
            <span>{new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
          </div>
          <div className="topbar-box"><Bell size={18} /></div>
        </div>
      </div>

      {/* CARDS */}
      <div className="cards-grid">
        <div className="admin-card">
          <div><h3>Total de Pedidos (hoy)</h3><h2>{totalHoy}</h2><p>Pedidos</p></div>
          <Package size={38} className="card-icon brown" />
        </div>
        <div className="admin-card">
          <div><h3>En Preparación</h3><h2 className="blue">{enPreparacion}</h2><p>Pedidos</p></div>
          <Loader size={38} className="card-icon blue" />
        </div>
        <div className="admin-card">
          <div><h3>En Camino</h3><h2 className="orange">{enCamino}</h2><p>Pedidos</p></div>
          <Truck size={38} className="card-icon orange" />
        </div>
        <div className="admin-card">
          <div><h3>Entregados hoy</h3><h2 className="green">{entregadosHoy}</h2><p>Pedidos</p></div>
          <CheckCircle size={38} className="card-icon green" />
        </div>
      </div>

      {/* FILTROS */}
      <div className="filters-row">
        <div className="search-box">
          <input
            type="text"
            placeholder="Buscar pedido, cliente..."
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
            value={estadoFiltro}
            onChange={(e) => setEstadoFiltro(e.target.value)}
          >
            {ESTADOS.map((e) => <option key={e} value={e}>{e === "Todos" ? "Todos los estados" : ESTADO_LABELS[e]}</option>)}
          </select>
        </div>
      </div>

      {/* TABLA */}
      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Pedido</th>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Dirección</th>
              <th>Hora</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Cambiar estado</th>
            </tr>
          </thead>
          <tbody>
            {pedidosFiltrados.map((p) => (
              <tr key={p.id}>
                <td>#{p.id}</td>
                <td>{new Date(p.fechaHora).toLocaleDateString("es-BO")}</td>
                <td>
                  <div className="cliente-box">
                    <div className="cliente-avatar pink">{iniciales(p.clienteNombre)}</div>
                    <div>
                      <p className="cliente-nombre">{p.clienteNombre}</p>
                    </div>
                  </div>
                </td>
                <td>{p.direccionEntrega}</td>
                <td>{new Date(p.fechaHora).toLocaleTimeString("es-BO", { hour: "2-digit", minute: "2-digit" })}</td>
                <td className="total-bold">Bs/ {Number(p.total).toFixed(2)}</td>
                <td>
                  <span className={ESTADO_CLASES[p.estado] || "badge gray"}>
                    {ESTADO_LABELS[p.estado] || p.estado}
                  </span>
                </td>
                <td>
                  <select
                    value={p.estado}
                    onChange={(e) => cambiarEstado(p.id, e.target.value as PedidoAdminDto["estado"])}
                    style={{ fontSize: 12, padding: "4px 8px", borderRadius: 6, border: "1px solid #ddd" }}
                  >
                    {ESTADOS.filter((e) => e !== "Todos").map((e) => (
                      <option key={e} value={e}>{ESTADO_LABELS[e]}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}