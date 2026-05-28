import { useEffect, useMemo, useState } from "react";
import "../../styles/dashboard-cajero.css";
import "../../styles/nueva-venta.css";
import "../../styles/registrar-pedido.css";


import {
  LayoutDashboard,
  ShoppingCart,
  ClipboardList,
  Search,
  PackageCheck,
  Users,
  WalletCards,
  BarChart3,
  Settings,
  CalendarDays,
  Clock,
  LogOut,
  Trash2,
  X,
  Plus,
  Minus,
  CreditCard,
  ReceiptText,
  Banknote,
  Truck,
  Store,
  MapPin,
  Phone,
} from "lucide-react";

import type { UsuarioLogueado } from "../../App";

import type { VistaCajero } from "../../types/navigation";
import {
  obtenerProductos,
  crearVentaRapida,
  crearPedidoRapido,
  obtenerFacturaPorVenta,
  type ProductoApi,
  type CreateVentaRapidaDto,
  type CreatePedidoRapidoDto,
  type FacturaResponse,
} from "../../services/api";

type Props = {
  usuario: UsuarioLogueado;
  onNavigate: (vista: VistaCajero) => void;
};

type ItemCarrito = {
  producto: ProductoApi;
  cantidad: number;
};

type MetodoPagoVista = "EFECTIVO" | "QR_TRANSFERENCIA" | "MIXTO";
type TipoComprobante = "TICKET" | "FACTURA";
type TipoEntrega = "DELIVERY" | "RECOGER";

