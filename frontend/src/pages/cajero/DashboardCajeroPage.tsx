import { useEffect, useState } from "react";
import type { VistaCajero } from "../../types/navigation";
import type { UsuarioLogueado } from "../../App";
import "../../styles/dashboard-cajero.css";
import {
  LayoutDashboard,
  ShoppingCart,
  ClipboardList,
  Search,
  PackageCheck,
  Users,
  WalletCards,
  BarChart3,
  CalendarDays,
  Clock,
  Wifi,
  DollarSign,
  ShoppingBag,
  CreditCard,
  Truck,
  AlertTriangle,
  ChevronRight,
  LogOut,
} from "lucide-react";

import {
  obtenerDashboardCajero,
  type CajeroDashboardResponse,
  type DashboardPedido,
  type DashboardAlerta,
  type EstadoPedido,
} from "../../services/api";

type Props = {
  usuario: UsuarioLogueado;
  onNavigate: (vista: VistaCajero) => void;
  onLogout: () => void;
};
``
function formatearBolivianos(valor: number) {
  return `Bs. ${Number(valor).toLocaleString("es-BO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatearHora(fechaHora: string) {
  if (!fechaHora) return "-";

  const fecha = new Date(fechaHora);

  return fecha.toLocaleTimeString("es-BO", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function obtenerFechaActual() {
  return new Date().toLocaleDateString("es-BO");
}

function obtenerHoraActual() {
  return new Date().toLocaleTimeString("es-BO", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatearEstadoPedido(estado: EstadoPedido) {
  const estados: Record<EstadoPedido, string> = {
    PENDIENTE: "Pendiente",
    EN_PREPARACION: "En preparación",
    LISTO_PARA_ENTREGAR: "Listo para entregar",
    EN_CAMINO: "En camino",
    ENTREGADO: "Entregado",
    CANCELADO: "Cancelado",
    ENTREGA_FALLIDA: "Entrega fallida",
  };

  return estados[estado];
}

function obtenerColorEstado(estado: EstadoPedido) {
  if (estado === "PENDIENTE") return "amarillo";
  if (estado === "EN_PREPARACION") return "azul";
  if (estado === "LISTO_PARA_ENTREGAR") return "verde";
  if (estado === "EN_CAMINO") return "naranja";
  if (estado === "ENTREGADO") return "verde";
  if (estado === "CANCELADO") return "rojo";

  return "rojo";
}

function formatearMetodoPago(metodoPago: string) {
  if (!metodoPago || metodoPago === "Pendiente") return "Pendiente";

  const metodos: Record<string, string> = {
    EFECTIVO: "Efectivo",
    QR: "QR",
    TRANSFERENCIA: "Transferencia",
  };

  return metodos[metodoPago] || metodoPago;
}

function obtenerColorAlerta(alerta: DashboardAlerta) {
  if (alerta.tipo === "SIN_STOCK") return "rojo";
  if (alerta.tipo === "STOCK_BAJO") return "naranja";
  if (alerta.tipo === "POR_VENCER") return "amarillo";

  return "naranja";
}

function formatearTipoAlerta(tipo: string) {
  const tipos: Record<string, string> = {
    SIN_STOCK: "Sin stock",
    STOCK_BAJO: "Stock bajo",
    POR_VENCER: "Por vencer",
  };

  return tipos[tipo] || tipo;
}
export function DashboardCajeroPage({ usuario, onNavigate, onLogout }: Props) {
  const [dashboard, setDashboard] = useState<CajeroDashboardResponse | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargarDashboard() {
      try {
        setCargando(true);
        setError("");

        const datos = await obtenerDashboardCajero();
        setDashboard(datos);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Error inesperado al cargar dashboard");
        }
      } finally {
        setCargando(false);
      }
    }

    cargarDashboard();
  }, []);

  if (cargando) {
    return (
      <main className="cajero-dashboard">
        <section className="cajero-content">
          <h1>Cargando dashboard...</h1>
        </section>
      </main>
    );
  }

  if (error || dashboard === null) {
    return (
      <main className="cajero-dashboard">
        <section className="cajero-content">
          <h1>No se pudo cargar el dashboard</h1>
          <p>{error}</p>
        </section>
      </main>
    );
  }

  const resumen = dashboard.resumen;
  const pedidosPendientes = dashboard.pedidosPendientes;
  const alertas = dashboard.alertas;
  const estadoSistema = dashboard.estadoSistema;

  return (
    <main className="cajero-dashboard">
      <aside className="cajero-sidebar">
        <div className="cajero-logo">
          <span className="logo-text-small">tienda</span>
          <span className="logo-text-main">Ya!</span>
        </div>

        <nav className="cajero-menu">
          <button className="menu-item active" onClick={() => onNavigate("dashboard")}>
            <LayoutDashboard size={22} />
            <span>Dashboard</span>
          </button>

          <button className="menu-item" onClick={() => onNavigate("nueva-venta")}>
            <ShoppingCart size={22} />
            <span>Nueva Venta</span>
          </button>

          <button className="menu-item" onClick={() => onNavigate("registrar-pedido")}>
  <ClipboardList size={22} />
  <span>Registrar Pedido</span>
</button>

          <button className="menu-item" onClick={() => onNavigate("buscar-producto")}>
            <Search size={22} />
            <span>Buscar Producto</span>
          </button>

          <button className="menu-item" onClick={() => onNavigate("pedidos-pendientes")}>
  <PackageCheck size={22} />
  <span>Pedidos Pendientes</span>
</button>

        <button className="menu-item" onClick={() => onNavigate("clientes")}>
  <Users size={22} />
  <span>Clientes</span>
</button>

<button className="menu-item" onClick={() => onNavigate("cierre-caja")}>
  <WalletCards size={22} />
  <span>Cierre de Caja</span>
</button>

<button className="menu-item" onClick={() => onNavigate("reportes")}>
  <BarChart3 size={22} />
  <span>Reportes</span>
</button>
        </nav>

        <div className="sidebar-user">
          <div className="sidebar-user-icon">
            <Users size={22} />
          </div>
          <div>
            <strong>{usuario.nombre}</strong>
            <p>Turno: Mañana</p>
          </div>
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
        <header className="dashboard-header">
          <div>
            <h1>¡Bienvenido, {usuario.nombre}! 👋</h1>
            <p>Aquí tienes un resumen de tu jornada de trabajo.</p>
          </div>

          <div className="header-status">
            <div className="header-info">
              <CalendarDays size={20} />
              <span>{obtenerFechaActual()}</span>
            </div>

            <div className="header-info">
              <Clock size={20} />
              <span>{obtenerHoraActual()}</span>
            </div>

            <div className="online-badge">
              <span></span>
              {estadoSistema.online ? "Online" : "Offline"}
            </div>
          </div>
        </header>

        <section className="quick-actions">
          <button className="quick-card venta" onClick={() => onNavigate("nueva-venta")}>
            <ShoppingCart size={48} />
            <div>
              <h2>Nueva venta</h2>
              <p>Iniciar una venta rápida</p>
            </div>
          </button>

          <button className="quick-card delivery" onClick={() => onNavigate("registrar-pedido")}>
            <ShoppingBag size={46} />
            <div>
              <h2>Pedido delivery</h2>
              <p>Registrar pedido por teléfono o delivery</p>
            </div>
          </button>

          <button className="quick-card buscar" onClick={() => onNavigate("buscar-producto")}>
            <Search size={50} />
            <div>
              <h2>Buscar producto</h2>
              <p>Consultar precio y stock</p>
            </div>
          </button>

          <button className="quick-card caja" onClick={() => onNavigate("cierre-caja")}>
            <WalletCards size={48} />
            <div>
              <h2>Cierre de caja</h2>
              <p>Finalizar turno y cerrar caja diaria</p>
            </div>
          </button>
        </section>

        <section className="dashboard-grid">
          <div className="panel resumen-panel">
            <h2>Resumen del día</h2>

            <div className="resumen-cards">
              <div className="resumen-card">
                <div className="resumen-icon verde">
                  <DollarSign size={28} />
                </div>
                <p>Ventas de hoy</p>
                <h3>{formatearBolivianos(resumen.ventasDelDia)}</h3>
                <small>Registradas hoy</small>
              </div>

              <div className="resumen-card">
                <div className="resumen-icon naranja">
                  <ShoppingBag size={28} />
                </div>
                <p>Pedidos activos</p>
                <h3>{resumen.pedidosActivos}</h3>
                <small>Pendientes o en proceso</small>
              </div>

              <div className="resumen-card">
                <div className="resumen-icon morado">
                  <DollarSign size={28} />
                </div>
                <p>Efectivo</p>
                <h3>{formatearBolivianos(resumen.totalEfectivo)}</h3>
                <small>Total confirmado</small>
              </div>

              <div className="resumen-card">
                <div className="resumen-icon azul">
                  <CreditCard size={28} />
                </div>
                <p>QR / Transferencias</p>
                <h3>{formatearBolivianos(resumen.totalQrTransferencia)}</h3>
                <small>Total confirmado</small>
              </div>
            </div>
          </div>

          <div className="panel estado-panel">
            <h2>Estado del sistema</h2>

            <div className="estado-item">
              <div className="estado-icon verde">
                <Wifi size={26} />
              </div>
              <div>
                <strong>Conexión</strong>
                <p className={estadoSistema.online ? "texto-verde" : ""}>
                  {estadoSistema.online ? "Online" : "Offline"}
                </p>
                <small>
                  {estadoSistema.sincronizado
                    ? "Sincronizado"
                    : "Pendiente de sincronización"}
                </small>
              </div>
            </div>

            <div className="estado-item">
              <div className="estado-icon amarillo">
                <Truck size={26} />
              </div>
              <div>
                <strong>Sincronización</strong>
                <p>
                  {estadoSistema.datosPendientes === 0
                    ? "Todo al día"
                    : `${estadoSistema.datosPendientes} datos pendientes`}
                </p>
                <small>
                  {estadoSistema.datosPendientes === 0
                    ? "No hay datos pendientes"
                    : "Se sincronizarán al recuperar conexión"}
                </small>
              </div>
            </div>
          </div>

          <div className="panel pedidos-panel">
            <h2>Pedidos pendientes</h2>

            {pedidosPendientes.length === 0 ? (
              <p className="empty-text">No hay pedidos pendientes.</p>
            ) : (
              pedidosPendientes.map((pedido: DashboardPedido) => {
                const color = obtenerColorEstado(pedido.estado);

                return (
                  <article className="pedido-item" key={pedido.id}>
                    <div className={`pedido-icon ${color}`}>
                      <ShoppingBag size={24} />
                    </div>

                    <div className="pedido-info">
                      <strong>Pedido #{pedido.id}</strong>
                      <p>
                        {pedido.clienteNombre} · {pedido.telefono}
                      </p>
                    </div>

                    <div className="pedido-estado">
                      <span className={`estado-tag ${color}`}>
                        {formatearEstadoPedido(pedido.estado)}
                      </span>
                      <p>Entrega: {formatearHora(pedido.fechaHora)}</p>
                    </div>

                    <div className="pedido-total">
                      <strong>{formatearBolivianos(pedido.total)}</strong>
                      <p>{formatearMetodoPago(pedido.metodoPago)}</p>
                    </div>

                    <button className="btn-detalle" onClick={() => onNavigate("pedidos-pendientes")}>
  Ver detalle
</button>
                  </article>
                );
              })
            )}

            <button className="ver-todo" onClick={() => onNavigate("pedidos-pendientes")}>
  Ver todos los pedidos <ChevronRight size={18} />
</button>
          </div>

          <div className="panel alertas-panel">
            <h2>Alertas importantes</h2>

            {alertas.length === 0 ? (
              <p className="empty-text">No hay alertas importantes.</p>
            ) : (
              alertas.map((alerta: DashboardAlerta) => {
                const color = obtenerColorAlerta(alerta);

                return (
                  <article className="alerta-item" key={`${alerta.tipo}-${alerta.productoNombre}`}>
                    <div className={`alerta-icon ${alerta.imageUrl ? "con-imagen" : color}`}>
                      {alerta.imageUrl ? (
                        <img src={alerta.imageUrl} alt={alerta.productoNombre} />
                      ) : (
                        <AlertTriangle size={22} />
                      )}
                    </div>

                    <div>
                      <span>{formatearTipoAlerta(alerta.tipo)}</span>
                      <strong>{alerta.productoNombre}</strong>
                      <p>{alerta.detalle}</p>
                    </div>

                    <ChevronRight size={18} />
                  </article>
                );
              })
            )}

            <button className="ver-todo">
              Ver todas las alertas <ChevronRight size={18} />
            </button>
          </div>
        </section>

        <footer className="offline-banner">
          <div>
            <strong>Modo offline disponible</strong>
            <p>
              El sistema seguirá funcionando aunque pierdas conexión. Los datos
              se sincronizarán automáticamente.
            </p>
          </div>

          <button>Ver configuración</button>
        </footer>
      </section>
    </main>
  );
}