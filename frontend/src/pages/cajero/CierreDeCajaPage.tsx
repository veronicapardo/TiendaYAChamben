import { useEffect, useState } from "react";
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
  Calendar,
  Clock,
  DollarSign,
  ShoppingBag,
  FileText,
  Package,
  Printer,
  Lock,
  X,
  CheckCircle2,
  Banknote,
  QrCode,
  Layers,
  Truck,
  Percent,
} from "lucide-react";
import type { UsuarioLogueado } from "../../App";
import type { VistaCajero } from "../../types/navigation";
import {
  cerrarCaja,
  obtenerCierreCaja,
  type CierreCajaResponse,
} from "../../services/api";
 
type Props = {
  usuario: UsuarioLogueado;
  onNavigate: (vista: VistaCajero) => void;
  onLogout: () => void;
};
 
 
function formatBs(valor: number) {
  return `Bs. ${Number(valor).toLocaleString("es-BO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatearMetodoPago(metodo: string) {
  if (metodo === "EFECTIVO") return "Efectivo";
  if (metodo === "QR") return "QR";
  if (metodo === "TRANSFERENCIA") return "Transferencia";
  if (metodo === "MIXTO") return "Mixto";
  return metodo || "-";
}

function obtenerIconoMetodoPago(metodo: string) {
  if (metodo === "EFECTIVO") return <Banknote size={13} color="#16a34a" />;
  if (metodo === "QR" || metodo === "TRANSFERENCIA") return <QrCode size={13} color="#7c3aed" />;
  if (metodo === "MIXTO") return <Layers size={13} color="#d97706" />;
  return <WalletCards size={13} color="#2563eb" />;
}

function obtenerColorMetodoPago(metodo: string) {
  if (metodo === "EFECTIVO") return "#dcfce7";
  if (metodo === "QR" || metodo === "TRANSFERENCIA") return "#ede9fe";
  if (metodo === "MIXTO") return "#fef3c7";
  return "#dbeafe";
}

function obtenerColorTextoMetodoPago(metodo: string) {
  if (metodo === "EFECTIVO") return "#15803d";
  if (metodo === "QR" || metodo === "TRANSFERENCIA") return "#6d28d9";
  if (metodo === "MIXTO") return "#b45309";
  return "#1d4ed8";
}
 
export function CierreDeCajaPage({ usuario, onNavigate, onLogout }: Props) {
  const [efectivoContado, setEfectivoContado] = useState("80,00");
  const [observaciones, setObservaciones] = useState("Caja cerrada sin novedades.");
  const [cierreCaja, setCierreCaja] = useState<CierreCajaResponse | null>(null);
const [cargando, setCargando] = useState(true);
const [error, setError] = useState("");
const [mensajeExito, setMensajeExito] = useState("");
const [cerrandoCaja, setCerrandoCaja] = useState(false);

const [mostrarModalCierre, setMostrarModalCierre] = useState(false);

useEffect(() => {
  async function cargarDatosCierre() {
    try {
      setCargando(true);
      setError("");

      const datos = await obtenerCierreCaja();
      setCierreCaja(datos);

      const montoBaseInicial = 50;
const efectivoBackend = Number(datos.efectivo || 0);
const efectivoEsperadoBackend = montoBaseInicial + efectivoBackend;

setEfectivoContado(
  efectivoEsperadoBackend.toLocaleString("es-BO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Error inesperado al cargar cierre de caja.");
      }
    } finally {
      setCargando(false);
    }
  }

  cargarDatosCierre();
}, []);

async function confirmarCierreCaja() {
  try {
    setCerrandoCaja(true);
    setError("");
    setMensajeExito("");

    const cierreGuardado = await cerrarCaja({
      usuarioId: usuario.id,
      montoBaseInicial: montoBase,
      efectivoEsperado,
      efectivoContado: efectivoContadoNum,
      diferencia,
      totalRecaudado,
      observaciones,
    });

    setMensajeExito(
  `Caja cerrada correctamente. Código de cierre #${cierreGuardado.id}`
);

const datosActualizados = await obtenerCierreCaja();
setCierreCaja(datosActualizados);

const montoBaseInicial = 50;
const efectivoBackend = Number(datosActualizados.efectivo || 0);
const efectivoEsperadoBackend = montoBaseInicial + efectivoBackend;

