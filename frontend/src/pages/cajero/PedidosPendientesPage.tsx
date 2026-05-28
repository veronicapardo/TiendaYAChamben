import { useEffect, useMemo, useState } from "react";
import "../../styles/dashboard-cajero.css";
import "../../styles/nueva-venta.css";
import "../../styles/pedidos-pendientes.css";

import type { UsuarioLogueado } from "../../App";
import type { VistaCajero } from "../../types/navigation";
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
  CalendarDays,
  Clock,
  Plus,
  Eye,
  X,
  Phone,
  MapPin,
  Truck,
  Store,
} from "lucide-react";

import {
  obtenerPedidos,
  cancelarPedido,
  convertirPedidoEnVenta,
  obtenerFacturaPorVenta,
  type PedidoApi,
  type ConvertirPedidoVentaDto,
  type FacturaResponse,
} from "../../services/api";

type Props = {
  usuario: UsuarioLogueado;
  onNavigate: (vista: VistaCajero) => void;
  onLogout: () => void;
};

type FiltroEstado = "TODOS" | "PENDIENTE" | "EN_PROCESO" | "ENTREGADO" | "CANCELADO";

function formatearBolivianos(valor: number) {
  return `Bs. ${Number(valor || 0).toLocaleString("es-BO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
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

function obtenerFechaPedido(pedido: PedidoApi) {
  const fecha = pedido.fechaPedido || pedido.createdAt;

  if (!fecha) {
    return "Sin fecha";
  }

  return new Date(fecha).toLocaleString("es-BO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function obtenerCliente(pedido: PedidoApi) {
  return pedido.clienteNombre || "Cliente sin nombre";
}

function obtenerTelefono(pedido: PedidoApi) {
  return pedido.clienteTelefono || "Sin teléfono";
}

function obtenerTipoEntrega(pedido: PedidoApi) {
  if (pedido.direccionEntrega?.toLowerCase().includes("recoger")) {
    return "Recoger en tienda";
  }

  return "Delivery";
}

export function PedidosPendientesPage({ usuario, onNavigate, onLogout }: Props) {
  const [pedidos, setPedidos] = useState<PedidoApi[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<FiltroEstado>("TODOS");
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<PedidoApi | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [pedidoPago, setPedidoPago] = useState<PedidoApi | null>(null);
const [metodoPago, setMetodoPago] = useState<"EFECTIVO" | "QR_TRANSFERENCIA" | "MIXTO">("EFECTIVO");
const [montoRecibido, setMontoRecibido] = useState("");
const [montoEfectivoMixto, setMontoEfectivoMixto] = useState("");
const [montoDigitalMixto, setMontoDigitalMixto] = useState("");
const [referenciaPago, setReferenciaPago] = useState("");
const [tipoComprobante, setTipoComprobante] = useState<"TICKET" | "FACTURA">("TICKET");
const [nitCi, setNitCi] = useState("");
const [razonSocial, setRazonSocial] = useState("");
const [facturaGenerada, setFacturaGenerada] = useState<FacturaResponse | null>(null);
const [mostrandoFactura, setMostrandoFactura] = useState(false);

  async function cargarPedidos() {
    try {
      setCargando(true);
      setError("");

      const datos = await obtenerPedidos();
      setPedidos(datos);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Error inesperado al cargar pedidos");
      }
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarPedidos();
  }, []);

  const conteos = useMemo(() => {
    return {
      todos: pedidos.length,
      pendientes: pedidos.filter((pedido) => pedido.estado === "PENDIENTE").length,
      enProceso: pedidos.filter((pedido) => pedido.estado === "EN_PROCESO").length,
      entregados: pedidos.filter((pedido) => pedido.estado === "ENTREGADO").length,
      cancelados: pedidos.filter((pedido) => pedido.estado === "CANCELADO").length,
    };
  }, [pedidos]);

  const pedidosFiltrados = pedidos.filter((pedido) => {
    const q = busqueda.toLowerCase().trim();

    const coincideBusqueda =
      !q ||
      pedido.id.toString().includes(q) ||
      obtenerCliente(pedido).toLowerCase().includes(q) ||
      obtenerTelefono(pedido).toLowerCase().includes(q) ||
      pedido.direccionEntrega?.toLowerCase().includes(q);

    const coincideEstado =
      filtroEstado === "TODOS" || pedido.estado === filtroEstado;

    return coincideBusqueda && coincideEstado;
  });

  function claseEstado(estado: PedidoApi["estado"]) {
    if (estado === "PENDIENTE") return "estado-pendiente";
    if (estado === "EN_PROCESO") return "estado-proceso";
    if (estado === "ENTREGADO") return "estado-entregado";
    return "estado-cancelado";
  }

  function convertirEnVenta(pedido: PedidoApi) {
  setPedidoPago(pedido);
  setMetodoPago("EFECTIVO");
  setMontoRecibido("");
  setMontoEfectivoMixto("");
  setMontoDigitalMixto("");
  setReferenciaPago("");
  setTipoComprobante("TICKET");
  setNitCi("");
  setRazonSocial("");
  setMensaje("");
}

async function confirmarConversionVenta() {
  if (!pedidoPago) return;

  const total = Number(pedidoPago.total || 0);
  const montoRecibidoNumero = Number(montoRecibido || 0);
  const montoEfectivoNumero = Number(montoEfectivoMixto || 0);
  const montoDigitalNumero = Number(montoDigitalMixto || 0);

  if (metodoPago === "EFECTIVO" && montoRecibidoNumero < total) {
    setMensaje("El monto recibido no cubre el total del pedido.");
    return;
  }

  if (metodoPago === "QR_TRANSFERENCIA" && referenciaPago.trim() === "") {
    setMensaje("Ingresa la referencia o código de operación.");
    return;
  }

  if (metodoPago === "MIXTO" && montoEfectivoNumero + montoDigitalNumero < total) {
    setMensaje("El pago mixto no cubre el total del pedido.");
    return;
  }

  if (tipoComprobante === "FACTURA") {
    if (nitCi.trim() === "") {
      setMensaje("Ingresa el NIT/CI para generar factura.");
      return;
    }

    if (razonSocial.trim() === "") {
      setMensaje("Ingresa la razón social para generar factura.");
      return;
    }
  }

  const metodoPagoBackend =
    metodoPago === "QR_TRANSFERENCIA" ? "QR" : metodoPago;

  const data: ConvertirPedidoVentaDto = {
    metodoPago: metodoPagoBackend,
    montoRecibido:
      metodoPago === "EFECTIVO" ? montoRecibidoNumero : undefined,
    montoEfectivo:
      metodoPago === "MIXTO" ? montoEfectivoNumero : undefined,
    montoDigital:
      metodoPago === "MIXTO" ? montoDigitalNumero : undefined,
    referenciaPago:
      metodoPago === "QR_TRANSFERENCIA" ? referenciaPago.trim() : undefined,
    generarFactura: tipoComprobante === "FACTURA",
    nitCi: tipoComprobante === "FACTURA" ? nitCi.trim() : undefined,
    razonSocial: tipoComprobante === "FACTURA" ? razonSocial.trim() : undefined,
  };

  try {
    const ventaCreada = await convertirPedidoEnVenta(pedidoPago.id, data);

if (tipoComprobante === "FACTURA") {
  const factura = await obtenerFacturaPorVenta(ventaCreada.id);

  setFacturaGenerada(factura);
  setMostrandoFactura(true);
  setMensaje("");
} else {
  setMensaje(`Pedido #${pedidoPago.id} convertido en venta correctamente.`);
}

