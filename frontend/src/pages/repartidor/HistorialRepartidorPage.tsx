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
  XCircle,
  WalletCards,
  Package,
  User,
  Phone,
  MapPin,
  Tag,
  CreditCard,
  Filter,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

import "../../styles/dashboard-repartidor.css";

type Props = {
  usuario: UsuarioLogueado;
  cambiarVista: (vista: string) => void;
  onLogout: () => void;
};

type EstadoHistorial = "entregado" | "cancelado";

type PedidoHistorial = {
  id: number;
  codigo: string;
  cliente: string;
  telefono: string;
  direccion: string;
  referencia: string;
  estado: EstadoHistorial;
  total: number;
  metodoPago: string;
  fecha: Date | null;
  fechaTexto: string;
};

type FiltroHistorial = "todos" | "entregado" | "cancelado" | "hoy" | "semana" | "mes";
type OrdenHistorial = "recientes" | "antiguos";

function normalizarEstado(estado: string): EstadoHistorial | null {
  const valor = estado.toUpperCase();

  if (valor === "ENTREGADO") return "entregado";
  if (valor === "CANCELADO" || valor === "ENTREGA_FALLIDA") return "cancelado";

  return null;
}

function textoEstado(estado: EstadoHistorial) {
  if (estado === "cancelado") return "Cancelado";
  return "Entregado";
}

function formatBs(valor: number) {
  return `Bs. ${valor.toFixed(2).replace(".", ",")}`;
}