setEfectivoContado(
  efectivoEsperadoBackend.toLocaleString("es-BO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
);

setMostrarModalCierre(false);
  } catch (error) {
    if (error instanceof Error) {
      setError(error.message);
    } else {
      setError("Error inesperado al cerrar caja.");
    }
  } finally {
    setCerrandoCaja(false);
  }
}

 
  const ahora = new Date();
  const fechaStr = `${ahora.getDate()}/${ahora.getMonth() + 1}/${ahora.getFullYear()}`;
  const horaStr = ahora.toLocaleTimeString("es-BO", { hour: "2-digit", minute: "2-digit" });
 
const efectivo = Number(cierreCaja?.efectivo || 0);
const qr = Number(cierreCaja?.qrTransferencia || 0);
const mixto = Number(cierreCaja?.mixto || 0);
const envios = Number(cierreCaja?.enviosCobrados || 0);
const descuentos = Number(cierreCaja?.descuentosAplicados || 0);
const totalRecaudado = Number(cierreCaja?.totalRecaudado || 0);
const transacciones = Number(cierreCaja?.transacciones || 0);
const facturasEmitidas = Number(cierreCaja?.facturasEmitidas || 0);
const pedidosConvertidos = Number(cierreCaja?.pedidosConvertidos || 0);
const ultimosMovimientos = cierreCaja?.ultimosMovimientos || [];
 
  const montoBase = 50.0;
const efectivoEsperado = montoBase + efectivo;
const efectivoContadoNum = parseFloat(efectivoContado.replace(",", ".")) || 0;
const diferencia = efectivoContadoNum - efectivoEsperado;
  const esSobrante = diferencia > 0;
  const esFaltante = diferencia < 0;
  const estadoOk = Math.abs(diferencia) < 5;
 
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
          <button className="menu-item" onClick={() => onNavigate("clientes")}><Users size={22} /><span>Clientes</span></button>
          <button className="menu-item active" onClick={() => onNavigate("cierre-caja")}><WalletCards size={22} /><span>Cierre de Caja</span></button>
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
        <header className="cc-header">
          <div className="cc-header-left">
            <div className="cc-header-title-row">
              <h1>Cierre de caja</h1>
              <div className="cc-header-icon"><Lock size={20} /></div>
            </div>
            <p>Finalizar turno y cerrar caja diaria</p>
          </div>
          <div className="cc-header-meta">
            <span className="cc-meta-item"><Calendar size={16} /> {fechaStr}</span>
            <span className="cc-meta-item"><Clock size={16} /> {horaStr}</span>
            <span className="cc-online"><span className="cc-dot" />Online</span>
          </div>
        </header>

        {cargando && (
  <div className="cc-card" style={{ marginTop: 16 }}>
    Cargando datos del cierre de caja...
  </div>
)}

{error && (
  <div className="cc-card" style={{ marginTop: 16, color: "#b91c1c" }}>
    {error}
  </div>
)}