setPedidoPago(null);

await cargarPedidos();
  } catch (error) {
    if (error instanceof Error) {
      setMensaje(error.message);
    } else {
      setMensaje("Error inesperado al convertir el pedido en venta.");
    }
  }
}

  async function cancelarPedidoPendiente(pedido: PedidoApi) {
  const confirmar = window.confirm(
    `¿Seguro que deseas cancelar el pedido #${pedido.id}? Se restaurará el stock reservado.`
  );

  if (!confirmar) {
    return;
  }

  try {
    await cancelarPedido(pedido.id);

    setMensaje(`Pedido #${pedido.id} cancelado correctamente.`);

    await cargarPedidos();
  } catch (error) {
    if (error instanceof Error) {
      setMensaje(error.message);
    } else {
      setMensaje("Error inesperado al cancelar el pedido.");
    }
  }
}

  return (
    <main className="cajero-dashboard">
      <aside className="cajero-sidebar">
        <div className="cajero-logo">
          <span className="logo-text-small">tienda</span>
          <span className="logo-text-main">Ya!</span>
        </div>

        <nav className="cajero-menu">
          <button className="menu-item" onClick={() => onNavigate("dashboard")}>
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

          <button className="menu-item active" onClick={() => onNavigate("pedidos-pendientes")}>
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
            <h1>
              Pedidos pendientes <PackageCheck size={28} />
            </h1>
            <p>Consulta y gestiona los pedidos pendientes de pago o entrega.</p>
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

            <div className="online-pill">
              <span></span>
              Online
            </div>
          </div>
        </header>

        <section className="pedidos-toolbar">
          <div className="pedidos-filtros">
            <button
              className={filtroEstado === "TODOS" ? "active" : ""}
              onClick={() => setFiltroEstado("TODOS")}
            >
              Todos <span>{conteos.todos}</span>
            </button>

            <button
              className={filtroEstado === "PENDIENTE" ? "active" : ""}
              onClick={() => setFiltroEstado("PENDIENTE")}
            >
              Pendientes <span>{conteos.pendientes}</span>
            </button>

            <button
              className={filtroEstado === "EN_PROCESO" ? "active" : ""}
              onClick={() => setFiltroEstado("EN_PROCESO")}
            >
              En proceso <span>{conteos.enProceso}</span>
            </button>

            <button
              className={filtroEstado === "ENTREGADO" ? "active" : ""}
              onClick={() => setFiltroEstado("ENTREGADO")}
            >
              Entregados <span>{conteos.entregados}</span>
            </button>

            <button
              className={filtroEstado === "CANCELADO" ? "active" : ""}
              onClick={() => setFiltroEstado("CANCELADO")}
            >
              Cancelados <span>{conteos.cancelados}</span>
            </button>
          </div>

          <div className="pedidos-actions">
            <div className="pedidos-search">
              <Search size={20} />
              <input
                value={busqueda}
                onChange={(evento) => setBusqueda(evento.target.value)}
                placeholder="Buscar por cliente, pedido o teléfono..."
              />
            </div>

            <button className="btn-nuevo-pedido" onClick={() => onNavigate("registrar-pedido")}>
              <Plus size={20} />
              Nuevo pedido
            </button>
          </div>
        </section>

        {mensaje && (
          <div className="mensaje-pedidos">
            {mensaje}
            <button onClick={() => setMensaje("")}>
              <X size={18} />
            </button>
          </div>
        )}

        <section className="pedidos-lista-panel">
          {cargando && <p className="pedidos-empty">Cargando pedidos...</p>}

          {error && <p className="pedidos-error">{error}</p>}

          {!cargando && !error && pedidosFiltrados.length === 0 && (
            <p className="pedidos-empty">No hay pedidos para mostrar.</p>
          )}

          {pedidosFiltrados.map((pedido) => (
            <article className="pedido-card-grande" key={pedido.id}>
              <div className="pedido-card-icon">
                <PackageCheck size={24} />
              </div>

              <div className="pedido-card-cliente">
                <h3>Pedido #{pedido.id}</h3>
                <strong>{obtenerCliente(pedido)}</strong>

                <p>
                  <Phone size={15} />
                  {obtenerTelefono(pedido)}
                </p>

                <p>
                  <MapPin size={15} />
                  {pedido.direccionEntrega}
                </p>
              </div>

              <div className="pedido-card-estado">
                <span className={`estado-pill ${claseEstado(pedido.estado)}`}>
                  {pedido.estado}
                </span>

                <p>
                  <Clock size={15} />
                  {obtenerFechaPedido(pedido)}
                </p>

                <p>
                  {obtenerTipoEntrega(pedido) === "Delivery" ? (
                    <Truck size={15} />
                  ) : (
                    <Store size={15} />
                  )}
                  {obtenerTipoEntrega(pedido)}
                </p>
              </div>

              <div className="pedido-card-productos">
                <h4>Productos ({pedido.detalles?.length || 0})</h4>

                {pedido.detalles && pedido.detalles.length > 0 ? (
                  pedido.detalles.slice(0, 3).map((detalle) => (
                    <p key={detalle.id}>
                      • {detalle.productoNombre || `Producto #${detalle.productoId}`}{" "}
                      <strong>x{detalle.cantidad}</strong>
                    </p>
                  ))
                ) : (
                  <p>Sin detalle de productos</p>
                )}
              </div>

              <div className="pedido-card-total">
                <span>Total</span>
                <strong>{formatearBolivianos(pedido.total)}</strong>
              </div>

              <div className="pedido-card-botones">
                <button
                  className="btn-ver-detalle"
                  onClick={() => setPedidoSeleccionado(pedido)}
                >
                  <Eye size={18} />
                  Ver detalle
                </button>

                {pedido.estado !== "CANCELADO" && pedido.estado !== "ENTREGADO" && (
                  <>
                    <button
                      className="btn-convertir"
                      onClick={() => convertirEnVenta(pedido)}
                    >
                      <ShoppingCart size={18} />
                      Convertir en venta
                    </button>

                    <button
                      className="btn-cancelar-pedido"
                      onClick={() => cancelarPedidoPendiente(pedido)}
                    >
                      <X size={18} />
                      Cancelar pedido
                    </button>
                  </>
                )}
              </div>
            </article>
          ))}
        </section>

        {mostrandoFactura && facturaGenerada && (
  <div className="factura-modal-fondo">
    <div className="factura-modal">
      <div className="factura-modal-header">
        <div>
          <h2>Factura generada</h2>
          <p>Comprobante interno de Tienda Ya</p>
        </div>

        <button
          type="button"
          onClick={() => setMostrandoFactura(false)}
        >
          <X size={22} />
        </button>
      </div>

      <div className="factura-box">
        <div className="factura-logo">
          <span className="factura-logo-small">tienda</span>
          <span className="factura-logo-main">Ya!</span>
        </div>

        <div className="factura-info-grid">
          <div>
            <span>N° Factura</span>
            <strong>{facturaGenerada.id}</strong>
          </div>

          <div>
            <span>Venta</span>
            <strong>#{facturaGenerada.ventaId}</strong>
          </div>

          <div>
            <span>Fecha</span>
            <strong>
              {new Date(facturaGenerada.fechaEmision).toLocaleString("es-BO")}
            </strong>
          </div>

          <div>
            <span>Estado</span>
            <strong>{facturaGenerada.estadoFactura}</strong>
          </div>
        </div>

        <div className="factura-cliente">
          <h3>Datos de facturación</h3>

          <p>
            <span>NIT / CI:</span>
            <strong>{facturaGenerada.nitCi}</strong>
          </p>

          <p>
            <span>Razón social:</span>
            <strong>{facturaGenerada.razonSocial}</strong>
          </p>

          <p>
            <span>Método de pago:</span>
            <strong>{facturaGenerada.metodoPago}</strong>
          </p>
        </div>

        <div className="factura-total">
          <span>Total facturado</span>
          <strong>{formatearBolivianos(facturaGenerada.total)}</strong>
        </div>

        <p className="factura-nota">
          Esta factura es un comprobante interno generado para fines académicos del sistema Tienda Ya.
        </p>
      </div>

      <div className="factura-modal-actions">
        <button
          type="button"
          className="btn-factura-secundario"
          onClick={() => window.print()}
        >
          Imprimir
        </button>

        <button
          type="button"
          className="btn-factura-principal"
          onClick={() => {
            setMostrandoFactura(false);
            setFacturaGenerada(null);
          }}
        >
          Cerrar
        </button>
      </div>
    </div>
  </div>
)}

                {pedidoPago && (
          <div className="pedido-modal-fondo">
            <div className="pedido-modal pago-conversion-modal">
              <div className="pedido-modal-header">
                <div>
                  <h2>Convertir pedido en venta</h2>
                  <p>
                    Pedido #{pedidoPago.id} · {obtenerCliente(pedidoPago)}
                  </p>
                </div>

                <button onClick={() => setPedidoPago(null)}>
                  <X size={22} />
                </button>
              </div>

              <div className="conversion-resumen">
                <div>
                  <span>Total del pedido</span>
                  <strong>{formatearBolivianos(pedidoPago.total)}</strong>
                </div>

                <div>
                  <span>Cliente</span>
                  <strong>{obtenerCliente(pedidoPago)}</strong>
                </div>

                <div>
                  <span>Teléfono</span>
                  <strong>{obtenerTelefono(pedidoPago)}</strong>
                </div>

                <div>
                  <span>Entrega</span>
                  <strong>{obtenerTipoEntrega(pedidoPago)}</strong>
                </div>
              </div>

              <h3>Método de pago</h3>

              <div className="conversion-metodos">
                <button
                  type="button"
                  className={metodoPago === "EFECTIVO" ? "active" : ""}
                  onClick={() => {
                    setMetodoPago("EFECTIVO");
                    setMensaje("");
                  }}
                >
                  Efectivo
                </button>

                <button
                  type="button"
                  className={metodoPago === "QR_TRANSFERENCIA" ? "active" : ""}
                  onClick={() => {
                    setMetodoPago("QR_TRANSFERENCIA");
                    setMensaje("");
                  }}
                >
                  QR / Transferencia
                </button>

                <button
                  type="button"
                  className={metodoPago === "MIXTO" ? "active" : ""}
                  onClick={() => {
                    setMetodoPago("MIXTO");
                    setMensaje("");
                  }}
                >
                  Mixto
                </button>
              </div>

              {metodoPago === "EFECTIVO" && (
                <div className="conversion-box">
                  <label>Monto recibido</label>
                  <div className="conversion-input-bs">
                    <span>Bs.</span>
                    <input
                      value={montoRecibido}
                      onChange={(evento) => {
                        setMontoRecibido(evento.target.value);
                        setMensaje("");
                      }}
                      placeholder="0,00"
                    />
                  </div>

                  <div className="conversion-cambio">
                    <span>Cambio</span>
                    <strong>
                      {formatearBolivianos(
                        Math.max(Number(montoRecibido || 0) - Number(pedidoPago.total || 0), 0)
                      )}
                    </strong>
                  </div>
                </div>
              )}

              {metodoPago === "QR_TRANSFERENCIA" && (
                <div className="conversion-box">
                  <p>
                    Monto a pagar:{" "}
                    <strong>{formatearBolivianos(pedidoPago.total)}</strong>
                  </p>

                  <div className="conversion-qr">QR</div>

                  <label>Referencia / código de operación</label>
                  <input
                    value={referenciaPago}
                    onChange={(evento) => {
                      setReferenciaPago(evento.target.value);
                      setMensaje("");
                    }}
                    placeholder="Ej: 000123456"
                  />
                </div>
              )}

              {metodoPago === "MIXTO" && (
                <div className="conversion-box">
                  <p>
                    Total a pagar:{" "}
                    <strong>{formatearBolivianos(pedidoPago.total)}</strong>
                  </p>

                  <label>Monto en efectivo</label>
                  <div className="conversion-input-bs">
                    <span>Bs.</span>
                    <input
                      value={montoEfectivoMixto}
                      onChange={(evento) => {
                        setMontoEfectivoMixto(evento.target.value);
                        setMensaje("");
                      }}
                      placeholder="0,00"
                    />
                  </div>

                  <label>Monto por QR / transferencia</label>
                  <div className="conversion-input-bs">
                    <span>Bs.</span>
                    <input
                      value={montoDigitalMixto}
                      onChange={(evento) => {
                        setMontoDigitalMixto(evento.target.value);
                        setMensaje("");
                      }}
                      placeholder="0,00"
                    />
                  </div>

                  <div
                    className={
                      Number(montoEfectivoMixto || 0) +
                        Number(montoDigitalMixto || 0) >=
                      Number(pedidoPago.total || 0)
                        ? "conversion-ok"
                        : "conversion-pendiente"
                    }
                  >
                    {Number(montoEfectivoMixto || 0) +
                      Number(montoDigitalMixto || 0) >=
                    Number(pedidoPago.total || 0)
                      ? "Pago completo"
                      : `Falta: ${formatearBolivianos(
                          Number(pedidoPago.total || 0) -
                            (Number(montoEfectivoMixto || 0) +
                              Number(montoDigitalMixto || 0))
                        )}`}
                  </div>
                </div>
              )}

              <h3>Comprobante</h3>

              <div className="conversion-comprobante">
                <label>
                  <input
                    type="radio"
                    checked={tipoComprobante === "TICKET"}
                    onChange={() => {
                      setTipoComprobante("TICKET");
                      setMensaje("");
                    }}
                  />
                  Ticket simple / Sin factura
                </label>

                <label>
                  <input
                    type="radio"
                    checked={tipoComprobante === "FACTURA"}
                    onChange={() => {
                      setTipoComprobante("FACTURA");
                      setMensaje("");
                    }}
                  />
                  Factura con NIT
                </label>

                {tipoComprobante === "FACTURA" && (
                  <div className="conversion-factura">
                    <label>NIT / CI</label>
                    <input
                      value={nitCi}
                      onChange={(evento) => {
                        setNitCi(evento.target.value);
                        setMensaje("");
                      }}
                      placeholder="Ej: 7250256"
                    />

                    <label>Razón social</label>
                    <input
                      value={razonSocial}
                      onChange={(evento) => {
                        setRazonSocial(evento.target.value);
                        setMensaje("");
                      }}
                      placeholder="Ej: Juan Pérez"
                    />
                  </div>
                )}
              </div>

              {mensaje && (
                <div className="conversion-mensaje">
                  {mensaje}
                </div>
              )}

              <div className="pedido-modal-actions">
                <button
                  className="btn-ver-detalle"
                  onClick={() => setPedidoPago(null)}
                >
                  Cancelar
                </button>

                <button
                  className="btn-convertir"
                  onClick={confirmarConversionVenta}
                >
                  Confirmar y convertir en venta
                </button>
              </div>
            </div>
          </div>
        )}

        {pedidoSeleccionado && (
          <div className="pedido-modal-fondo">
            <div className="pedido-modal">
              <div className="pedido-modal-header">
                <div>
                  <h2>Detalle del pedido #{pedidoSeleccionado.id}</h2>
                  <p>{obtenerCliente(pedidoSeleccionado)}</p>
                </div>

                <button onClick={() => setPedidoSeleccionado(null)}>
                  <X size={22} />
                </button>
              </div>

              <div className="pedido-modal-info">
                <p>
                  <strong>Teléfono:</strong> {obtenerTelefono(pedidoSeleccionado)}
                </p>

                <p>
                  <strong>Dirección:</strong> {pedidoSeleccionado.direccionEntrega}
                </p>

                <p>
                  <strong>Estado:</strong> {pedidoSeleccionado.estado}
                </p>

                <p>
                  <strong>Fecha:</strong> {obtenerFechaPedido(pedidoSeleccionado)}
                </p>
              </div>

              <h3>Productos</h3>

              <div className="pedido-modal-productos">
                {pedidoSeleccionado.detalles?.map((detalle) => (
                  <div key={detalle.id}>
                    <span>{detalle.productoNombre || `Producto #${detalle.productoId}`}</span>
                    <span>x{detalle.cantidad}</span>
                    <strong>{formatearBolivianos(detalle.subtotal)}</strong>
                  </div>
                ))}
              </div>

              <div className="pedido-modal-total">
                <span>Total</span>
                <strong>{formatearBolivianos(pedidoSeleccionado.total)}</strong>
              </div>

              <div className="pedido-modal-actions">
                <button
                  className="btn-ver-detalle"
                  onClick={() => setPedidoSeleccionado(null)}
                >
                  Cerrar
                </button>

                {pedidoSeleccionado.estado !== "CANCELADO" &&
                  pedidoSeleccionado.estado !== "ENTREGADO" && (
                    <>
                      <button
                        className="btn-convertir"
                        onClick={() => convertirEnVenta(pedidoSeleccionado)}
                      >
                        Convertir en venta
                      </button>

                      <button
                        className="btn-cancelar-pedido"
                        onClick={() => cancelarPedidoPendiente(pedidoSeleccionado)}
                      >
                        Cancelar pedido
                      </button>
                    </>
                  )}
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}