function formatearFecha(fecha: Date | null) {
  if (!fecha) return "Sin fecha";

  return fecha.toLocaleString("es-BO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function esMismaFecha(fechaA: Date, fechaB: Date) {
  return (
    fechaA.getFullYear() === fechaB.getFullYear() &&
    fechaA.getMonth() === fechaB.getMonth() &&
    fechaA.getDate() === fechaB.getDate()
  );
}

export function HistorialRepartidorPage({ usuario, cambiarVista, onLogout }: Props) {
  const [pedidos, setPedidos] = useState<PedidoHistorial[]>([]);
  const [pedidoSeleccionadoId, setPedidoSeleccionadoId] = useState<number | null>(null);
  const [filtro, setFiltro] = useState<FiltroHistorial>("todos");
  const [orden, setOrden] = useState<OrdenHistorial>("recientes");
  const [paginaActual, setPaginaActual] = useState(1);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const pedidosPorPagina = 8;

  useEffect(() => {
    cargarHistorial();
  }, []);

  async function cargarHistorial() {
    try {
      setCargando(true);
      setError("");

      const repartidor = await obtenerRepartidorPorUsuario(usuario.id);
      const data = await api.obtenerHistorialRepartidor(repartidor.id);

      const historialNormalizado: PedidoHistorial[] = (data as any[])
        .map((pedido) => {
          const estado = normalizarEstado(String(pedido.estado || ""));

          if (!estado) {
            return null;
          }

          const cliente = pedido.cliente || {};
          const fechaOriginal = pedido.updatedAt || pedido.createdAt || null;
          const fecha = fechaOriginal ? new Date(fechaOriginal) : null;

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
            fecha,
            fechaTexto: formatearFecha(fecha),
          };
        })
        .filter((pedido): pedido is PedidoHistorial => pedido !== null);

      setPedidos(historialNormalizado);
      setPedidoSeleccionadoId(historialNormalizado[0]?.id ?? null);
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("No se pudo cargar el historial de entregas.");
      }
    } finally {
      setCargando(false);
    }
  }

  const pedidosFiltrados = useMemo(() => {
    const hoy = new Date();

    let resultado = [...pedidos];

    if (filtro === "entregado") {
      resultado = resultado.filter((pedido) => pedido.estado === "entregado");
    }

    if (filtro === "cancelado") {
      resultado = resultado.filter((pedido) => pedido.estado === "cancelado");
    }

    if (filtro === "hoy") {
      resultado = resultado.filter((pedido) => pedido.fecha && esMismaFecha(pedido.fecha, hoy));
    }

    if (filtro === "semana") {
      const haceSieteDias = new Date();
      haceSieteDias.setDate(hoy.getDate() - 7);

      resultado = resultado.filter((pedido) => pedido.fecha && pedido.fecha >= haceSieteDias);
    }

    if (filtro === "mes") {
      resultado = resultado.filter(
        (pedido) =>
          pedido.fecha &&
          pedido.fecha.getMonth() === hoy.getMonth() &&
          pedido.fecha.getFullYear() === hoy.getFullYear()
      );
    }

    resultado.sort((a, b) => {
      const fechaA = a.fecha?.getTime() || 0;
      const fechaB = b.fecha?.getTime() || 0;

      return orden === "recientes" ? fechaB - fechaA : fechaA - fechaB;
    });

    return resultado;
  }, [pedidos, filtro, orden]);

  const totalPaginas = Math.max(1, Math.ceil(pedidosFiltrados.length / pedidosPorPagina));

  const pedidosPaginados = useMemo(() => {
    const inicio = (paginaActual - 1) * pedidosPorPagina;
    const fin = inicio + pedidosPorPagina;

    return pedidosFiltrados.slice(inicio, fin);
  }, [pedidosFiltrados, paginaActual]);

  const pedidoSeleccionado = useMemo(() => {
    return (
      pedidosFiltrados.find((pedido) => pedido.id === pedidoSeleccionadoId) ||
      pedidosFiltrados[0] ||
      null
    );
  }, [pedidosFiltrados, pedidoSeleccionadoId]);

  const entregadosHoy = pedidos.filter(
    (pedido) => pedido.estado === "entregado" && pedido.fecha && esMismaFecha(pedido.fecha, new Date())
  ).length;

  const canceladosHoy = pedidos.filter(
    (pedido) => pedido.estado === "cancelado" && pedido.fecha && esMismaFecha(pedido.fecha, new Date())
  ).length;

  const totalCobradoHoy = pedidos
    .filter(
      (pedido) =>
        pedido.estado === "entregado" &&
        pedido.fecha &&
        esMismaFecha(pedido.fecha, new Date())
    )
    .reduce((total, pedido) => total + pedido.total, 0);

  const totalEntregas = pedidos.length;

  function cambiarFiltro(nuevoFiltro: FiltroHistorial) {
    setFiltro(nuevoFiltro);
    setPaginaActual(1);
    setPedidoSeleccionadoId(null);
  }

  if (cargando) {
    return (
      <main className="rep-layout">
        <section className="rep-loading">Cargando historial...</section>
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
          <button className="rep-menu-item" onClick={() => cambiarVista("dashboard")}>
            <LayoutDashboard size={21} />
            <span>Dashboard</span>
          </button>

          <button className="rep-menu-item" onClick={() => cambiarVista("pedidos")}>
            <ClipboardList size={21} />
            <span>Pedidos asignados</span>
          </button>

          <button className="rep-menu-item activo" onClick={() => cambiarVista("historial")}>
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

          <button type="button" className="rep-logout-btn" onClick={onLogout}>
            <LogOut size={20} />
          </button>
        </div>
      </aside>

      <section className="rep-content">
        <header className="rep-header">
          <div>
            <h1>Historial de entregas</h1>
            <p>Revisa tus pedidos entregados y cancelados</p>
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
          <article className="rep-stat-card verde">
            <div className="rep-stat-icon">
              <CircleCheck size={27} />
            </div>
            <strong>{entregadosHoy}</strong>
            <p>Entregados hoy</p>
            <button onClick={() => cambiarFiltro("hoy")}>
              Ver detalles <ChevronRight size={17} />
            </button>
          </article>

          <article className="rep-stat-card morado">
            <div className="rep-stat-icon">
              <WalletCards size={27} />
            </div>
            <strong>{formatBs(totalCobradoHoy)}</strong>
            <p>Total cobrado hoy</p>
            <button onClick={() => cambiarFiltro("hoy")}>
              Ver detalles <ChevronRight size={17} />
            </button>
          </article>

          <article className="rep-stat-card rojo">
            <div className="rep-stat-icon">
              <XCircle size={27} />
            </div>
            <strong>{canceladosHoy}</strong>
            <p>Cancelados hoy</p>
            <button onClick={() => cambiarFiltro("cancelado")}>
              Ver detalles <ChevronRight size={17} />
            </button>
          </article>

          <article className="rep-stat-card azul">
            <div className="rep-stat-icon">
              <Package size={27} />
            </div>
            <strong>{totalEntregas}</strong>
            <p>Total de entregas</p>
            <button onClick={() => cambiarFiltro("todos")}>
              Ver detalles <ChevronRight size={17} />
            </button>
          </article>
        </section>

        <section className="rep-main-grid rep-historial-grid">
          <article className="rep-card rep-list-card">
            <div className="rep-card-title">
              <h2>Lista de historial</h2>

              <button className="rep-filter" type="button">
                <Filter size={17} /> Filtrar
              </button>
            </div>

            <div className="rep-historial-toolbar">
              <div className="rep-filtros rep-filtros-historial">
                <button
                  className={filtro === "todos" ? "activo" : ""}
                  onClick={() => cambiarFiltro("todos")}
                >
                  Todos
                </button>

                <button
                  className={filtro === "entregado" ? "activo" : ""}
                  onClick={() => cambiarFiltro("entregado")}
                >
                  Entregados
                </button>

                <button
                  className={filtro === "cancelado" ? "activo" : ""}
                  onClick={() => cambiarFiltro("cancelado")}
                >
                  Cancelados
                </button>

                <button
                  className={filtro === "hoy" ? "activo" : ""}
                  onClick={() => cambiarFiltro("hoy")}
                >
                  Hoy
                </button>

                <button
                  className={filtro === "semana" ? "activo" : ""}
                  onClick={() => cambiarFiltro("semana")}
                >
                  Esta semana
                </button>

                <button
                  className={filtro === "mes" ? "activo" : ""}
                  onClick={() => cambiarFiltro("mes")}
                >
                  Este mes
                </button>
              </div>

              <select
                className="rep-orden-select"
                value={orden}
                onChange={(evento) => setOrden(evento.target.value as OrdenHistorial)}
              >
                <option value="recientes">Ordenar por: Más recientes</option>
                <option value="antiguos">Ordenar por: Más antiguos</option>
              </select>
            </div>

            <div className="rep-historial-table">
              <div className="rep-historial-row rep-historial-head">
                <span>Pedido</span>
                <span>Cliente</span>
                <span>Estado</span>
                <span>Monto</span>
                <span>Fecha de entrega</span>
                <span></span>
              </div>

              {pedidosPaginados.map((pedido) => (
                <button
                  key={pedido.id}
                  className={`rep-historial-row ${
                    pedidoSeleccionado?.id === pedido.id ? "seleccionado" : ""
                  }`}
                  onClick={() => setPedidoSeleccionadoId(pedido.id)}
                >
                  <strong>{pedido.codigo}</strong>
                  <span>{pedido.cliente}</span>
                  <span className={`rep-estado ${pedido.estado}`}>
                    {textoEstado(pedido.estado)}
                  </span>
                  <strong>{formatBs(pedido.total)}</strong>
                  <span>{pedido.fechaTexto}</span>
                  <ChevronRight size={18} />
                </button>
              ))}

              {pedidosPaginados.length === 0 && (
                <p className="rep-empty">No hay registros para este filtro.</p>
              )}
            </div>

            <div className="rep-paginacion">
              <button
                type="button"
                disabled={paginaActual === 1}
                onClick={() => setPaginaActual((actual) => Math.max(1, actual - 1))}
              >
                <ChevronLeft size={18} />
              </button>

              {Array.from({ length: totalPaginas }, (_, index) => index + 1).map((pagina) => (
                <button
                  key={pagina}
                  type="button"
                  className={paginaActual === pagina ? "activo" : ""}
                  onClick={() => setPaginaActual(pagina)}
                >
                  {pagina}
                </button>
              ))}

              <button
                type="button"
                disabled={paginaActual === totalPaginas}
                onClick={() =>
                  setPaginaActual((actual) => Math.min(totalPaginas, actual + 1))
                }
              >
                <ChevronRight size={18} />
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
                  <p>Entregado: {pedidoSeleccionado.fechaTexto}</p>
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
                    <span>Teléfono</span>
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

                <div className="rep-detail-row">
                  <CreditCard size={22} />
                  <div>
                    <span>Método de pago</span>
                    <strong>{pedidoSeleccionado.metodoPago}</strong>
                  </div>
                </div>

                <div className="rep-monto-box">
                  <span>Monto cobrado</span>
                  <strong>{formatBs(pedidoSeleccionado.total)}</strong>
                  <p>{pedidoSeleccionado.metodoPago}</p>
                </div>
              </>
            ) : (
              <p className="rep-empty">Selecciona un pedido para ver el detalle.</p>
            )}
          </article>
        </section>
      </section>
    </main>
  );
}