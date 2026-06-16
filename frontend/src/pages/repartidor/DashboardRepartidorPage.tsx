import { useEffect, useMemo, useState } from "react";
import type { UsuarioLogueado } from "../../App";
import * as api from "../../services/api";
import { obtenerRepartidorPorUsuario } from "../../services/repartidor";

import {
  LayoutDashboard,
  ClipboardList,
  Clock,
  LogOut,
  CalendarDays,
  CircleCheck,
  Truck,
  WalletCards,
  User,
  Phone,
  MapPin,
  Tag,
  Filter,
  ChevronRight,
  Package,
  XCircle,
} from "lucide-react";

import "../../styles/dashboard-repartidor.css";

type VistaRepartidor = "dashboard" | "pedidos" | "mapa" | "historial";

type Props = {
  usuario: UsuarioLogueado;
  cambiarVista: (vista: VistaRepartidor) => void;
  onLogout: () => void;
};

type EstadoPedidoRepartidor = "pendiente" | "en_camino" | "entregado" | "cancelado";

type PedidoRepartidor = {
  id: number;
  codigo: string;
  cliente: string;
  telefono: string;
  direccion: string;
  referencia: string;
  estado: EstadoPedidoRepartidor;
  total: number;
  metodoPago: string;
  asignado: string;
};

function normalizarEstado(estado: string): EstadoPedidoRepartidor {
  const valor = estado.toUpperCase();

  if (valor === "EN_CAMINO") return "en_camino";
  if (valor === "ENTREGADO") return "entregado";
  if (valor === "CANCELADO" || valor === "ENTREGA_FALLIDA") return "cancelado";

  return "pendiente";
}
function textoEstado(estado: EstadoPedidoRepartidor) {
  if (estado === "en_camino") return "En camino";
  if (estado === "entregado") return "Entregado";
  if (estado === "cancelado") return "Cancelado";
  return "Pendiente";
}

function formatBs(valor: number) {
  return `Bs. ${valor.toFixed(2).replace(".", ",")}`;
}