function formatearBolivianos(valor: number) {
  return `Bs. ${Number(valor).toLocaleString("es-BO", {
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

export function RegistrarPedidoPage({ usuario, onNavigate }: Props) {
  const [productos, setProductos] = useState<ProductoApi[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [categoriaActiva, setCategoriaActiva] = useState("Todos");
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);

  const [tipoEntrega, setTipoEntrega] = useState<TipoEntrega>("DELIVERY");
  const [clienteNombre, setClienteNombre] = useState("");
  const [clienteTelefono, setClienteTelefono] = useState("");
  const [nitCi, setNitCi] = useState("");
  const [razonSocial, setRazonSocial] = useState("");
  const [direccionEntrega, setDireccionEntrega] = useState("");
  const [referenciaEntrega, setReferenciaEntrega] = useState("");
  const [zona, setZona] = useState("");
  const [repartidor, setRepartidor] = useState("");
  const [observacionesPedido, setObservacionesPedido] = useState("");

  const [metodoPago, setMetodoPago] = useState<MetodoPagoVista>("EFECTIVO");
  const [montoRecibido, setMontoRecibido] = useState("");
  const [referenciaPago, setReferenciaPago] = useState("");
  const [montoEfectivoMixto, setMontoEfectivoMixto] = useState("");
  const [montoDigitalMixto, setMontoDigitalMixto] = useState("");

  const [tipoComprobante, setTipoComprobante] = useState<TipoComprobante>("TICKET");

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [mensajePedido, setMensajePedido] = useState("");
  const [tipoMensajePedido, setTipoMensajePedido] = useState<"error" | "exito">("error");

  const [facturaGenerada, setFacturaGenerada] = useState<FacturaResponse | null>(null);
  const [mostrandoFactura, setMostrandoFactura] = useState(false);

  useEffect(() => {
    async function cargarProductos() {
      try {
        setCargando(true);
        setError("");

        const datos = await obtenerProductos();
        setProductos(datos);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Error inesperado al cargar productos");
        }
      } finally {
        setCargando(false);
      }
    }

    cargarProductos();
  }, []);

  const categorias = useMemo(() => {
    const categoriasUnicas = Array.from(
      new Set(productos.map((producto) => producto.categoria).filter(Boolean))
    );

    return ["Todos", ...categoriasUnicas];
  }, [productos]);

  const productosFiltrados = productos.filter((producto) => {
    const q = busqueda.toLowerCase().trim();

    const coincideBusqueda =
      !q ||
      producto.nombre.toLowerCase().includes(q) ||
      producto.categoria.toLowerCase().includes(q) ||
      producto.id.toString().includes(q);

    const coincideCategoria =
      categoriaActiva === "Todos" || producto.categoria === categoriaActiva;

    return coincideBusqueda && coincideCategoria && producto.activo;
  });

  const subtotal = carrito.reduce(
    (total, item) => total + item.producto.precio * item.cantidad,
    0
  );

  const costoEnvio = tipoEntrega === "DELIVERY" ? 5 : 0;
  const descuento = 0;
  const total = subtotal + costoEnvio - descuento;

  const montoRecibidoNumero = Number(montoRecibido || 0);
  const cambio =
    metodoPago === "EFECTIVO" && montoRecibidoNumero >= total
      ? montoRecibidoNumero - total
      : 0;

  const montoEfectivoMixtoNumero = Number(montoEfectivoMixto || 0);
  const montoDigitalMixtoNumero = Number(montoDigitalMixto || 0);
  const totalMixto = montoEfectivoMixtoNumero + montoDigitalMixtoNumero;
  const faltaMixto = metodoPago === "MIXTO" ? total - totalMixto : 0;
  const cambioMixto =
    metodoPago === "MIXTO" && totalMixto > total ? totalMixto - total : 0;

  function mostrarMensaje(tipo: "error" | "exito", mensaje: string) {
    setTipoMensajePedido(tipo);
    setMensajePedido(mensaje);
  }

  function limpiarMensaje() {
    setMensajePedido("");
  }

  function agregarProducto(producto: ProductoApi) {
    if (producto.stock <= 0) return;

    setCarrito((items) => {
      const itemExistente = items.find((item) => item.producto.id === producto.id);

      if (itemExistente) {
        if (itemExistente.cantidad >= producto.stock) return items;

        return items.map((item) =>
          item.producto.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }

      return [...items, { producto, cantidad: 1 }];
    });

    limpiarMensaje();
  }

  function aumentarCantidad(productoId: number) {
    setCarrito((items) =>
      items.map((item) => {
        if (item.producto.id !== productoId) return item;
        if (item.cantidad >= item.producto.stock) return item;

        return { ...item, cantidad: item.cantidad + 1 };
      })
    );

    limpiarMensaje();
  }

  function disminuirCantidad(productoId: number) {
    setCarrito((items) =>
      items
        .map((item) =>
          item.producto.id === productoId
            ? { ...item, cantidad: item.cantidad - 1 }
            : item
        )
        .filter((item) => item.cantidad > 0)
    );

    limpiarMensaje();
  }

  function eliminarProducto(productoId: number) {
    setCarrito((items) => items.filter((item) => item.producto.id !== productoId));
    limpiarMensaje();
  }

  function vaciarPedido() {
    setCarrito([]);
    limpiarMensaje();
  }

  function validarDatosPedido() {
    if (clienteNombre.trim() === "") {
      mostrarMensaje("error", "Ingresa el nombre del cliente.");
      return false;
    }

    if (clienteTelefono.trim() === "") {
      mostrarMensaje("error", "Ingresa el teléfono del cliente.");
      return false;
    }

    if (tipoEntrega === "DELIVERY" && direccionEntrega.trim() === "") {
      mostrarMensaje("error", "Ingresa la dirección de entrega.");
      return false;
    }

    if (carrito.length === 0) {
      mostrarMensaje("error", "Agrega al menos un producto al pedido.");
      return false;
    }

    return true;
  }

  async function confirmarPagoYConvertirVenta() {
    try {
      if (!validarDatosPedido()) return;

      if (metodoPago === "EFECTIVO" && montoRecibidoNumero < total) {
        mostrarMensaje("error", "El monto recibido no cubre el total del pedido.");
        return;
      }

      if (metodoPago === "QR_TRANSFERENCIA" && referenciaPago.trim() === "") {
        mostrarMensaje("error", "Ingresa la referencia o código de operación del pago digital.");
        return;
      }

      if (metodoPago === "MIXTO" && totalMixto < total) {
        mostrarMensaje("error", "El pago mixto no cubre el total del pedido.");
        return;
      }

      if (tipoComprobante === "FACTURA") {
        if (nitCi.trim() === "") {
          mostrarMensaje("error", "Ingresa el NIT/CI para generar factura.");
          return;
        }

        if (razonSocial.trim() === "") {
          mostrarMensaje("error", "Ingresa la razón social para generar factura.");
          return;
        }
      }

      const metodoPagoBackend =
        metodoPago === "QR_TRANSFERENCIA" ? "QR" : metodoPago;

      const ventaRapida: CreateVentaRapidaDto = {
        costoEnvio: costoEnvio,
        clienteNombre: clienteNombre.trim(),
        observaciones:
          `Pedido: ${tipoEntrega}. Tel: ${clienteTelefono}. ` +
          `Dirección: ${direccionEntrega || "Recoger en tienda"}. ` +
          `Referencia: ${referenciaEntrega || "-"}. ` +
          `Zona: ${zona || "-"}. ` +
          `Repartidor: ${repartidor || "-"}. ` +
          `Obs: ${observacionesPedido || "-"}`,
        metodoPago: metodoPagoBackend,
        montoRecibido:
          metodoPago === "EFECTIVO" ? Number(montoRecibido || 0) : undefined,
        montoEfectivo:
          metodoPago === "MIXTO" ? Number(montoEfectivoMixto || 0) : undefined,
        montoDigital:
          metodoPago === "MIXTO" ? Number(montoDigitalMixto || 0) : undefined,
        referenciaPago:
          metodoPago === "QR_TRANSFERENCIA" ? referenciaPago : undefined,
        generarFactura: tipoComprobante === "FACTURA",
        nitCi: tipoComprobante === "FACTURA" ? nitCi : undefined,
        razonSocial: tipoComprobante === "FACTURA" ? razonSocial : undefined,
        productos: carrito.map((item) => ({
          productoId: item.producto.id,
          cantidad: item.cantidad,
        })),
      };

      const ventaCreada = await crearVentaRapida(ventaRapida);

      if (tipoComprobante === "FACTURA") {
        const factura = await obtenerFacturaPorVenta(ventaCreada.id);
        setFacturaGenerada(factura);
        setMostrandoFactura(true);
      } else {
        mostrarMensaje("exito", "Pedido confirmado y convertido en venta correctamente.");
      }

      setCarrito([]);
      setMontoRecibido("");
      setMontoEfectivoMixto("");
      setMontoDigitalMixto("");
      setReferenciaPago("");
      setNitCi("");
      setRazonSocial("");
      setTipoComprobante("TICKET");
      setMetodoPago("EFECTIVO");

      const productosActualizados = await obtenerProductos();
      setProductos(productosActualizados);
    } catch (error) {
      if (error instanceof Error) {
        mostrarMensaje("error", error.message);
      } else {
        mostrarMensaje("error", "Error inesperado al registrar el pedido.");
      }
    }
  }

  async function guardarPedidoPendiente() {
  try {
    if (!validarDatosPedido()) return;

    const pedidoRapido: CreatePedidoRapidoDto = {
      clienteNombre: clienteNombre.trim(),
      clienteTelefono: clienteTelefono.trim(),
      direccionEntrega:
        tipoEntrega === "DELIVERY"
          ? direccionEntrega.trim()
          : "Recoger en tienda",
      referenciaEntrega: referenciaEntrega.trim() || undefined,
      zona: zona || undefined,
      observaciones: observacionesPedido.trim() || undefined,
      costoEnvio: costoEnvio,
      productos: carrito.map((item) => ({
        productoId: item.producto.id,
        cantidad: item.cantidad,
      })),
    };

    await crearPedidoRapido(pedidoRapido);

    mostrarMensaje("exito", "Pedido guardado como pendiente correctamente.");

    setCarrito([]);
    setMontoRecibido("");
    setMontoEfectivoMixto("");
    setMontoDigitalMixto("");
    setReferenciaPago("");
    setNitCi("");
    setRazonSocial("");
    setTipoComprobante("TICKET");
    setMetodoPago("EFECTIVO");

    const productosActualizados = await obtenerProductos();
    setProductos(productosActualizados);
  } catch (error) {
    if (error instanceof Error) {
      mostrarMensaje("error", error.message);
    } else {
      mostrarMensaje("error", "Error inesperado al guardar el pedido pendiente.");
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

          <button className="menu-item active" onClick={() => onNavigate("registrar-pedido")}>
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

          <button className="menu-item" onClick={() => onNavigate("configuracion")}>
            <Settings size={22} />
            <span>Configuración</span>
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
          <LogOut size={18} />
        </div>
      </aside>

      <section className="cajero-content">
        <header className="dashboard-header">
          <div>
            <h1>
              Registrar pedido <ClipboardList size={28} />
            </h1>
            <p>Registrar pedido por teléfono o delivery</p>
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

        <section className="pedido-layout">
          <div className="venta-panel pedido-cliente-panel">
            <h2>Datos del cliente</h2>

            <div className="tipo-entrega">
              <button
                type="button"
                className={tipoEntrega === "DELIVERY" ? "active" : ""}
                onClick={() => {
                  setTipoEntrega("DELIVERY");
                  limpiarMensaje();
                }}
              >
                <Truck size={18} />
                Delivery
              </button>

              <button
                type="button"
                className={tipoEntrega === "RECOGER" ? "active" : ""}
                onClick={() => {
                  setTipoEntrega("RECOGER");
                  limpiarMensaje();
                }}
              >
                <Store size={18} />
                Recoger en tienda
              </button>
            </div>

            <label className="venta-label">Nombre *</label>
            <input
              className="pedido-input"
              value={clienteNombre}
              onChange={(evento) => {
                setClienteNombre(evento.target.value);
                limpiarMensaje();
              }}
              placeholder="Ej: Juan Pérez"
            />

            <label className="venta-label">Teléfono *</label>
            <div className="pedido-input-icon">
              <Phone size={18} />
              <input
                value={clienteTelefono}
                onChange={(evento) => {
                  setClienteTelefono(evento.target.value);
                  limpiarMensaje();
                }}
                placeholder="Ej: 71234567"
              />
            </div>

            <label className="venta-label">NIT / CI opcional</label>
            <input
              className="pedido-input"
              value={nitCi}
              onChange={(evento) => {
                setNitCi(evento.target.value);
                limpiarMensaje();
              }}
              placeholder="Ej: 7250256"
            />

            {tipoEntrega === "DELIVERY" && (
              <>
                <label className="venta-label">Dirección de entrega *</label>
                <div className="pedido-input-icon">
                  <MapPin size={18} />
                  <input
                    value={direccionEntrega}
                    onChange={(evento) => {
                      setDireccionEntrega(evento.target.value);
                      limpiarMensaje();
                    }}
                    placeholder="Ej: Av. América Oeste #1234"
                  />
                </div>

                <label className="venta-label">Referencia</label>
                <input
                  className="pedido-input"
                  value={referenciaEntrega}
                  onChange={(evento) => setReferenciaEntrega(evento.target.value)}
                  placeholder="Ej: Frente al parque"
                />

                <label className="venta-label">Zona</label>
                <select
                  className="pedido-input"
                  value={zona}
                  onChange={(evento) => setZona(evento.target.value)}
                >
                  <option value="">Seleccionar zona</option>
                  <option value="Zona Norte">Zona Norte</option>
                  <option value="Zona Centro">Zona Centro</option>
                  <option value="Zona Sur">Zona Sur</option>
                </select>

                <div className="pedido-doble-campo">
                  <div>
                    <label className="venta-label">Repartidor</label>
                    <input
                      className="pedido-input"
                      value={repartidor}
                      onChange={(evento) => setRepartidor(evento.target.value)}
                      placeholder="Opcional"
                    />
                  </div>

                  <div>
                    <label className="venta-label">Envío</label>
                    <input
                      className="pedido-input"
                      value={formatearBolivianos(costoEnvio)}
                      readOnly
                    />
                  </div>
                </div>
              </>
            )}

            <label className="venta-label">Observaciones del pedido</label>
            <textarea
              className="pedido-textarea"
              value={observacionesPedido}
              onChange={(evento) => setObservacionesPedido(evento.target.value)}
              placeholder="Ej: Llamar cuando llegue"
            />
          </div>

          <div className="venta-panel productos-panel">
  <h2>Productos</h2>

  <div className="venta-search">
    <input
      value={busqueda}
      onChange={(evento) => setBusqueda(evento.target.value)}
      placeholder="Buscar por nombre o código"
    />
    <Search size={22} />
  </div>

  <div className="venta-categorias">
    {categorias.map((categoria) => (
      <button
        key={categoria}
        className={categoriaActiva === categoria ? "active" : ""}
        onClick={() => setCategoriaActiva(categoria)}
      >
        {categoria}
      </button>
    ))}
  </div>

  {cargando && <p className="venta-info">Cargando productos...</p>}
  {error && <p className="venta-error">{error}</p>}

  <div className="productos-grid-venta">
    {productosFiltrados.map((producto) => (
      <article className="producto-venta-card" key={producto.id}>
        <div className="producto-venta-img">
          {producto.imageUrl ? (
            <img src={producto.imageUrl} alt={producto.nombre} />
          ) : (
            <PackageCheck size={32} />
          )}
        </div>

        <h3>{producto.nombre}</h3>
        <strong>{formatearBolivianos(producto.precio)}</strong>

        <div className="producto-venta-footer">
          <span className={producto.stock <= 5 ? "stock-low" : "stock-ok"}>
            Stock: {producto.stock}
          </span>

          <button
            onClick={() => agregarProducto(producto)}
            disabled={producto.stock <= 0}
          >
            <Plus size={16} />
            Agregar
          </button>
        </div>
      </article>
    ))}
  </div>
</div>

<div className="venta-panel carrito-panel">
  <div className="panel-title-row">
    <div className="pedido-title-con-estado">
      <h2>Carrito del pedido</h2>
      <span>PENDIENTE</span>
    </div>

    <button className="btn-vaciar" onClick={vaciarPedido}>
      <Trash2 size={18} />
      Vaciar pedido
    </button>
  </div>

  <div className="carrito-header">
    <span>Producto</span>
    <span>Precio</span>
    <span>Cant.</span>
    <span>Subtotal</span>
  </div>

  <div className="carrito-lista">
    {carrito.length === 0 && (
      <p className="venta-info">Todavía no agregaste productos al pedido.</p>
    )}

    {carrito.map((item) => (
      <div className="carrito-item" key={item.producto.id}>
        <div className="carrito-producto">
          <div className="carrito-img">
            {item.producto.imageUrl ? (
              <img src={item.producto.imageUrl} alt={item.producto.nombre} />
            ) : (
              <PackageCheck size={22} />
            )}
          </div>

          <div>
            <strong>{item.producto.nombre}</strong>
            <p>{formatearBolivianos(item.producto.precio)}</p>
          </div>
        </div>

        <span>{formatearBolivianos(item.producto.precio)}</span>

        <div className="cantidad-control">
          <button onClick={() => disminuirCantidad(item.producto.id)}>
            <Minus size={14} />
          </button>
          <span>{item.cantidad}</span>
          <button onClick={() => aumentarCantidad(item.producto.id)}>
            <Plus size={14} />
          </button>
        </div>

        <strong>{formatearBolivianos(item.producto.precio * item.cantidad)}</strong>

        <button
          className="btn-eliminar"
          onClick={() => eliminarProducto(item.producto.id)}
        >
          <X size={18} />
        </button>
      </div>
    ))}
  </div>

  <div className="pedido-total-parcial">
    <span>Total parcial</span>
    <strong>{formatearBolivianos(subtotal)}</strong>
  </div>

  <label className="venta-label">Observaciones internas</label>
  <textarea
    className="pedido-textarea pedido-textarea-interna"
    value={observacionesPedido}
    onChange={(evento) => {
      setObservacionesPedido(evento.target.value);
      limpiarMensaje();
    }}
    placeholder="Agregar observaciones internas del pedido..."
  />
  <p className="pedido-nota">Esta nota no será visible para el cliente.</p>
</div>

<div className="venta-panel pago-panel">
  <h2>Resumen y pago</h2>

  <div className="pago-total-box">
    <div>
      <span>Subtotal</span>
      <strong>{formatearBolivianos(subtotal)}</strong>
    </div>

    <div>
      <span>Envío</span>
      <strong>{formatearBolivianos(costoEnvio)}</strong>
    </div>

    <div>
      <span>Descuento</span>
      <input value="0,00" readOnly />
    </div>

    <hr />

    <div className="total-final">
      <span>Total</span>
      <strong>{formatearBolivianos(total)}</strong>
    </div>
  </div>

  <h3>Método de pago</h3>

  <div className="metodos-pago">
    <button
      type="button"
      className={metodoPago === "EFECTIVO" ? "active" : ""}
      onClick={() => {
        setMetodoPago("EFECTIVO");
        limpiarMensaje();
      }}
    >
      <Banknote size={22} />
      <span>Efectivo</span>
    </button>

    <button
      type="button"
      className={metodoPago === "QR_TRANSFERENCIA" ? "active" : ""}
      onClick={() => {
        setMetodoPago("QR_TRANSFERENCIA");
        limpiarMensaje();
      }}
    >
      <CreditCard size={22} />
      <span>QR / Transferencia</span>
    </button>

    <button
      type="button"
      className={metodoPago === "MIXTO" ? "active" : ""}
      onClick={() => {
        setMetodoPago("MIXTO");
        limpiarMensaje();
      }}
    >
      <CreditCard size={22} />
      <span>Mixto</span>
    </button>
  </div>

  {metodoPago === "EFECTIVO" && (
    <>
      <label className="venta-label">Monto recibido</label>
      <div className="input-bs">
        <span>Bs.</span>
        <input
          value={montoRecibido}
          onChange={(evento) => {
            setMontoRecibido(evento.target.value);
            limpiarMensaje();
          }}
          placeholder="0,00"
        />
      </div>

      <label className="venta-label">Cambio</label>
      <div className="cambio-box">{formatearBolivianos(cambio)}</div>
    </>
  )}

  {metodoPago === "QR_TRANSFERENCIA" && (
    <div className="pago-digital-box">
      <h4>Pago digital</h4>
      <p>
        Monto a pagar: <strong>{formatearBolivianos(total)}</strong>
      </p>

      <div className="qr-placeholder">QR</div>

      <label className="venta-label">Referencia / código de operación</label>
      <input
        value={referenciaPago}
        onChange={(evento) => {
          setReferenciaPago(evento.target.value);
          limpiarMensaje();
        }}
        placeholder="Ej: 000123456"
      />
    </div>
  )}

  {metodoPago === "MIXTO" && (
    <div className="pago-mixto-box">
      <h4>Pago mixto</h4>
      <p>
        Total a pagar: <strong>{formatearBolivianos(total)}</strong>
      </p>

      <label className="venta-label">Monto en efectivo</label>
      <div className="input-bs">
        <span>Bs.</span>
        <input
          value={montoEfectivoMixto}
          onChange={(evento) => {
            setMontoEfectivoMixto(evento.target.value);
            limpiarMensaje();
          }}
          placeholder="0,00"
        />
      </div>

      <label className="venta-label">Monto por QR / transferencia</label>
      <div className="input-bs">
        <span>Bs.</span>
        <input
          value={montoDigitalMixto}
          onChange={(evento) => {
            setMontoDigitalMixto(evento.target.value);
            limpiarMensaje();
          }}
          placeholder="0,00"
        />
      </div>

      <div className={faltaMixto <= 0 ? "mixto-ok" : "mixto-pendiente"}>
        {faltaMixto > 0
          ? `Falta: ${formatearBolivianos(faltaMixto)}`
          : cambioMixto > 0
            ? `Cambio: ${formatearBolivianos(cambioMixto)}`
            : "Pago completo"}
      </div>
    </div>
  )}

  <h3>Comprobante</h3>

  <div className="comprobante-box">
    <label>
      <input
        type="radio"
        checked={tipoComprobante === "TICKET"}
        onChange={() => {
          setTipoComprobante("TICKET");
          limpiarMensaje();
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
          limpiarMensaje();
        }}
      />
      Factura con NIT
    </label>

    {tipoComprobante === "FACTURA" && (
      <div className="factura-form">
        <p>Datos para facturación</p>

        <label>NIT / CI</label>
        <input
          value={nitCi}
          onChange={(evento) => {
            setNitCi(evento.target.value);
            limpiarMensaje();
          }}
          placeholder="Ej: 123456789"
        />

        <label>Razón social</label>
        <input
          value={razonSocial}
          onChange={(evento) => {
            setRazonSocial(evento.target.value);
            limpiarMensaje();
          }}
          placeholder="Ej: Juan Pérez"
        />
      </div>
    )}
  </div>

  <div className="pedido-info-box">
    Al confirmar el pago, el pedido se convierte en venta.
  </div>

  {mensajePedido && (
    <div className={`mensaje-venta ${tipoMensajePedido}`}>
      {mensajePedido}
    </div>
  )}

  <button className="btn-guardar-pedido" onClick={guardarPedidoPendiente}>
    <ClipboardList size={22} />
    Guardar pedido pendiente
  </button>

  <button className="btn-confirmar" onClick={confirmarPagoYConvertirVenta}>
    <ReceiptText size={22} />
    Confirmar pago y convertir en venta
  </button>

  <button className="btn-cancelar" onClick={vaciarPedido}>
    <X size={22} />
    Cancelar
  </button>
</div>
                </section>
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
                Nuevo pedido
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}