{mensajeExito && (
  <div className="cc-card" style={{ marginTop: 16, color: "#15803d" }}>
    {mensajeExito}
  </div>
)}
 
        {/* Stats */}
        <div className="cc-stats">
          <div className="cc-stat-card">
            <div className="cc-stat-icon" style={{ background: "#F0FFF4" }}><DollarSign size={24} color="#10B981" /></div>
            <div>
              <div className="cc-stat-label">Ventas del día</div>
              <div className="cc-stat-value">{formatBs(totalRecaudado)}</div>
            </div>
          </div>
          <div className="cc-stat-card">
            <div className="cc-stat-icon" style={{ background: "#FFF7ED" }}><ShoppingBag size={24} color="#F28C00" /></div>
            <div>
              <div className="cc-stat-label">Transacciones</div>
              <div className="cc-stat-value">{transacciones}</div>
            </div>
          </div>
          <div className="cc-stat-card">
            <div className="cc-stat-icon" style={{ background: "#F5F3FF" }}><FileText size={24} color="#8B5CF6" /></div>
            <div>
              <div className="cc-stat-label">Facturas emitidas</div>
              <div className="cc-stat-value">{facturasEmitidas}</div>
            </div>
          </div>
          <div className="cc-stat-card">
            <div className="cc-stat-icon" style={{ background: "#EFF6FF" }}><Package size={24} color="#3B82F6" /></div>
            <div>
              <div className="cc-stat-label">Pedidos convertidos</div>
              <div className="cc-stat-value">{pedidosConvertidos}</div>
            </div>
          </div>
        </div>
 
        {/* Body grid */}
        <div className="cc-body-grid">
          {/* Resumen del turno */}
          <div className="cc-card">
            <div className="cc-card-title">Resumen del turno</div>
            <div className="cc-resumen-filas">
              <div className="cc-resumen-fila">
                <span className="cc-resumen-icon" style={{ background: "#dcfce7" }}><Banknote size={16} color="#16a34a" /></span>
                <span className="cc-resumen-label">Efectivo</span>
                <span className="cc-resumen-val">{formatBs(efectivo)}</span>
              </div>
              <div className="cc-resumen-fila">
                <span className="cc-resumen-icon" style={{ background: "#ede9fe" }}><QrCode size={16} color="#7c3aed" /></span>
                <span className="cc-resumen-label">QR / Transferencias</span>
                <span className="cc-resumen-val">{formatBs(qr)}</span>
              </div>
              <div className="cc-resumen-fila">
                <span className="cc-resumen-icon" style={{ background: "#fef3c7" }}><Layers size={16} color="#d97706" /></span>
                <span className="cc-resumen-label">Mixto</span>
                <span className="cc-resumen-val">{formatBs(mixto)}</span>
              </div>
              <div className="cc-resumen-fila">
                <span className="cc-resumen-icon" style={{ background: "#e0f2fe" }}><Truck size={16} color="#0284c7" /></span>
                <span className="cc-resumen-label">Envíos cobrados</span>
                <span className="cc-resumen-val">{formatBs(envios)}</span>
              </div>
              <div className="cc-resumen-fila">
                <span className="cc-resumen-icon" style={{ background: "#fee2e2" }}><Percent size={16} color="#dc2626" /></span>
                <span className="cc-resumen-label">Descuentos aplicados</span>
                <span className="cc-resumen-val">{formatBs(descuentos)}</span>
              </div>
            </div>
            <div className="cc-total-fila">
              <span>Total recaudado</span>
              <span className="cc-total-val">{formatBs(totalRecaudado)}</span>
            </div>
          </div>
 
          {/* Conteo de caja */}
          <div className="cc-card">
            <div className="cc-card-title">Conteo de caja</div>
            <div className="cc-conteo-filas">
              <div className="cc-conteo-fila">
                <span className="cc-conteo-label">Monto base inicial</span>
                <span className="cc-conteo-val">{formatBs(montoBase)}</span>
              </div>
              <div className="cc-conteo-fila">
                <span className="cc-conteo-label">Efectivo esperado</span>
                <span className="cc-conteo-val">{formatBs(efectivoEsperado)}</span>
              </div>
              <div className="cc-conteo-fila">
                <span className="cc-conteo-label">Efectivo contado</span>
                <div className="cc-input-wrap">
                  <span className="cc-input-prefix">Bs.</span>
                  <input
                    className="cc-input"
                    type="text"
                    value={efectivoContado}
                    onChange={(e) => setEfectivoContado(e.target.value)}
                  />
                </div>
              </div>
              <div className="cc-conteo-fila cc-diferencia-fila">
                <span className="cc-conteo-label">Diferencia</span>
                <div className="cc-diferencia-right">
                  <span className={`cc-diferencia-val ${esSobrante ? "sobrante" : esFaltante ? "faltante" : ""}`}>
                    {formatBs(Math.abs(diferencia))}
                  </span>
                  {esSobrante && <span className="cc-diferencia-tag sobrante">Sobrante</span>}
                  {esFaltante && <span className="cc-diferencia-tag faltante">Faltante</span>}
                  {!esSobrante && !esFaltante && <span className="cc-diferencia-tag exacto">Exacto</span>}
                </div>
              </div>
            </div>
 
            <div className={`cc-estado-cierre ${estadoOk ? "ok" : "warn"}`}>
              <CheckCircle2 size={20} color={estadoOk ? "#16a34a" : "#d97706"} />
              <div>
                <div className="cc-estado-label">Estado del cierre:</div>
                <div className={`cc-estado-val ${estadoOk ? "ok" : "warn"}`}>
                  {estadoOk ? "Listo para cerrar" : "Revisar diferencia"}
                </div>
              </div>
            </div>
          </div>
 
          {/* Observaciones */}
          <div className="cc-card">
            <div className="cc-card-title">Observaciones</div>
            <textarea
              className="cc-textarea"
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              rows={5}
            />
          </div>
 
          {/* Últimos movimientos */}
          <div className="cc-card">
            <div className="cc-card-title">Últimos movimientos</div>
            <table className="cc-mov-tabla">
              <thead>
                <tr>
                  <th>Fecha y hora</th>
                  <th>Movimiento</th>
                  <th>Método de pago</th>
                  <th>Monto</th>
                </tr>
              </thead>
              <tbody>
  {ultimosMovimientos.length === 0 && (
    <tr>
      <td colSpan={4}>No hay movimientos registrados hoy.</td>
    </tr>
  )}

  {ultimosMovimientos.map((movimiento, index) => (
    <tr key={`${movimiento.movimiento}-${index}`}>
      <td>
        <div className="cc-mov-fecha">
          <Clock size={13} color="#9ca3af" />
          {new Date(movimiento.fechaHora).toLocaleString("es-BO", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </td>

      <td>{movimiento.movimiento}</td>

      <td>
        <span
          className="cc-metodo-badge"
          style={{
            background: obtenerColorMetodoPago(movimiento.metodoPago),
            color: obtenerColorTextoMetodoPago(movimiento.metodoPago),
          }}
        >
          {obtenerIconoMetodoPago(movimiento.metodoPago)}
          {formatearMetodoPago(movimiento.metodoPago)}
        </span>
      </td>

      <td className="cc-mov-monto">{formatBs(movimiento.monto)}</td>
    </tr>
  ))}
</tbody>
            </table>
            <button className="cc-ver-todos">
              Ver todos los movimientos →
            </button>
          </div>
        </div>
 
        {/* Footer acciones */}
        <div className="cc-footer-acciones">
          <button className="cc-btn-cancelar" onClick={() => onNavigate("dashboard")}>
            <X size={16} /> Cancelar
          </button>
          <button className="cc-btn-imprimir" onClick={() => window.print()}>
  <Printer size={16} /> Imprimir resumen
</button>
          <button
  className="cc-btn-cerrar"
  onClick={() => setMostrarModalCierre(true)}
  disabled={cerrandoCaja}
>
  <Lock size={16} />
  {cerrandoCaja ? "Cerrando..." : "Cerrar caja"}
</button>
        </div>
        {mostrarModalCierre && (
  <div className="cc-modal-fondo">
    <div className="cc-modal">
      <div className="cc-modal-header">
        <div>
          <h2>Confirmar cierre de caja</h2>
          <p>Revisa el resumen antes de guardar el cierre del turno.</p>
        </div>

        <button
          type="button"
          onClick={() => setMostrarModalCierre(false)}
          disabled={cerrandoCaja}
        >
          <X size={22} />
        </button>
      </div>

      <div className="cc-modal-resumen">
        <div>
          <span>Total recaudado</span>
          <strong>{formatBs(totalRecaudado)}</strong>
        </div>

        <div>
          <span>Monto base inicial</span>
          <strong>{formatBs(montoBase)}</strong>
        </div>

        <div>
          <span>Efectivo esperado</span>
          <strong>{formatBs(efectivoEsperado)}</strong>
        </div>

        <div>
          <span>Efectivo contado</span>
          <strong>{formatBs(efectivoContadoNum)}</strong>
        </div>

        <div>
          <span>Diferencia</span>
          <strong
            className={
              esFaltante
                ? "cc-modal-faltante"
                : esSobrante
                ? "cc-modal-sobrante"
                : "cc-modal-exacto"
            }
          >
            {formatBs(Math.abs(diferencia))}
          </strong>
        </div>

        <div>
          <span>Estado</span>
          <strong>{estadoOk ? "Listo para cerrar" : "Revisar diferencia"}</strong>
        </div>
      </div>

      <div className="cc-modal-observacion">
        <span>Observaciones</span>
        <p>{observaciones || "Sin observaciones."}</p>
      </div>

      <div className="cc-modal-alerta">
        Una vez confirmado, el cierre quedará registrado en la base de datos.
      </div>

      <div className="cc-modal-actions">
        <button
          type="button"
          className="cc-modal-btn-cancelar"
          onClick={() => setMostrarModalCierre(false)}
          disabled={cerrandoCaja}
        >
          Cancelar
        </button>

        <button
          type="button"
          className="cc-modal-btn-confirmar"
          onClick={confirmarCierreCaja}
          disabled={cerrandoCaja}
        >
          <Lock size={16} />
          {cerrandoCaja ? "Guardando..." : "Confirmar cierre"}
        </button>
      </div>
    </div>
  </div>
)}
      </section>
    </main>
  );
}