export function DashboardRepartidorPage({ usuario, cambiarVista, onLogout }: Props) {
  const [pedidos, setPedidos] = useState<PedidoRepartidor[]>([]);
  const [repartidorActualId, setRepartidorActualId] = useState<number | null>(null);
  const [pedidoSeleccionadoId, setPedidoSeleccionadoId] = useState<number | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const [filtroEstado, setFiltroEstado] = useState<"activos" | "pendiente" | "en_camino" | "entregado">("activos");
const [mostrarFiltros, setMostrarFiltros] = useState(false);

  useEffect(() => {
    cargarPedidos();
  }, []);

  async function cargarPedidos() {
    try {
      setCargando(true);
      setError("");

      const repartidor = await obtenerRepartidorPorUsuario(usuario.id);
setRepartidorActualId(repartidor.id);

const data = await api.obtenerPedidosAsignados(repartidor.id);

     const pedidosNormalizados: PedidoRepartidor[] = (data as any[]).map((pedido) => {
  const estado = normalizarEstado(String(pedido.estado || "PENDIENTE"));

  const cliente = pedido.cliente || {};

  return {
    id: Number(pedido.id),
    codigo: `#YA-${String(pedido.id).padStart(4, "0")}`,
    cliente:
      pedido.clienteNombre ||
      pedido.nombreCliente ||
      cliente.nombre ||
      "Sin cliente",

    telefono:
      pedido.clienteTelefono ||
      pedido.telefonoCliente ||
      cliente.telefono ||
      "Sin teléfono",

    direccion:
      pedido.direccionEntrega ||
      pedido.direccion ||
      cliente.direccion ||
      "Sin dirección registrada",

    referencia:
      pedido.referencia ||
      pedido.referenciaEntrega ||
      pedido.observaciones ||
      "Sin referencia registrada",

    estado,
    total: Number(pedido.total || 0),

    metodoPago:
      pedido.metodoPago ||
      pedido.formaPago ||
      pedido.pago?.metodo ||
      "Efectivo",

    asignado: pedido.createdAt
      ? new Date(pedido.createdAt).toLocaleString("es-BO", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "Sin fecha",
  };
});

      setPedidos(pedidosNormalizados);
      setPedidoSeleccionadoId(pedidosNormalizados[0]?.id ?? null);
    } catch (error) {
      console.error(error);
      setError("No se pudieron cargar los pedidos asignados.");
    } finally {
      setCargando(false);
    }
  }

  async function cambiarEstadoPedido(pedidoId: number, nuevoEstado: EstadoPedidoRepartidor) {
  try {
    setError("");

    if (nuevoEstado === "entregado") {
      const pedidoActual = pedidos.find((pedido) => pedido.id === pedidoId);

      if (!pedidoActual) {
        setError("No se encontró el pedido seleccionado.");
        return;
      }

      await api.convertirPedidoEnVenta(pedidoId, {
        metodoPago: "EFECTIVO",
        montoRecibido: pedidoActual.total,
        generarFactura: false,
      });

      setPedidos((actuales) =>
        actuales.map((pedido) =>
          pedido.id === pedidoId ? { ...pedido, estado: "entregado" } : pedido
        )
      );

      setFiltroEstado("activos");
      setPedidoSeleccionadoId(null);
      return;
    }

    const estadoApi =
      nuevoEstado === "en_camino"
        ? "EN_CAMINO"
        : nuevoEstado === "cancelado"
          ? "CANCELADO"
          : "PENDIENTE";

    await api.actualizarEstadoPedido(
  pedidoId,
  estadoApi as Parameters<typeof api.actualizarEstadoPedido>[1],
  nuevoEstado === "en_camino" && repartidorActualId !== null
    ? repartidorActualId
    : undefined
);

    setPedidos((actuales) =>
      actuales.map((pedido) =>
        pedido.id === pedidoId ? { ...pedido, estado: nuevoEstado } : pedido
      )
    );
  } catch (error) {
    console.error(error);

    if (error instanceof Error) {
      setError(error.message);
    } else {
      setError("No se pudo actualizar el estado del pedido.");
    }
  }
}

  

  const pedidosFiltrados = useMemo(() => {
  if (filtroEstado === "activos") {
    return pedidos.filter(
      (pedido) => pedido.estado === "pendiente" || pedido.estado === "en_camino"
    );
  }

  return pedidos.filter((pedido) => pedido.estado === filtroEstado);
}, [pedidos, filtroEstado]);

const pedidoSeleccionado = useMemo(() => {
  return (
    pedidosFiltrados.find((pedido) => pedido.id === pedidoSeleccionadoId) ||
    pedidosFiltrados[0] ||
    null
  );
}, [pedidosFiltrados, pedidoSeleccionadoId]);

  const pedidosAsignados = pedidos.filter(
  (pedido) => pedido.estado === "pendiente" || pedido.estado === "en_camino"
).length;

const enRuta = pedidos.filter((pedido) => pedido.estado === "en_camino").length;

const entregadosHoy = pedidos.filter((pedido) => pedido.estado === "entregado").length;

const cobrosPendientes = pedidos
  .filter((pedido) => pedido.estado === "pendiente" || pedido.estado === "en_camino")
  .reduce((total, pedido) => total + pedido.total, 0);
  if (cargando) {
    return (
      <main className="rep-layout">
        <section className="rep-loading">Cargando pedidos asignados...</section>
      </main>
    );
  }

  return (
    <main className="rep-layout">
      <aside className="rep-sidebar">
        <div className="rep-logo">
          <span>tienda</span>
          <strong>Ya!</strong>
        </div>

        <nav className="rep-menu">
          <button className="rep-menu-item activo" onClick={() => cambiarVista("dashboard")}>
            <LayoutDashboard size={21} />
            <span>Dashboard</span>
          </button>

          <button className="rep-menu-item" onClick={() => cambiarVista("pedidos")}>
            <ClipboardList size={21} />
            <span>Pedidos asignados</span>
          </button>

          

          <button className="rep-menu-item" onClick={() => cambiarVista("historial")}>
            <Clock size={21} />
            <span>Historial</span>
          </button>

        </nav>

        <div className="rep-user-card">
          <div className="rep-avatar">👨🏻</div>
          <div>
            <strong>{usuario.nombre}</strong>
            <p>Repartidor</p>
          </div>
          <button
  type="button"
  className="rep-logout-btn"
  onClick={onLogout}
>
  <LogOut size={20} />
</button>
        </div>
      </aside>

      <section className="rep-content">
        <header className="rep-header">
          <div>
            <h1>Panel de repartidor</h1>
            <p>Gestiona tus entregas del día</p>
          </div>

          <div className="rep-header-meta">
            <span>
              <CalendarDays size={18} /> 26/05/2026
            </span>
            <span>
              <Clock size={18} /> 07:22 p. m.
            </span>
            <span className="rep-online">
              <i /> Online
            </span>
          </div>
        </header>

        {error && <div className="rep-error">{error}</div>}

        <section className="rep-stats">
          <article className="rep-stat-card naranja">
            <div className="rep-stat-icon">
              <ClipboardList size={27} />
            </div>
            <strong>{pedidosAsignados}</strong>
            <p>Pedidos asignados</p>
            <button>
              Ver detalles <ChevronRight size={17} />
            </button>
          </article>

          <article className="rep-stat-card azul">
            <div className="rep-stat-icon">
              <Truck size={27} />
            </div>
            <strong>{enRuta}</strong>
            <p>En ruta</p>
            <button>
              Ver detalles <ChevronRight size={17} />
            </button>
          </article>

          <article className="rep-stat-card verde">
            <div className="rep-stat-icon">
              <CircleCheck size={27} />
            </div>
            <strong>{entregadosHoy}</strong>
            <p>Entregados hoy</p>
            <button>
              Ver detalles <ChevronRight size={17} />
            </button>
          </article>

          <article className="rep-stat-card morado">
            <div className="rep-stat-icon">
              <WalletCards size={27} />
            </div>
            <strong>{formatBs(cobrosPendientes)}</strong>
            <p>Cobros pendientes</p>
            <button>
              Ver detalles <ChevronRight size={17} />
            </button>
          </article>
        </section>

        <section className="rep-main-grid">
          <article className="rep-card rep-list-card">
            <div className="rep-card-title">
              <h2>Pedidos asignados</h2>
              <button
  className="rep-filter"
  type="button"
  onClick={() => setMostrarFiltros((actual) => !actual)}
>
  <Filter size={17} /> Filtrar
</button>
            </div>

            {mostrarFiltros && (
  <div className="rep-filtros">
    <button
      className={filtroEstado === "activos" ? "activo" : ""}
      onClick={() => setFiltroEstado("activos")}
    >
      Activos
    </button>

    <button
      className={filtroEstado === "pendiente" ? "activo" : ""}
      onClick={() => setFiltroEstado("pendiente")}
    >
      Pendientes
    </button>

    <button
      className={filtroEstado === "en_camino" ? "activo" : ""}
      onClick={() => setFiltroEstado("en_camino")}
    >
      En camino
    </button>

    <button
      className={filtroEstado === "entregado" ? "activo" : ""}
      onClick={() => setFiltroEstado("entregado")}
    >
      Entregados
    </button>
  </div>
)}

            

            <div className="rep-pedidos-list">
              {pedidosFiltrados.map((pedido) => (
                <button
                  key={pedido.id}
                  className={`rep-pedido-item ${pedido.estado} ${
                    pedidoSeleccionado?.id === pedido.id ? "seleccionado" : ""
                  }`}
                  onClick={() => setPedidoSeleccionadoId(pedido.id)}
                >
                  <div className="rep-pedido-top">
                    <strong>{pedido.codigo}</strong>
                    <span className={`rep-estado ${pedido.estado}`}>
                      {textoEstado(pedido.estado)}
                    </span>
                  </div>

                  <p>
                    <User size={15} /> {pedido.cliente}
                  </p>
                  <p>
                    <Phone size={15} /> {pedido.telefono}
                  </p>
                  <p>
                    <MapPin size={15} /> {pedido.direccion}
                  </p>
                  <p>
                    <Tag size={15} /> {pedido.referencia}
                  </p>

                  <div className="rep-pedido-bottom">
                    <strong>{formatBs(pedido.total)}</strong>
                    <span>{pedido.metodoPago}</span>
                  </div>
                </button>
              ))}

              <button className="rep-ver-todos" onClick={() => cambiarVista("pedidos")}>
                Ver todos los pedidos <ChevronRight size={18} />
              </button>
            </div>
          </article>

          <article className="rep-card rep-detail-card">
            <div className="rep-card-title">
              <h2>Detalle del pedido</h2>
              {pedidoSeleccionado && (
                <span className={`rep-estado ${pedidoSeleccionado.estado}`}>
                  {textoEstado(pedidoSeleccionado.estado)}
                </span>
              )}
            </div>

            {pedidoSeleccionado ? (
              <>
                <div className="rep-detail-head">
                  <strong>Pedido {pedidoSeleccionado.codigo}</strong>
                  <p>Asignado: {pedidoSeleccionado.asignado}</p>
                </div>

                <div className="rep-detail-row">
                  <User size={22} />
                  <div>
                    <span>Cliente</span>
                    <strong>{pedidoSeleccionado.cliente}</strong>
                  </div>
                </div>

                <div className="rep-detail-row">
                  <Phone size={22} />
                  <div>
                    <strong>{pedidoSeleccionado.telefono}</strong>
                  </div>
                </div>

                <div className="rep-detail-row">
                  <MapPin size={22} />
                  <div>
                    <span>Dirección de entrega</span>
                    <strong>{pedidoSeleccionado.direccion}</strong>
                  </div>
                </div>

                <div className="rep-detail-row">
                  <Tag size={22} />
                  <div>
                    <span>Referencia</span>
                    <strong>{pedidoSeleccionado.referencia}</strong>
                  </div>
                </div>

                <div className="rep-monto-box">
                  <span>Monto a cobrar</span>
                  <strong>{formatBs(pedidoSeleccionado.total)}</strong>
                  <p>{pedidoSeleccionado.metodoPago}</p>
                </div>

                <div className="rep-detail-actions">
                  {pedidoSeleccionado.estado === "pendiente" && (
                    <button
                      className="rep-btn naranja"
                      onClick={() => cambiarEstadoPedido(pedidoSeleccionado.id, "en_camino")}
                    >
                      Iniciar entrega
                    </button>
                  )}

                  {pedidoSeleccionado.estado !== "entregado" && (
                    <button
                      className="rep-btn verde"
                      onClick={() => cambiarEstadoPedido(pedidoSeleccionado.id, "entregado")}
                    >
                      Marcar entregado
                    </button>
                  )}

              
                </div>
              </>
           ) : (
  <p className="rep-empty">No hay pedidos para este filtro.</p>
)}
          </article>
        </section>

        <section className="rep-card rep-activity">
          <div className="rep-card-title">
            <h2>Actividad reciente</h2>
            <button onClick={() => cambiarVista("historial")}>
              Ver historial completo <ChevronRight size={18} />
            </button>
          </div>

          <div className="rep-activity-list">
  {pedidos.slice(0, 4).map((pedido) => (
    <div
      key={pedido.id}
      className={`rep-activity-item ${pedido.estado === "entregado"
        ? "verde"
        : pedido.estado === "en_camino"
          ? "azul"
          : pedido.estado === "cancelado"
            ? "rojo"
            : "naranja"
      }`}
    >
      {pedido.estado === "entregado" && <CircleCheck size={21} />}
      {pedido.estado === "en_camino" && <Truck size={21} />}
      {pedido.estado === "pendiente" && <Package size={21} />}
      {pedido.estado === "cancelado" && <XCircle size={21} />}

      <div>
        <strong>
          {pedido.estado === "entregado"
            ? "Entrega realizada"
            : pedido.estado === "en_camino"
              ? "En ruta"
              : pedido.estado === "cancelado"
                ? "Entrega cancelada"
                : "Pedido asignado"}
        </strong>
        <p>
          Pedido {pedido.codigo} · {pedido.cliente}
        </p>
      </div>

      <span>{pedido.asignado}</span>
    </div>
  ))}

  {pedidos.length === 0 && (
    <p className="rep-empty">Todavía no hay actividad registrada.</p>
  )}
</div>
        </section>
      </section>
    </main>
  );
}